"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from "@/lib/data/mockData";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  X,
  HelpCircle,
  MessageCircle,
  ArrowUpDown,
  Filter,
} from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "discount">("featured");

  // تصفية المنتجات وفرزها
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      // مطابقة نص البحث
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // مطابقة التصنيف
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }

      // مطابقة الماركة
      if (selectedBrand !== "all" && p.brandId !== selectedBrand) {
        return false;
      }

      // التوفر
      if (onlyInStock && !p.inStock) {
        return false;
      }

      // السعر
      if (p.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "discount") return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [query, selectedCategory, selectedBrand, onlyInStock, maxPrice, sortBy]);

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setOnlyInStock(false);
    setMaxPrice(10000);
    setSortBy("featured");
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* مسار التنقل */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          الرئيسية
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">البحث والفلترة</span>
      </div>

      {/* حقل البحث الرئيسي */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mb-8 text-right">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          البحث في المتجر والمستحضرات المعتمدة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          ابحث بالاسم، الماركة، أو التركيبة لتصفية النتائج فوراً
        </p>

        <div className="relative max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب اسم المستحضر، الماركة (مثل CeraVe, Eucerin)، أو نوع العلاج..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-11 pl-12 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 placeholder-slate-400 transition-all font-medium"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* المحتوى الرئيسي: شريط الفلترة الجانبي + شبكة المنتجات */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* الشريط الجانبي للفلترة */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
                <span>خيارات التصفية</span>
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
              >
                إعادة ضبط
              </button>
            </div>

            {/* فلتر الأقسام */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                حسب التصنيف:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-teal"
              >
                <option value="all">كافة التصنيفات</option>
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* فلتر الماركات */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                العلامة التجارية:
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-teal"
              >
                <option value="all">كافة العلامات التجارية</option>
                {MOCK_BRANDS.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* الحد الأقصى للسعر */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>الحد الأقصى للسعر:</span>
                <span className="text-brand-deep font-black">{maxPrice.toLocaleString("ar-DZ")} دج</span>
              </div>
              <input
                type="range"
                min={1500}
                max={10000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-teal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1500 دج</span>
                <span>10000 دج</span>
              </div>
            </div>

            {/* التوفر بالمخزون */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-brand-teal focus:ring-brand-teal w-4 h-4 cursor-pointer"
                />
                <span>عرض المنتجات المتوفرة فقط</span>
              </label>
            </div>
          </div>
        </aside>

        {/* النتائج وشريط الفرز */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600">
              تم العثور على{" "}
              <span className="text-brand-teal font-black">{filteredProducts.length}</span>{" "}
              مستحضر مطابق
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>ترتيب:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal"
              >
                <option value="featured">المميزة والأعلى تقييماً</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="discount">الأعلى تخفيضاً (%)</option>
              </select>
            </div>
          </div>

          {/* شبكة المنتجات */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
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
            /* في حال عدم العثور على المنتج: بطاقة إرسال استفسار خاص */
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 text-brand-teal flex items-center justify-center mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                لم تعثر على المستحضر أو الدواء الذي تبحث عنه؟
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                لا تقلق! يمكنك إرسال استفسار مباشر باسم الدواء أو صورته وسيقوم فريقنا الصحي بالتحقق الفوري من التوفر واقتراح البدائل المكافئة المعتمدة.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/213541790205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>استفسار مباشر عبر الواتساب</span>
                </a>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-full transition-colors cursor-pointer"
                >
                  <span>عرض جميع المستحضرات</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />
      <Suspense fallback={<div className="p-12 text-center text-slate-500">جاري تحميل نتائج البحث...</div>}>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
