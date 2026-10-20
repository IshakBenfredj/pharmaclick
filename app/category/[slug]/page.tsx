import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/data/mockData";
import { ChevronLeft, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Filter products belonging to this category
  const products = MOCK_PRODUCTS.filter((p) => p.categorySlug === slug);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* مسار التنقل (Breadcrumbs) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/categories" className="hover:text-brand-deep transition-colors">
            التصنيفات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">{category.nameAr}</span>
        </div>

        {/* رأس القسم */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl text-right">
            <span className="text-xs font-bold text-brand-teal mb-1 block font-mono">
              {category.nameFr}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {category.nameAr}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
              {category.descriptionAr}
            </p>

            {/* الفئات الفرعية المتاحة */}
            {category.subCategories && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 self-center">
                  الأقسام الفرعية:
                </span>
                {category.subCategories.map((sub, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {sub.nameAr}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-inner">
            <img
              src={category.image}
              alt={category.nameAr}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* شريط الإحصاء والفرز */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>عدد المستحضرات المتاحة:</span>
            <span className="bg-teal-50 text-brand-teal px-2.5 py-1 rounded-full">
              {products.length} مستحضر
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>ترتيب حسب:</span>
            </span>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal">
              <option>الأكثر طلباً</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
              <option>الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* شبكة المنتجات */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  _id: p._id,
                  name: p.name,
                  slug: p.slug,
                  brand: p.brand,
                  price: p.price,
                  originalPrice: p.originalPrice,
                  discountPercentage: p.discountPercentage,
                  image: p.images[0]?.url || "",
                  category: p.category,
                  inStock: p.inStock,
                  sizeOrVolume: p.sizeOrVolume,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 my-8">
            <p className="text-slate-500 text-sm mb-4">
              لا توجد مستحضرات معروضة حالياً في هذا القسم.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xs font-bold bg-brand-deep text-white px-5 py-2.5 rounded-full hover:bg-brand-teal transition-colors"
            >
              <span>العودة لكافة الأقسام</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
