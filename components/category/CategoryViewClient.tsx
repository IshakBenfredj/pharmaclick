"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  X,
  Layers,
  ShoppingBag,
  CheckCircle2,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

export interface CategorySubItem {
  _id?: string;
  nameAr: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  image?: string;
  descriptionAr?: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

export interface CategoryDetailData {
  _id?: string;
  nameAr: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  icon?: string;
  image: string;
  descriptionAr?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  subCategories?: CategorySubItem[];
}

export interface CategoryProductItem {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }> | any[];
  category: string;
  categorySlug: string;
  subCategory?: string;
  subCategorySlug?: string;
  isDirectParent: boolean;
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
  sizeOrVolume?: string;
  isBestSeller?: boolean;
}

interface CategoryViewClientProps {
  category: CategoryDetailData;
  initialProducts: CategoryProductItem[];
  initialSubSlug?: string;
}

export function CategoryViewClient({
  category,
  initialProducts,
  initialSubSlug,
}: CategoryViewClientProps) {
  const { getLocalized, t, direction } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<string>(() => {
    if (initialSubSlug) {
      const exists = category.subCategories?.some(
        (s) => s.slug === initialSubSlug,
      );
      if (exists) return initialSubSlug;
    }
    return "all";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-asc" | "price-desc" | "rating"
  >("popular");

  const allCount = initialProducts.length;

  const directParentProducts = useMemo(() => {
    return initialProducts.filter((p) => p.isDirectParent);
  }, [initialProducts]);

  const directParentCount = directParentProducts.length;

  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (category.subCategories) {
      for (const sub of category.subCategories) {
        counts[sub.slug] = initialProducts.filter(
          (p) => p.subCategorySlug === sub.slug || p.subCategory === sub.nameAr,
        ).length;
      }
    }
    return counts;
  }, [category.subCategories, initialProducts]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by selected subcategory / parent
    if (activeFilter === "parent") {
      list = list.filter((p) => p.isDirectParent);
    } else if (activeFilter !== "all") {
      list = list.filter(
        (p) =>
          p.subCategorySlug === activeFilter ||
          (category.subCategories?.find((s) => s.slug === activeFilter)
            ?.nameAr &&
            p.subCategory ===
              category.subCategories.find((s) => s.slug === activeFilter)
                ?.nameAr),
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)),
      );
    }

    // Sort
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [
    initialProducts,
    activeFilter,
    searchQuery,
    sortBy,
    category.subCategories,
  ]);

  const categoryTitle = getLocalized(category, "name") || category.nameAr;
  const categoryDesc =
    getLocalized(category, "description") || category.descriptionAr;

  const activeFilterLabel = useMemo(() => {
    if (activeFilter === "all") return t("all");
    if (activeFilter === "parent")
      return `${categoryTitle} ${t("mainDepartment")}`;
    const sub = category.subCategories?.find((s) => s.slug === activeFilter);
    return sub ? getLocalized(sub, "name") || sub.nameAr : activeFilter;
  }, [activeFilter, category, categoryTitle, t, getLocalized]);

  const BreadcrumbArrow = direction === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-8">
      {/* 1. مسار التنقل (Breadcrumbs) */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t("home")}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href="/categories"
          className="hover:text-brand-deep transition-colors"
        >
          {t("allCategories")}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">{categoryTitle}</span>
        {activeFilter !== "all" && (
          <>
            <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-brand-teal">
              {activeFilterLabel}
            </span>
          </>
        )}
      </div>

      {/* 2. رأس القسم (Category Hero Header) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="max-w-2xl text-start z-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-2">
            {categoryTitle}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
            {categoryDesc ||
              (direction === "rtl"
                ? "تشكيلة متكاملة من مستحضرات العناية والصحة المعتمدة والمضمونة 100% مع توصيل سريع لكافة الـ 69 ولاية."
                : "A complete collection of 100% genuine health and beauty essentials delivered swiftly to 69 wilayas.")}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 text-brand-deep">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>{t("trust100Original")}</span>
            </span>
            <span>•</span>
            <span>
              {t("totalProductsAvailable")}{" "}
              <strong className="text-brand-deep font-black">{allCount}</strong>{" "}
              {t("productUnit")}
            </span>
          </div>
        </div>

        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border border-slate-100 shadow-md bg-slate-50">
          <img
            src={category.image}
            alt={categoryTitle}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3. شريط الفئات بالصور (Visual Subcategories Filter Bar) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
            <h2 className="text-sm font-black text-slate-800">
              {t("browseAndFilterVisual")}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {t("clickToFilterInstant")}
          </span>
        </div>

        {/* كروت الفلترة الأفقية التفاعلية */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar py-2 px-1">
          {/* كرت 1: زر "الكل" */}
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border text-start transition-all duration-200 shrink-0 select-none cursor-pointer group ${
              activeFilter === "all"
                ? "bg-linear-to-l from-brand-deep/10 via-brand-teal/10 to-teal-50 border-brand-teal ring-2 ring-brand-teal/30 shadow-md"
                : "bg-white border-slate-200/90 hover:border-brand-teal/40 hover:shadow-xs"
            }`}
          >
            <div
              className={`w-13 h-13 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                activeFilter === "all"
                  ? "bg-brand-deep text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 group-hover:bg-teal-50 group-hover:text-brand-teal"
              }`}
            >
              <Layers className="w-6 h-6" />
            </div>
            <div className="min-w-28">
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className={`text-xs sm:text-sm font-black transition-colors ${
                    activeFilter === "all"
                      ? "text-brand-deep"
                      : "text-slate-800 group-hover:text-brand-deep"
                  }`}
                >
                  {t("all")}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeFilter === "all"
                      ? "bg-brand-deep text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {allCount}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block truncate">
                {t("all")} {categoryTitle}
              </span>
            </div>
          </button>

          {/* كرت 2: فئة الأب الأساسية إن احتوت على منتجات مباشرة */}
          {directParentCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter("parent")}
              className={`flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border text-start transition-all duration-200 shrink-0 select-none cursor-pointer group ${
                activeFilter === "parent"
                  ? "bg-linear-to-l from-brand-deep/10 via-brand-teal/10 to-teal-50 border-brand-teal ring-2 ring-brand-teal/30 shadow-md"
                  : "bg-white border-slate-200/90 hover:border-brand-teal/40 hover:shadow-xs"
              }`}
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-xs bg-slate-50">
                <img
                  src={category.image}
                  alt={categoryTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-28">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs sm:text-sm font-black transition-colors ${
                      activeFilter === "parent"
                        ? "text-brand-deep"
                        : "text-slate-800 group-hover:text-brand-deep"
                    }`}
                  >
                    {categoryTitle} {t("mainDepartment")}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      activeFilter === "parent"
                        ? "bg-brand-deep text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {directParentCount}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block truncate">
                  {t("generalProducts")}
                </span>
              </div>
            </button>
          )}

          {/* كروت الفئات الفرعية بالصور */}
          {category.subCategories?.map((sub) => {
            const isSelected = activeFilter === sub.slug;
            const subCount = subCategoryCounts[sub.slug] || 0;
            const subDisplayName = getLocalized(sub, "name") || sub.nameAr;

            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setActiveFilter(sub.slug)}
                className={`flex items-center gap-3.5 p-3 sm:p-3.5 rounded-2xl border text-start transition-all duration-200 shrink-0 select-none cursor-pointer group ${
                  isSelected
                    ? "bg-linear-to-l from-brand-deep/10 via-brand-teal/10 to-teal-50 border-brand-teal ring-2 ring-brand-teal/30 shadow-md"
                    : "bg-white border-slate-200/90 hover:border-brand-teal/40 hover:shadow-xs"
                }`}
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-xs bg-slate-50">
                  <img
                    src={sub.image || category.image}
                    alt={subDisplayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-28 max-w-45">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs sm:text-sm font-black truncate transition-colors ${
                        isSelected
                          ? "text-brand-deep"
                          : "text-slate-800 group-hover:text-brand-deep"
                      }`}
                    >
                      {subDisplayName}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected
                          ? "bg-brand-deep text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {subCount}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. شريط البحث والفرز والتحكم بالنتائج */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* ملخص النتائج والفلتر النشط */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs w-full md:w-auto">
          <span className="font-bold text-slate-600">
            {t("productsDisplayed")}
          </span>
          <span className="bg-teal-50 text-brand-teal font-black px-3 py-1 rounded-full border border-teal-100">
            {filteredProducts.length} {t("productUnit")}
          </span>

          {activeFilter !== "all" && (
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
              <span>
                {t("filterActive")} {activeFilterLabel}
              </span>
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className="hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                title={t("clearFilter")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* البحث الداخلي + الترتيب */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* حقل بحث سريع داخل القسم */}
          <div className="relative flex-1 md:w-56">
            <input
              type="text"
              placeholder={t("searchByNameOrBrand")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal"
            />
            <Search
              className={`w-3.5 h-3.5 text-slate-400 absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-1/2 -translate-y-1/2 pointer-events-none`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute ${direction === "rtl" ? "left-2.5" : "right-2.5"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* قائمة الترتيب */}
          <div className="flex items-center gap-1.5 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="popular">{t("sortPopular")}</option>
              <option value="price-asc">{t("sortPriceAsc")}</option>
              <option value="price-desc">{t("sortPriceDesc")}</option>
              <option value="rating">{t("sortRating")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. شبكة المنتجات (Product Grid) */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p._id}
              product={{
                _id: p._id,
                name: p.name,
                nameAr: p.nameAr,
                nameFr: p.nameFr,
                nameEn: p.nameEn,
                slug: p.slug,
                brand: p.brand,
                price: p.price,
                originalPrice: p.originalPrice,
                discountPercentage: p.discountPercentage,
                image: p.image,
                category: p.category,
                inStock: p.inStock,
                sizeOrVolume: p.sizeOrVolume,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-100 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-800">
            {t("noProductsMatchFilter")}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {searchQuery ? `"${searchQuery}"` : ""}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveFilter("all");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 text-xs font-bold bg-brand-deep text-white px-5 py-2.5 rounded-full hover:bg-brand-teal transition-colors shadow-xs cursor-pointer"
            >
              <span>
                {t("resetFilterAll")} {categoryTitle}
              </span>
              <BreadcrumbArrow className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
