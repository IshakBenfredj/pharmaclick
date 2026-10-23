"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Award, Globe, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface BrandItemData {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  countryOfOrigin?: string;
  countryOfOriginFr?: string;
  countryOfOriginEn?: string;
  isFeatured?: boolean;
  productsCount: number;
}

interface BrandsClientViewProps {
  brands: BrandItemData[];
}

export function BrandsClientView({ brands }: BrandsClientViewProps) {
  const { t, getLocalized, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBrands = brands.filter((brand) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = brand.name.toLowerCase();
    const country = (
      getLocalized(brand, "countryOfOrigin") || ""
    ).toLowerCase();
    const desc = (getLocalized(brand, "description") || "").toLowerCase();
    return name.includes(q) || country.includes(q) || desc.includes(q);
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* مسار التنقل */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t("home")}
        </Link>
        <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep">
          {t("brandsBreadcrumb")}
        </span>
      </div>

      {/* رأس الصفحة */}
      <div className="bg-linear-to-l from-brand-deep to-brand-teal text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 text-start">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
            <Award className="w-4 h-4" />
            <span>{t("partnersLabs")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
            {t("brandsTitle")}
          </h1>
          <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
            {t("brandsDesc")}
          </p>
        </div>
      </div>

      {/* شريط البحث في الماركات */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={
              direction === "rtl"
                ? "ابحث عن علامة تجارية أو مختبر..."
                : "Rechercher une marque ou laboratoire..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-teal"
          />
          <Search
            className={`w-4 h-4 text-slate-400 absolute ${direction === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 pointer-events-none`}
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          <span>{t("allBrands")}</span>:{" "}
          <span className="text-brand-teal font-black">
            {filteredBrands.length}
          </span>
        </div>
      </div>

      {/* شبكة الماركات */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => {
            const brandDesc = getLocalized(brand, "description");
            const country = getLocalized(brand, "countryOfOrigin");

            return (
              <div
                key={brand._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-xl hover:border-brand-teal/40 transition-all duration-300 flex flex-col justify-between group text-start"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-20 h-12 bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center shrink-0">
                      <img
                        src={brand.logoUrl || "/images/default-brand.webp"}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    {country && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Globe className="w-3 h-3 text-brand-teal" />
                        <span>{country}</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-brand-deep transition-colors mb-2">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {brandDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-400 font-medium">
                    {brand.productsCount} {t("certifiedProductsCount")}
                  </span>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-deep transition-colors"
                  >
                    <span>{t("browseProducts")}</span>
                    <ChevronIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-600 mb-2">
            لم نجد علامات تجارية تطابق بحثك
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-brand-teal font-bold hover:underline"
          >
            إعادة تعيين البحث
          </button>
        </div>
      )}
    </main>
  );
}
