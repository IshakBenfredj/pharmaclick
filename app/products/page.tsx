import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category } from "@/models";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/data/mockData";
import { ProductsClientView } from "./ProductsClientView";

export const metadata = {
  title: "كل المنتجات | PharmaClick",
  description:
    "تصفح كافة مستحضرات العناية والصحة والجمال الأصلية 100% في PharmaClick مع توصيل سريع وموثوق لكافة الـ 69 ولاية جزائرية.",
};

export default async function AllProductsPage() {
  let productsList: any[] = [];
  let categoriesList: any[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const dbProducts = await Product.find({ isOnline: { $ne: false } })
        .populate("category", "nameAr slug")
        .populate("brand", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        productsList = dbProducts.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          nameAr: p.nameAr || p.name,
          nameFr: p.nameFr || "",
          nameEn: p.nameEn || "",
          slug: p.slug,
          brand:
            p.brand?.name ||
            (typeof p.brand === "string" ? p.brand : "علامة معتمدة"),
          price: p.price,
          originalPrice: p.originalPrice || undefined,
          discountPercentage: p.discountPercentage || 0,
          image: p.images?.[0]?.url || "/images/placeholder.svg",
          category:
            p.category?.nameAr ||
            (typeof p.category === "string" ? p.category : "مستحضرات معتمدة"),
          categorySlug: p.category?.slug || "",
          inStock: p.inStock ?? true,
          sizeOrVolume: p.sizeOrVolume || "",
        }));
      }

      const dbCategories = await Category.find({ isActive: { $ne: false } })
        .select("nameAr nameFr nameEn slug")
        .lean();

      if (Array.isArray(dbCategories) && dbCategories.length > 0) {
        categoriesList = dbCategories.map((c: any) => ({
          nameAr: c.nameAr,
          nameFr: c.nameFr || "",
          nameEn: c.nameEn || "",
          slug: c.slug,
        }));
      }
    } catch (err) {
      console.warn(
        "MongoDB fetch in /products failed, falling back to mockData:",
        err,
      );
    }
  }

  // الاحتياط ببيانات الموك عند عدم وجود بيانات في DB
  if (productsList.length === 0) {
    productsList = MOCK_PRODUCTS.map((p) => ({
      _id: p._id,
      name: p.name,
      nameAr: p.nameAr || p.name,
      nameFr: p.nameFr || "",
      nameEn: p.nameEn || "",
      slug: p.slug,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercentage: p.discountPercentage,
      image: p.images[0]?.url || "",
      category: p.category,
      categorySlug: p.categorySlug,
      inStock: p.inStock,
      sizeOrVolume: p.sizeOrVolume,
    }));
  }

  if (categoriesList.length === 0) {
    categoriesList = MOCK_CATEGORIES.map((c) => ({
      nameAr: c.nameAr,
      nameFr: c.nameFr || "",
      nameEn: c.nameEn || "",
      slug: c.slug,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <ProductsClientView
        initialProducts={productsList}
        categories={categoriesList}
      />
      <Footer />
    </div>
  );
}
