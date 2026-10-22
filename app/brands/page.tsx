import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MOCK_BRANDS, MOCK_PRODUCTS } from "@/lib/data/mockData";
import { ChevronLeft, Award, Globe, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "الماركات والعلامات التجارية المعتمدة | PharmaClick",
  description:
    "استكشف أشهر العلامات التجارية العالمية والمحلية المعتمدة لمستحضرات العناية والصحة والجمال في PharmaClick مع توصيل لكافة الـ 69 ولاية في الجزائر.",
};

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">الماركات المعتمدة</span>
        </div>

        {/* رأس الصفحة */}
        <div className="bg-linear-to-l from-brand-deep to-brand-teal text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
              <Award className="w-4 h-4" />
              <span>شراكات ومخابر عالمية معتمدة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
              أشهر الماركات الطبية والجلدية
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              نحن نوفر مستحضرات معتمدة 100% مباشرة من الوكلاء والمصنعين
              الرسميين، لنضمن لك أعلى معايير الجودة والأمان لبشرتك وصحتك.
            </p>
          </div>
        </div>

        {/* شبكة الماركات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_BRANDS.map((brand) => {
            const count = MOCK_PRODUCTS.filter(
              (p) => p.brandId === brand._id,
            ).length;

            return (
              <div
                key={brand._id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs hover:shadow-xl hover:border-brand-teal/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="w-20 h-12 bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center shrink-0">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      <Globe className="w-3 h-3 text-brand-teal" />
                      <span>{brand.countryOfOrigin}</span>
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-slate-800 group-hover:text-brand-deep transition-colors mb-2">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-400 font-medium">
                    {count} مستحضر معتمد
                  </span>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-brand-deep transition-colors"
                  >
                    <span>استعراض المنتجات</span>
                    <ChevronLeft className="w-4 h-4" />
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
