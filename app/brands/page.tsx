import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandsClientView, BrandItemData } from "@/components/brands/BrandsClientView";
import { connectToDatabase } from "@/lib/mongodb";
import { Brand, Product } from "@/models";
import { MOCK_BRANDS, MOCK_PRODUCTS } from "@/lib/data/mockData";

export const metadata = {
  title: "الماركات والمختبرات المعتمدة | PharmaClick",
  description:
    "تصفح أشهر الماركات والمختبرات العالمية والمحلية المعتمدة لمستحضرات العناية والصحة في الجزائر مع شحن سريع لـ 69 ولاية.",
};

export default async function BrandsPage() {
  let brandsList: BrandItemData[] = [];

  // 1. محاولة جلب الماركات المعتمدة حياً من قاعدة بيانات MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const dbBrands = await Brand.find({ isActive: { $ne: false } })
        .sort({ sortOrder: 1, name: 1 })
        .lean();

      if (dbBrands && dbBrands.length > 0) {
        // حساب عدد منتجات كل ماركة عبر aggregation
        const counts = await Product.aggregate([
          { $match: { isOnlineVisible: { $ne: false } } },
          { $group: { _id: "$brand", count: { $sum: 1 } } },
        ]);

        const countMap = new Map<string, number>();
        counts.forEach((c) => {
          if (c._id) {
            countMap.set(c._id.toString(), c.count);
          }
        });

        brandsList = dbBrands.map((b: any) => {
          const pCount = countMap.get(b._id.toString()) || 0;
          return {
            _id: b._id.toString(),
            name: b.name,
            nameAr: b.nameAr || b.name,
            nameFr: b.nameFr || "",
            nameEn: b.nameEn || "",
            slug: b.slug,
            logoUrl: b.logoUrl || "/images/default-brand.webp",
            description: b.description || "",
            descriptionFr: b.descriptionFr || "",
            descriptionEn: b.descriptionEn || "",
            countryOfOrigin: b.countryOfOrigin || "",
            countryOfOriginFr: b.countryOfOriginFr || "",
            countryOfOriginEn: b.countryOfOriginEn || "",
            isFeatured: Boolean(b.isFeatured),
            productsCount: pCount,
          };
        });
      }
    } catch (err) {
      console.error("Error fetching brands from MongoDB:", err);
    }
  }

  // 2. دمج أو استكمال بـ MOCK_BRANDS لضمان ثراء العرض دائماً
  for (const mb of MOCK_BRANDS) {
    const alreadyExists = brandsList.some(
      (b) => b.slug === mb.slug || b._id === mb._id || b.name.toLowerCase() === mb.name.toLowerCase()
    );
    if (!alreadyExists) {
      const pCount = MOCK_PRODUCTS.filter(
        (p) => p.brandId === mb._id || p.brand.toLowerCase() === mb.name.toLowerCase()
      ).length;

      brandsList.push({
        _id: mb._id,
        name: mb.name,
        nameAr: mb.nameAr || mb.name,
        nameFr: mb.nameFr || "",
        nameEn: mb.nameEn || "",
        slug: mb.slug,
        logoUrl: mb.logoUrl,
        description: mb.description,
        descriptionFr: mb.descriptionFr || "",
        descriptionEn: mb.descriptionEn || "",
        countryOfOrigin: mb.countryOfOrigin,
        countryOfOriginFr: mb.countryOfOriginFr || "",
        countryOfOriginEn: mb.countryOfOriginEn || "",
        isFeatured: mb.isFeatured,
        productsCount: pCount,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <BrandsClientView brands={brandsList} />
      <Footer />
    </div>
  );
}
