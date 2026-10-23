'use client';

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface BrandDetailClientProps {
  brand: any;
  products: any[];
}

export function BrandDetailClient({ brand, products }: BrandDetailClientProps) {
  const { t, getLocalized, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;

  const brandDesc = getLocalized(brand, "description");
  const country = getLocalized(brand, "countryOfOrigin");

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* مسار التنقل */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t("home")}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
        <Link href="/brands" className="hover:text-brand-deep transition-colors">
          {t("brandsBreadcrumb")}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">{brand.name}</span>
      </div>

      {/* ترويسة الماركة */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-6 text-start">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 border border-slate-100 p-3 flex items-center justify-center shrink-0">
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {brand.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Globe className="w-3.5 h-3.5 text-brand-teal" />
              <span>{country}</span>
            </span>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3">
            {brandDesc}
          </p>
          <span className="text-xs font-bold text-brand-teal">
            {products.length} {t("brandsAvailableToBuy")}
          </span>
        </div>
      </div>

      {/* شبكة المستحضرات */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
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
                image: p.images?.[0]?.url || p.image || "",
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
            {t("brandsNoProds")}
          </p>
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-xs font-bold bg-brand-deep text-white px-5 py-2.5 rounded-full hover:bg-brand-teal transition-colors"
          >
            <span>{t("brandsBackAll")}</span>
            <ChevronIcon className="w-4 h-4" />
          </Link>
        </div>
      )}
    </main>
  );
}
