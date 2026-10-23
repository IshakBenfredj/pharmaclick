"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
} from "@/lib/data/mockData";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  HelpCircle,
  MessageCircle,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function SearchContent() {
  const { t, getLocalized, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCat = searchParams.get("category") || "all";
  const initialBrand = searchParams.get("brand") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<
    "featured" | "price_asc" | "price_desc" | "discount"
  >("featured");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>(MOCK_CATEGORIES);
  const [brands, setBrands] = useState<any[]>(MOCK_BRANDS);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // جلب التصنيفات الحية
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // جلب المنتجات حياً من API البحث المتصل بقاعدة البيانات
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedBrand !== "all") params.set("brand", selectedBrand);
        if (onlyInStock) params.set("inStock", "true");
        if (maxPrice > 0 && maxPrice < 10000) params.set("maxPrice", String(maxPrice));
        if (sortBy) params.set("sortBy", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();

        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          fallbackLocalFilter();
        }
      } catch (err) {
        console.error("Error fetching live search products:", err);
        fallbackLocalFilter();
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selectedCategory, selectedBrand, onlyInStock, maxPrice, sortBy]);

  // احتياطي فلترة محلية فوري عند انقطاع الاتصال
  const fallbackLocalFilter = () => {
    const q = query.trim().toLowerCase();
    const filtered = MOCK_PRODUCTS.filter((p) => {
      if (q) {
        const localizedName = getLocalized(p, "name").toLowerCase();
        const matchesName =
          (p.name && p.name.toLowerCase().includes(q)) ||
          localizedName.includes(q);
        const matchesBrand = p.brand && p.brand.toLowerCase().includes(q);
        const matchesCategory = p.category && p.category.toLowerCase().includes(q);
        const matchesTags = p.tags && p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesTags) {
          return false;
        }
      }
      if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== "all" && p.brandId !== selectedBrand) {
        return false;
      }
      if (onlyInStock && !p.inStock) {
        return false;
      }
      if (maxPrice < 10000 && p.price > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "discount") return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      return (b.rating || 0) - (a.rating || 0);
    });

    setProducts(filtered);
  };

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
          {t("home")}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">
          {t("searchBreadcrumb")}
        </span>
      </div>

      {/* حقل البحث الرئيسي */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mb-8 text-start">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          {t("searchPageTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-5">
          {t("searchPageSub")}
        </p>

        <div className="relative max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholderLong")}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-11 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 placeholder-slate-400 transition-all font-medium text-start"
          />
          <Search className="absolute inset-s-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-e-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-start">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
                <span>{t("filterOptions")}</span>
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-brand-teal hover:underline cursor-pointer"
              >
                {t("searchResetBtn")}
              </button>
            </div>

            {/* فلتر الأقسام */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                {t("byCategory")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="all">{t("allCategories")}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {getLocalized(c, "name")}
                  </option>
                ))}
              </select>
            </div>

            {/* فلتر الماركات */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-700 block mb-2.5">
                {t("byBrand")}
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="all">{t("certifiedBrands")}</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* الحد الأقصى للسعر */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>{t("maxPrice")}</span>
                <span className="text-brand-deep font-black">
                  {maxPrice.toLocaleString()} {t("currency")}
                </span>
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
                <span>1500 {t("currency")}</span>
                <span>10000 {t("currency")}</span>
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
                <span>{t("onlyInStockFilter")}</span>
              </label>
            </div>
          </div>
        </aside>

        {/* النتائج وشريط الفرز */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-teal" />}
              <span>
                {t("searchFoundCountPrefix")}{" "}
                <span className="text-brand-teal font-black">
                  {products.length}
                </span>{" "}
                {t("searchFoundCountSuffix")}
              </span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{t("sortBy")}</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
              >
                <option value="featured">{t("sortFeaturedRating")}</option>
                <option value="price_asc">{t("sortPriceAsc")}</option>
                <option value="price_desc">{t("sortPriceDesc")}</option>
                <option value="discount">{t("sortDiscount")}</option>
              </select>
            </div>
          </div>

          {/* شبكة المنتجات أو حالة التحميل */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3 animate-pulse"
                >
                  <div className="w-full h-40 bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                  <div className="h-6 bg-slate-100 rounded-md w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => {
                const img =
                  p.image ||
                  (Array.isArray(p.images) ? p.images[0]?.url : "") ||
                  "/images/default-prod.webp";
                return (
                  <ProductCard
                    key={p._id}
                    product={{
                      _id: p._id,
                      name: p.name,
                      nameAr: p.nameAr,
                      nameFr: p.nameFr,
                      nameEn: p.nameEn,
                      slug: p.slug,
                      brand: typeof p.brand === "string" ? p.brand : p.brand?.name || "PharmaClick",
                      price: p.price,
                      originalPrice: p.originalPrice,
                      discountPercentage: p.discountPercentage,
                      image: img,
                      category: typeof p.category === "string" ? p.category : p.category?.nameAr || "",
                      inStock: p.inStock,
                      sizeOrVolume: p.sizeOrVolume,
                    }}
                  />
                );
              })}
            </div>
          ) : (
            /* في حال عدم العثور على المنتج */
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 text-brand-teal flex items-center justify-center mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800">
                {t("searchNoResultsTitle")}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {t("searchNoResultsDesc")}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/213541790205"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t("searchWhatsappBtn")}</span>
                </a>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-full transition-colors cursor-pointer"
                >
                  <span>{t("searchShowAllBtn")}</span>
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
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-500">
            {t("searchLoadingResults")}
          </div>
        }
      >
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
