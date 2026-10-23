import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category, Brand } from "@/models";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from "@/lib/data/mockData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pharmaclick.dz";
  const now = new Date();

  // 1. المسارات الثابتة الأساسية
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // مجموعات لتخزين المعرفات وتجنب التكرار
  const categorySlugs = new Map<string, Date>();
  const productSlugs = new Map<string, Date>();
  const brandSlugs = new Map<string, Date>();

  // 2. محاولة جلب الروابط الحية من MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      // الأقسام
      const dbCategories = await Category.find({ isActive: { $ne: false } })
        .select("slug updatedAt")
        .lean();
      dbCategories.forEach((c: any) => {
        if (c.slug) categorySlugs.set(c.slug, c.updatedAt ? new Date(c.updatedAt) : now);
      });

      // المستحضرات
      const dbProducts = await Product.find({ isOnlineVisible: { $ne: false } })
        .select("slug updatedAt")
        .lean();
      dbProducts.forEach((p: any) => {
        if (p.slug) productSlugs.set(p.slug, p.updatedAt ? new Date(p.updatedAt) : now);
      });

      // العلامات التجارية
      const dbBrands = await Brand.find({ isActive: { $ne: false } })
        .select("slug updatedAt")
        .lean();
      dbBrands.forEach((b: any) => {
        if (b.slug) brandSlugs.set(b.slug, b.updatedAt ? new Date(b.updatedAt) : now);
      });
    } catch (err) {
      console.error("Error fetching sitemap dynamic entries from MongoDB:", err);
    }
  }

  // 3. استكمال بالأصول التجريبية المعتمدة
  MOCK_CATEGORIES.forEach((c) => {
    if (!categorySlugs.has(c.slug)) categorySlugs.set(c.slug, now);
    if (c.subCategories) {
      c.subCategories.forEach((s) => {
        if (!categorySlugs.has(s.slug)) categorySlugs.set(s.slug, now);
      });
    }
  });

  MOCK_PRODUCTS.forEach((p) => {
    if (!productSlugs.has(p.slug)) productSlugs.set(p.slug, now);
  });

  MOCK_BRANDS.forEach((b) => {
    if (!brandSlugs.has(b.slug)) brandSlugs.set(b.slug, now);
  });

  // 4. تحويل المعرفات إلى عناصر خريطة الموقع
  const categoryEntries: MetadataRoute.Sitemap = Array.from(categorySlugs.entries()).map(
    ([slug, lastModified]) => ({
      url: `${baseUrl}/category/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    })
  );

  const productEntries: MetadataRoute.Sitemap = Array.from(productSlugs.entries()).map(
    ([slug, lastModified]) => ({
      url: `${baseUrl}/product/${slug}`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  const brandEntries: MetadataRoute.Sitemap = Array.from(brandSlugs.entries()).map(
    ([slug, lastModified]) => ({
      url: `${baseUrl}/brands/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.75,
    })
  );

  return [
    ...staticRoutes,
    ...categoryEntries,
    ...productEntries,
    ...brandEntries,
  ];
}
