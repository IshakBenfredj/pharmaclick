"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ProductCard, ProductData } from "@/components/ui/ProductCard";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  ArrowUpDown,
  Percent,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface OffersClientViewProps {
  initialProducts: (ProductData & {
    discountPercentage?: number;
    rating?: number;
    createdAt?: string;
  })[];
}

export function OffersClientView({ initialProducts }: OffersClientViewProps) {
  const { t, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;
  const [sortBy, setSortBy] = useState<
    "discount" | "price_asc" | "price_desc" | "popular"
  >("discount");

  const sortedProducts = useMemo(() => {
    const list = [...initialProducts];
    if (sortBy === "discount") {
      return list.sort(
        (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0),
      );
    }
    if (sortBy === "price_asc") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "popular") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [initialProducts, sortBy]);

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* مسار التنقل */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t("home")}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">{t("offersSub")}</span>
      </div>

      {/* لافتة العروض البارزة */}
      <div className="bg-linear-to-l from-emerald-800 via-brand-teal to-brand-green text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 text-start">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
            <Percent className="w-4 h-4" />
            <span>{t("offersBannerBadge")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            {t("offersTitle")}
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
            {t("offersBannerDesc")}
          </p>
        </div>
      </div>

      {/* شريط الإحصاء والفرز */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>{t("activeDiscountsCount")}</span>
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black">
            {sortedProducts.length} {t("specialOffer")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{t("offersSortBy")}</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal cursor-pointer"
          >
            <option value="discount">{t("offersSortMaxDiscount")}</option>
            <option value="price_asc">{t("offersSortPriceAsc")}</option>
            <option value="price_desc">{t("offersSortPriceDesc")}</option>
            <option value="popular">{t("offersSortPopular")}</option>
          </select>
        </div>
      </div>

      {/* شبكة المستحضرات المخفضة */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((p) => (
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
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">
            لا توجد عروض حالياً
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            ترقبوا عروضنا وتخفيضاتنا الحصرية قريباً، أو تصفحوا بقية الأقسام.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-teal hover:bg-brand-deep text-white text-xs font-bold rounded-xl transition-colors"
          >
            تصفح كافة المستحضرات
          </Link>
        </div>
      )}
    </main>
  );
}
