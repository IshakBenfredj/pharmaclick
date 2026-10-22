import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { connectToDatabase } from "@/lib/mongodb";
import { Category, Product } from "@/models";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mockData";
import {
  CategoryViewClient,
  CategoryDetailData,
  CategoryProductItem,
} from "@/components/category/CategoryViewClient";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sub?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  let categoryName = "القسم";
  let description = "تصفح مستحضرات العناية والصحة المعتمدة في PharmaClick مع توصيل لكافة الـ 69 ولاية.";

  const mockCat = MOCK_CATEGORIES.find((c) => c.slug === slug);
  if (mockCat) {
    categoryName = mockCat.nameAr;
    if (mockCat.descriptionAr) description = mockCat.descriptionAr;
  }

  return {
    title: `${categoryName} | PharmaClick`,
    description,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  let autoSelectSub = search?.sub;

  let categoryData: CategoryDetailData | null = null;
  let childIds: any[] = [];
  let childSlugs: string[] = [];
  let childNames: string[] = [];

  // 1. محاولة جلب التصنيف من MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      let catDoc = await Category.findOne({ slug, isActive: { $ne: false } })
        .populate("subCategories")
        .lean();

      // في حال كان الـ slug لقسم فرعي وليس رئيسياً
      if (catDoc && catDoc.parentCategory) {
        const parent = await Category.findById(catDoc.parentCategory)
          .populate("subCategories")
          .lean();
        if (parent) {
          autoSelectSub = catDoc.slug;
          catDoc = parent;
        }
      }

      if (catDoc) {
        categoryData = {
          _id: catDoc._id.toString(),
          nameAr: catDoc.nameAr,
          nameFr: catDoc.nameFr,
          slug: catDoc.slug,
          icon: catDoc.icon,
          image: catDoc.image || "/images/default-cat.webp",
          descriptionAr: catDoc.descriptionAr,
          descriptionFr: catDoc.descriptionFr,
          subCategories: (catDoc.subCategories || []).map((s: any) => ({
            _id: s._id?.toString(),
            nameAr: s.nameAr,
            nameFr: s.nameFr,
            slug: s.slug,
            image: s.image,
            descriptionAr: s.descriptionAr,
          })),
        };

        childIds = (catDoc.subCategories || []).map((s: any) => s._id);
        childSlugs = (categoryData.subCategories || []).map((s) => s.slug);
        childNames = (categoryData.subCategories || []).map((s) => s.nameAr);
      }
    } catch (err) {
      console.error("Error fetching category from MongoDB:", err);
    }
  }

  // 2. بديل احتياطي من MOCK_CATEGORIES
  if (!categoryData) {
    const mockCat = MOCK_CATEGORIES.find((c) => c.slug === slug);
    if (mockCat) {
      categoryData = {
        _id: mockCat._id,
        nameAr: mockCat.nameAr,
        nameFr: mockCat.nameFr,
        slug: mockCat.slug,
        icon: mockCat.icon,
        image: mockCat.image,
        descriptionAr: mockCat.descriptionAr,
        descriptionFr: mockCat.descriptionFr,
        subCategories: mockCat.subCategories || [],
      };
    } else {
      // التحقق مما إذا كان slug لقسم فرعي
      const parentWithSub = MOCK_CATEGORIES.find((c) =>
        c.subCategories?.some((s) => s.slug === slug)
      );
      if (parentWithSub) {
        autoSelectSub = slug;
        categoryData = {
          _id: parentWithSub._id,
          nameAr: parentWithSub.nameAr,
          nameFr: parentWithSub.nameFr,
          slug: parentWithSub.slug,
          icon: parentWithSub.icon,
          image: parentWithSub.image,
          descriptionAr: parentWithSub.descriptionAr,
          descriptionFr: parentWithSub.descriptionFr,
          subCategories: parentWithSub.subCategories || [],
        };
      }
    }

    if (categoryData) {
      childSlugs = (categoryData.subCategories || []).map((s) => s.slug);
      childNames = (categoryData.subCategories || []).map((s) => s.nameAr);
    }
  }

  if (!categoryData) {
    notFound();
  }

  // 3. جلب كافة منتجات الفئة الأب + منتجات كافة الأبناء معاً
  let productsList: CategoryProductItem[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const queryConditions: any[] = [
        { categorySlug: categoryData.slug },
        { category: categoryData._id },
      ];

      if (childIds.length > 0) {
        queryConditions.push({ subCategory: { $in: childIds } });
        queryConditions.push({ category: { $in: childIds } });
      }

      if (childSlugs.length > 0) {
        queryConditions.push({ subCategorySlug: { $in: childSlugs } });
      }

      const dbProds = await Product.find({
        $or: queryConditions,
        isOnlineVisible: { $ne: false },
      })
        .populate("category", "nameAr nameFr slug")
        .populate("subCategory", "nameAr nameFr slug image")
        .populate("brand", "name logoUrl")
        .sort({ orderCount: -1, createdAt: -1 })
        .lean();

      if (dbProds && dbProds.length > 0) {
        productsList = dbProds.map((p: any) => {
          const subCatSlug =
            p.subCategory?.slug || p.subCategorySlug || "";
          const subCatName =
            p.subCategory?.nameAr ||
            (typeof p.subCategory === "string" ? p.subCategory : "");

          const isChild =
            childSlugs.includes(subCatSlug) ||
            childNames.includes(subCatName);

          const isDirectParent = !isChild || !subCatSlug;

          return {
            _id: p._id.toString(),
            name: p.name,
            nameAr: p.nameAr || p.name,
            nameFr: p.nameFr || "",
            nameEn: p.nameEn || "",
            slug: p.slug,
            brand:
              p.brand?.name ||
              (typeof p.brand === "string" ? p.brand : "PharmaClick"),
            price: p.price,
            originalPrice: p.originalPrice,
            discountPercentage: p.discountPercentage,
            image: p.images?.[0]?.url || "/images/default-prod.webp",
            images: p.images || [],
            category:
              p.category?.nameAr ||
              (typeof p.category === "string"
                ? p.category
                : categoryData!.nameAr),
            categorySlug: p.category?.slug || categoryData!.slug,
            subCategory: subCatName || undefined,
            subCategorySlug: subCatSlug || undefined,
            isDirectParent,
            inStock: p.inStock,
            sizeOrVolume:
              p.shortDescription || p.sizeOrVolume || "",
            isBestSeller: p.isBestSeller,
          };
        });
      }
    } catch (err) {
      console.error("Error fetching category products from MongoDB:", err);
    }
  }

  // 4. استكمال / دمج مع MOCK_PRODUCTS لضمان عرض كامل وغني دائماً
  const mockProds = MOCK_PRODUCTS.filter((p) => {
    const matchesParent = p.categorySlug === categoryData!.slug;
    const matchesChildSlug =
      p.subCategorySlug && childSlugs.includes(p.subCategorySlug);
    const matchesChildName =
      p.subCategory && childNames.includes(p.subCategory);
    return matchesParent || matchesChildSlug || matchesChildName;
  });

  for (const mp of mockProds) {
    const alreadyExists = productsList.some(
      (item) => item.slug === mp.slug || item._id === mp._id
    );
    if (!alreadyExists) {
      const isChild =
        (mp.subCategorySlug && childSlugs.includes(mp.subCategorySlug)) ||
        (mp.subCategory && childNames.includes(mp.subCategory));

      const isDirectParent = !isChild || !mp.subCategorySlug;

      productsList.push({
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
        image: mp.images?.[0]?.url || "",
        images: mp.images,
        category: mp.category,
        categorySlug: mp.categorySlug,
        subCategory: mp.subCategory,
        subCategorySlug: mp.subCategorySlug,
        isDirectParent,
        inStock: mp.inStock,
        sizeOrVolume: mp.sizeOrVolume,
        isBestSeller: mp.isBestSeller,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <CategoryViewClient
          category={categoryData}
          initialProducts={productsList}
          initialSubSlug={autoSelectSub}
        />
      </main>

      <Footer />
    </div>
  );
}
