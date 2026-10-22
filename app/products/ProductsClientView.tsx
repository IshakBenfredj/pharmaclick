"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/LanguageContext";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Tag,
  Truck,
} from "lucide-react";

interface ProductItem {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  nameEn?: string;
  slug?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  category: string;
  categorySlug?: string;
  inStock: boolean;
  sizeOrVolume?: string;
}

interface CategoryItem {
  nameAr: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
}

interface ProductsClientViewProps {
  initialProducts: ProductItem[];
  categories: CategoryItem[];
}

export const ProductsClientView: React.FC<ProductsClientViewProps> = ({
  initialProducts,
  categories,
}) => {
  const { getLocalized, t, direction } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounts, setOnlyDiscounts] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "discount">("featured");

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // فلترة بالبحث
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const pName = (getLocalized(p, 'name') || p.name).toLowerCase();
          const matchName = pName.includes(q) || p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat) return false;
        }

        // فلترة بالقسم
        if (selectedCategory !== "all") {
          if (p.categorySlug !== selectedCategory && p.category !== selectedCategory) {
            return false;
          }
        }

        // فلترة المتوفر فقط
        if (onlyInStock && !p.inStock) {
          return false;
        }

        // فلترة الخصومات فقط
        if (onlyDiscounts && !(p.discountPercentage && p.discountPercentage > 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "discount") return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return 0;
      });
  }, [initialProducts, searchQuery, selectedCategory, onlyInStock, onlyDiscounts, sortBy, getLocalized]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setOnlyInStock(false);
    setOnlyDiscounts(false);
    setSortBy("featured");
  };

  const BreadcrumbArrow = direction === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* مسار التنقل */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t('home') || 'الرئيسية'}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">{t('allProducts') || 'كل المنتجات'}</span>
      </div>

      {/* اللافتة الترويجية العلوية */}
      <div className="bg-gradient-to-l from-brand-deep via-brand-teal to-teal-700 text-white p-6 sm:p-10 rounded-3xl mb-8 shadow-md relative overflow-hidden text-start">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-turquoise mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>{t('deliveryBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            {t('allProducts') || 'كل المنتجات والمستحضرات المعتمدة'}
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
            اكتشف تشكيلتنا الشاملة من مستحضرات العناية بالبشرة والشعر، الفيتامينات، والمكملات الغذائية من أشهر المخابر العالمية الأصلية 100%.
          </p>
        </div>
      </div>

      {/* شريط البحث وتصفية الأقسام السريعة */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs mb-8 text-start space-y-4">
        {/* حقل البحث */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pr-11 pl-10 text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* أزرار كبسولات الفئات */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-brand-teal text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {(t('all') || 'الكل')} ({initialProducts.length})
          </button>

          {categories.map((c) => {
            const catDisplayName = getLocalized(c, 'name') || c.nameAr;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.slug
                    ? "bg-brand-teal text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {catDisplayName}
              </button>
            );
          })}
        </div>
      </div>

      {/* شريط الإحصاء والفرز والخيارات المتقدمة */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4 text-right">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">
            المنتجات المعروضة:{" "}
            <span className="text-brand-teal font-black text-sm">
              {filteredProducts.length}
            </span>
          </span>

          {(selectedCategory !== "all" || searchQuery || onlyInStock || onlyDiscounts) && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:underline font-bold mr-2 cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء الفلاتر</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
          {/* فلتر المتوفر */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-brand-teal focus:ring-brand-teal w-4 h-4 cursor-pointer"
            />
            <span>المتوفر فقط</span>
          </label>

          {/* فلتر الخصومات */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyDiscounts}
              onChange={(e) => setOnlyDiscounts(e.target.checked)}
              className="rounded text-brand-teal focus:ring-brand-teal w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center gap-1 text-emerald-700">
              <Tag className="w-3 h-3" />
              <span>العروض فقط</span>
            </span>
          </label>

          {/* الترتيب */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>ترتيب:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
            >
              <option value="featured">المميزة</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
              <option value="discount">الأعلى تخفيضاً (%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* شبكة المنتجات */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                image: p.image,
                category: p.category,
                inStock: p.inStock,
                sizeOrVolume: p.sizeOrVolume,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-teal-50 text-brand-teal flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">
            لم نجد منتجات مطابقة لخيارات البحث
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            جرب كتابة اسم مختلف أو تغيير الفلاتر لعرض المستحضرات المتوفرة
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            إعادة تعيين خيارات التصفية
          </button>
        </div>
      )}
    </main>
  );
};
