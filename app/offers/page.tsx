import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";
import { ChevronLeft, Tag, Percent, ArrowUpDown } from "lucide-react";

export const metadata = {
  title: "العروض والتخفيضات الحصرية | PharmaClick",
  description:
    "استكشف أقوى العروض والتخفيضات الحصرية على مستحضرات العناية بالبشرة، واقيات الشمس، والمكملات الغذائية مع توصيل سريع لـ 69 ولاية في الجزائر.",
};

export default function OffersPage() {
  // Only products with active discounts
  const discountedProducts = MOCK_PRODUCTS.filter(
    (p) =>
      (p.discountPercentage && p.discountPercentage > 0) ||
      (p.originalPrice && p.originalPrice > p.price),
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">العروض والتخفيضات</span>
        </div>

        {/* لافتة العروض البارزة */}
        <div className="bg-linear-to-l from-emerald-800 via-brand-teal to-brand-green text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
              <Tag className="w-4 h-4" />
              <span>تخفيضات معتمدة لفترة محدودة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
              عناية فائقة بأسعار أحلى
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              وفر حتى 20% على أشهر المستحضرات المعتمدة من أكبر الماركات العالمية
              (La Roche-Posay, Eucerin, Vichy) مع توصيل مباشر لكافة ولايات
              الجزائر الـ 69.
            </p>
          </div>
        </div>

        {/* شريط الإحصاء والفرز */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>مستحضرات مخفضة متوفرة حالياً:</span>
            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black">
              {discountedProducts.length} عرض خاص
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>ترتيب حسب:</span>
            </span>
            <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-bold text-slate-700 focus:outline-none focus:border-brand-teal">
              <option>الأعلى خصماً (%)</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
              <option>الأكثر طلباً</option>
            </select>
          </div>
        </div>

        {/* شبكة المستحضرات المخفضة */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {discountedProducts.map((p) => (
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
      </main>

      <Footer />
    </div>
  );
}
