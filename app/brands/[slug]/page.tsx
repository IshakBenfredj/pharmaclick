import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandDetailClient } from "@/components/brands/BrandDetailClient";
import { connectToDatabase } from "@/lib/mongodb";
import { Brand, Product } from "@/models";
import { MOCK_BRANDS, MOCK_PRODUCTS, MockBrand } from "@/lib/data/mockData";

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandDetailPageProps) {
  const { slug } = await params;
  let brandName = "العلامة التجارية";
  let description =
    "تصفح مستحضرات العلامة التجارية المعتمدة في PharmaClick مع توصيل لـ 69 ولاية.";

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const bDoc = await Brand.findOne({
        $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
        isActive: { $ne: false },
      }).lean();

      if (bDoc) {
        brandName = bDoc.name;
        if (bDoc.description) description = bDoc.description;
      }
    } catch {
      // fallback
    }
  }

  if (brandName === "العلامة التجارية") {
    const mockBrand = MOCK_BRANDS.find(
      (b) => b.slug === slug || b._id === slug,
    );
    if (mockBrand) {
      brandName = mockBrand.name;
      if (mockBrand.description) description = mockBrand.description;
    }
  }

  const title = `${brandName} | PharmaClick`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BrandDetailPage({
  params,
}: BrandDetailPageProps) {
  const { slug } = await params;
  let brand: MockBrand | null = null;
  let products: any[] = [];

  // 1. محاولة جلب الماركة ومنتجاتها من قاعدة بيانات MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const bDoc: any = await Brand.findOne({
        $or: [{ slug }, { _id: slug.match(/^[0-9a-fA-F]{24}$/) ? slug : null }],
        isActive: { $ne: false },
      }).lean();

      if (bDoc) {
        brand = {
          _id: bDoc._id.toString(),
          name: bDoc.name,
          nameAr: bDoc.nameAr || bDoc.name,
          nameFr: bDoc.nameFr || "",
          nameEn: bDoc.nameEn || "",
          slug: bDoc.slug,
          logoUrl: bDoc.logoUrl || "/images/default-brand.webp",
          description: bDoc.description || "",
          descriptionFr: bDoc.descriptionFr || "",
          descriptionEn: bDoc.descriptionEn || "",
          countryOfOrigin: bDoc.countryOfOrigin || "",
          countryOfOriginFr: bDoc.countryOfOriginFr || "",
          countryOfOriginEn: bDoc.countryOfOriginEn || "",
          isFeatured: Boolean(bDoc.isFeatured),
        };

        const dbProds = await Product.find({
          $or: [{ brand: bDoc._id }, { brand: bDoc.name }],
          isOnlineVisible: { $ne: false },
        })
          .populate("category", "nameAr nameFr slug")
          .sort({ orderCount: -1, createdAt: -1 })
          .lean();

        if (dbProds && dbProds.length > 0) {
          products = dbProds.map((p: any) => ({
            _id: p._id.toString(),
            name: p.name,
            nameAr: p.nameAr || p.name,
            nameFr: p.nameFr || "",
            nameEn: p.nameEn || "",
            slug: p.slug,
            brand: bDoc.name,
            price: p.price,
            originalPrice: p.originalPrice,
            discountPercentage: p.discountPercentage,
            image: p.images?.[0]?.url || "/images/default-prod.webp",
            category:
              p.category?.nameAr ||
              (typeof p.category === "string" ? p.category : "مستحضرات معتمدة"),
            inStock: p.inStock ?? true,
            sizeOrVolume: p.shortDescription || p.sizeOrVolume || "",
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching brand details from MongoDB:", err);
    }
  }

  // 2. بديل احتياطي متكامل من MOCK_BRANDS
  if (!brand) {
    brand = MOCK_BRANDS.find((b) => b.slug === slug || b._id === slug) || null;
  }

  if (!brand) {
    notFound();
  }

  // دمج أو استكمال المنتجات من MOCK_PRODUCTS إذا كانت النتيجة فارغة أو لتطعيم القائمة
  const mockProds = MOCK_PRODUCTS.filter(
    (p) =>
      p.brandId === brand!._id ||
      p.brand.toLowerCase() === brand!.name.toLowerCase(),
  );

  for (const mp of mockProds) {
    const alreadyExists = products.some(
      (item) => item.slug === mp.slug || item._id === mp._id,
    );
    if (!alreadyExists) {
      products.push({
        _id: mp._id,
        name: mp.name,
        nameAr: mp.nameAr || mp.name,
        nameFr: mp.nameFr || "",
        nameEn: mp.nameEn || "",
        slug: mp.slug,
        brand: mp.brand,
        price: mp.price,
        originalPrice: mp.originalPrice,
        discountPercentage: mp.discountPercentage,
        image: mp.images?.[0]?.url || "/images/default-prod.webp",
        category: mp.category,
        inStock: mp.inStock,
        sizeOrVolume: mp.sizeOrVolume,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <BrandDetailClient brand={brand} products={products} />
      <Footer />
    </div>
  );
}
