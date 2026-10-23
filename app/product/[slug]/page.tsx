import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { MockProduct, MOCK_PRODUCTS } from "@/lib/data/mockData";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function formatProductDoc(doc: any): MockProduct {
  const images =
    Array.isArray(doc.images) && doc.images.length > 0
      ? doc.images.map((img: any) => ({
          url: img.url || "/images/default-prod.webp",
          alt: img.alt || doc.name,
          isPrimary: Boolean(img.isPrimary),
        }))
      : [{ url: "/images/default-prod.webp", alt: doc.name, isPrimary: true }];

  return {
    _id: doc._id?.toString() || doc.slug,
    name: doc.name,
    nameAr: doc.nameAr || doc.name,
    nameFr: doc.nameFr || "",
    nameEn: doc.nameEn || "",
    slug: doc.slug,
    brand:
      doc.brand?.name ||
      (typeof doc.brand === "string" ? doc.brand : "PharmaClick"),
    brandId: doc.brand?._id?.toString() || doc.brand?.slug || "brand",
    category:
      doc.category?.nameAr ||
      (typeof doc.category === "string" ? doc.category : "مستحضرات معتمدة"),
    categorySlug: doc.category?.slug || doc.categorySlug || "skincare",
    subCategory: doc.subCategory?.nameAr || undefined,
    subCategorySlug: doc.subCategory?.slug || undefined,
    price: doc.price,
    originalPrice: doc.originalPrice,
    discountPercentage: doc.discountPercentage,
    images,
    inStock: doc.inStock ?? true,
    stockQuantity: doc.stockQuantity ?? 10,
    rating: doc.rating ?? 4.8,
    reviewsCount: doc.reviewsCount ?? 15,
    sizeOrVolume: doc.shortDescription || doc.sizeOrVolume || "",
    variants: Array.isArray(doc.variants) ? doc.variants : [],
    description: doc.description || "",
    descriptionAr: doc.descriptionAr || doc.description || "",
    descriptionFr: doc.descriptionFr || "",
    descriptionEn: doc.descriptionEn || "",
    usageInstructions: doc.usageInstructions || "",
    usageInstructionsFr: doc.usageInstructionsFr || "",
    usageInstructionsEn: doc.usageInstructionsEn || "",
    healthWarnings: doc.healthWarnings || "",
    healthWarningsFr: doc.healthWarningsFr || "",
    healthWarningsEn: doc.healthWarningsEn || "",
    isFeatured: Boolean(doc.isFeatured),
    isBestSeller: Boolean(doc.orderCount && doc.orderCount > 10),
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: MockProduct | null = null;

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const doc = await Product.findOne({
        $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
        isOnlineVisible: { $ne: false },
      })
        .populate("category", "nameAr nameFr slug")
        .populate("brand", "name logoUrl")
        .lean();

      if (doc) {
        product = formatProductDoc(doc);
      }
    } catch {
      // fallback
    }
  }

  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug) || null;
  }

  if (!product) {
    return {
      title: "المستحضر غير موجود | PharmaClick",
    };
  }

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    "/images/default-prod.webp";

  return {
    title: `${product.name} | PharmaClick`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: "article",
      images: [{ url: primaryImage, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product: MockProduct | null = null;
  let relatedProducts: MockProduct[] = [];

  // 1. محاولة جلب المستحضر الحقيقي من قاعدة بيانات MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const doc = await Product.findOne({
        $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
        isOnlineVisible: { $ne: false },
      })
        .populate("category", "nameAr nameFr slug")
        .populate("subCategory", "nameAr nameFr slug")
        .populate("brand", "name logoUrl slug")
        .lean();

      if (doc) {
        product = formatProductDoc(doc);

        // جلب المستحضرات ذات الصلة من نفس التصنيف أو العلامة
        const relatedDocs = await Product.find({
          _id: { $ne: doc._id },
          $or: [
            { category: (doc.category as any)?._id || doc.category },
            { brand: (doc.brand as any)?._id || doc.brand },
          ],
          isOnlineVisible: { $ne: false },
        })
          .populate("category", "nameAr nameFr slug")
          .populate("brand", "name logoUrl slug")
          .limit(4)
          .lean();

        if (relatedDocs && relatedDocs.length > 0) {
          relatedProducts = relatedDocs.map(formatProductDoc);
        }
      }
    } catch (err) {
      console.error("Error fetching product from MongoDB:", err);
    }
  }

  // 2. بديل احتياطي متكامل من MOCK_PRODUCTS إذا لم يُعثر عليه في قاعدة البيانات
  if (!product) {
    product = MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug) || null;
  }

  if (!product) {
    notFound();
  }

  // استكمال المستحضرات ذات الصلة إن لم تكن كافية
  if (relatedProducts.length < 4) {
    const fallbackRelated = MOCK_PRODUCTS.filter(
      (p) =>
        p._id !== product!._id &&
        p.slug !== product!.slug &&
        (p.categorySlug === product!.categorySlug || p.brandId === product!.brandId) &&
        !relatedProducts.some((r) => r.slug === p.slug || r._id === p._id)
    ).slice(0, 4 - relatedProducts.length);

    relatedProducts = [...relatedProducts, ...fallbackRelated];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>

      <Footer />
    </div>
  );
}
