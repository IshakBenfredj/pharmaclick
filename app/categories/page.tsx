"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_CATEGORIES } from "@/lib/data/mockData";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Droplets,
  ShieldCheck,
  Scissors,
  Heart,
  Baby,
  Activity,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Droplets":
      return <Droplets className="w-6 h-6 text-brand-teal" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-6 h-6 text-brand-teal" />;
    case "Scissors":
      return <Scissors className="w-6 h-6 text-brand-teal" />;
    case "Heart":
      return <Heart className="w-6 h-6 text-brand-teal" />;
    case "Baby":
      return <Baby className="w-6 h-6 text-brand-teal" />;
    case "Activity":
      return <Activity className="w-6 h-6 text-brand-teal" />;
    default:
      return <ShoppingBag className="w-6 h-6 text-brand-teal" />;
  }
};

export default function CategoriesPage() {
  const { t, getLocalized, direction, language } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل (Breadcrumbs) */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            {t("home")}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">
            {t("allCategories")}
          </span>
        </div>

        {/* ترويسة الصفحة */}
        <div className="bg-linear-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10 text-start">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
              <Layers className="w-4 h-4" />
              <span>{t("categoriesCatalog")}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
              {t("categoriesBrowseByCat")}
            </h1>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium">
              {t("categoriesHeroDesc")}
            </p>
          </div>
        </div>

        {/* شبكة الأقسام والتصنيفات الشجرية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MOCK_CATEGORIES.map((cat) => {
            const catName = getLocalized(cat, "name");
            const catDesc = getLocalized(cat, "description");
            const secondaryName = language === "ar" ? cat.nameFr : cat.nameAr;

            return (
              <div
                key={cat._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-brand-teal/40 transition-all duration-300 overflow-hidden flex flex-col justify-between group text-start"
              >
                <div>
                  {/* صورة القسم */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={catName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                    {/* شارة عدد المنتجات */}
                    <span className="absolute bottom-3 inset-e-3 bg-white/90 backdrop-blur-md text-brand-deep text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {cat.productCount} {t("certifiedProductsCount")}
                    </span>
                  </div>

                  {/* المحتوى والتفاصيل */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800 group-hover:text-brand-deep transition-colors">
                          {catName}
                        </h2>
                        {secondaryName && (
                          <span className="text-xs text-slate-400 font-medium font-mono">
                            {secondaryName}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {catDesc}
                    </p>

                    {/* الفئات الفرعية الشجرية (Subcategories) */}
                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 mb-2">
                          {t("subcategories")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.subCategories.map((sub, idx) => {
                            const subName = getLocalized(sub, "name");
                            return (
                              <Link
                                key={idx}
                                href={`/category/${cat.slug}?sub=${encodeURIComponent(sub.slug)}`}
                                className="bg-slate-50 hover:bg-teal-50 hover:text-brand-deep text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                              >
                                {subName}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* زر الانتقال للتصنيف */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 mt-auto">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="w-full inline-flex items-center justify-between text-xs font-bold text-brand-teal hover:text-brand-deep transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>
                      {t("exploreProductsOf")} {catName}
                    </span>
                    <ChevronIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
