"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  FileText,
  MapPin,
  Phone,
  Menu,
  X,
  Percent,
  Truck,
  User,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const cartItemCount = 3;

  const NAV_ITEMS = [
    { label: "الرئيسية", href: "/", isHome: true },
    { label: "كافة التصنيفات", href: "/categories" },
    { label: "العناية بالبشرة", href: "/category/skincare" },
    { label: "استفسار عن دواء", href: "/inquiry", hasBadge: "فوري" },
    { label: "واقيات الشمس", href: "/category/sun-protection" },
    { label: "الفيتامينات والمكملات", href: "/category/vitamins" },
    { label: "الماركات المعتمدة", href: "/brands" },
    { label: "العروض والتخفيضات", href: "/offers", hasBadge: "خصومات" },
  ];

  // بحث فوري متجاوب
  const QUICK_SUGGESTIONS = ["سيروم هيالورونيك", "واقي شمس", "سيرافي", "بايوديرما", "أوميغا 3", "أجهزة قياس"];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-slate-100">
      {/* 1. الشريط العلوي للإعلانات والخدمة (Top Utility Bar مستوحى من Nova Santé بألوان PharmaClick) */}
      <div className="bg-brand-deep text-white text-xs py-2 px-4 border-b border-brand-teal/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* الجانب الأيمن: التوصيل والأصالة */}
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Truck className="w-3.5 h-3.5 text-brand-turquoise" />
              <span>توصيل سريع وموثوق إلى 69 ولاية في الجزائر 🇩🇿</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300 border-r border-slate-600/80 pr-4">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>مستحضرات طبية ومخبرية أصلية 100%</span>
            </span>
          </div>

          {/* الجانب الأيسر: رقم المساعدة / الواتساب ورابط الإدارة */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/213541790205"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-lime hover:text-white transition-colors font-medium text-[11px]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>خدمة الزبائن: 0541790205</span>
            </a>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <Link
              href="/admin/login"
              className="text-slate-300 hover:text-white transition-colors text-[11px] hidden sm:inline hover:underline"
            >
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>

      {/* 2. شريط التنقل الرئيسي (Main Header Row) */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* الشعار */}
          <Logo size="md" />

          {/* شريط البحث المركزي التفاعلي مع اقتراحات فورية (Live Search) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-2 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أدوية، مستحضرات عناية، فيتامينات، ماركات..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pr-11 pl-28 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-5 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>بحث</span>
              </button>
            </form>

            {/* نافذة النتائج المنسدلة للبحث الفوري (Live Search Dropdown) */}
            {isSearchFocused && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSearchFocused(false)}
                />
                <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden text-right animate-in fade-in duration-150">
                  {searchQuery.trim().length === 0 ? (
                    <div className="p-4">
                      <p className="text-xs font-bold text-slate-400 mb-2.5">
                        عمليات البحث الأكثر شيوعاً:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_SUGGESTIONS.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSearchQuery(tag);
                              window.location.href = `/search?q=${encodeURIComponent(tag)}`;
                            }}
                            className="bg-slate-50 hover:bg-teal-50 hover:text-brand-deep text-slate-600 text-xs px-3 py-1.5 rounded-full border border-slate-200/70 transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>نتائج البحث الفوري</span>
                        <span className="font-bold text-brand-teal">
                          {
                            MOCK_PRODUCTS.filter(
                              (p) =>
                                p.name.includes(searchQuery.trim()) ||
                                p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                p.category.includes(searchQuery.trim())
                            ).length
                          }{" "}
                          مستحضر
                        </span>
                      </div>

                      <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                        {MOCK_PRODUCTS.filter(
                          (p) =>
                            p.name.includes(searchQuery.trim()) ||
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.includes(searchQuery.trim())
                        ).length > 0 ? (
                          MOCK_PRODUCTS.filter(
                            (p) =>
                              p.name.includes(searchQuery.trim()) ||
                              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.category.includes(searchQuery.trim())
                          )
                            .slice(0, 5)
                            .map((prod) => (
                              <Link
                                key={prod._id}
                                href={`/product/${prod.slug}`}
                                onClick={() => setIsSearchFocused(false)}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                              >
                                <img
                                  src={prod.images[0]?.url}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-lg object-cover border border-slate-100 bg-white shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-brand-teal">
                                      {prod.brand}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      • {prod.category}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-800 truncate">
                                    {prod.name}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-black text-brand-deep">
                                      {prod.price.toLocaleString("ar-DZ")} دج
                                    </span>
                                    {prod.originalPrice && (
                                      <span className="text-[10px] text-slate-400 line-through">
                                        {prod.originalPrice.toLocaleString("ar-DZ")} دج
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            ))
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-xs text-slate-500 mb-2">
                              لم نجد مستحضرات تطابق &quot;{searchQuery}&quot;
                            </p>
                            <Link
                              href="/search"
                              className="text-xs text-brand-teal font-bold hover:underline"
                            >
                              الانتقال إلى صفحة البحث الشامل أو إرسال استفسار خاص
                            </Link>
                          </div>
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="text-xs font-bold text-brand-teal hover:text-brand-deep cursor-pointer"
                        >
                          عرض كافة النتائج لـ &quot;{searchQuery}&quot; ←
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* أزرار العمليات للزبون (تتبع، حسابي، السلة، رفع الوصفة) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* تتبع طلبيتي */}
            <Link
              href="/track-order"
              className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-brand-deep transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
            >
              <Truck className="w-5 h-5 text-brand-teal" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] text-slate-400">تابع طلبك</span>
                <span className="text-xs font-bold">تتبع طلبيتي</span>
              </div>
            </Link>

            {/* حسابي / تسجيل */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-brand-deep transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
            >
              <User className="w-5 h-5 text-brand-teal" />
              <div className="flex flex-col text-right leading-tight">
                <span className="text-[11px] text-slate-400">مرحباً بك</span>
                <span className="text-xs font-bold">تسجيل الدخول</span>
              </div>
            </Link>

            {/* سلة المشتريات (مع شارة خضراء تفاعلية كما في المرجع) */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-all text-brand-deep group"
              aria-label="سلة المشتريات"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-brand-deep group-hover:text-brand-green transition-colors" />
                <span className="absolute -top-2 -left-2 bg-brand-green text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              </div>
              <span className="hidden sm:inline font-bold text-xs text-brand-deep">
                السلة
              </span>
            </Link>

            {/* زر استفسار عن دواء السريع */}
            <Link href="/inquiry" className="hidden lg:inline-flex">
              <button
                type="button"
                className="bg-teal-50/80 hover:bg-teal-100/90 text-brand-deep border border-brand-teal/30 font-bold rounded-full py-2 px-3 text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-teal" />
                <span>استفسار عن دواء</span>
              </button>
            </Link>

            {/* زر رفع الوصفة الطبية البارز (CTA) */}
            <Link href="/prescription" className="hidden xl:inline-flex">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FileText className="w-4 h-4 text-brand-teal" />}
                className="border-brand-teal text-brand-deep hover:bg-brand-teal/5 font-bold rounded-full py-2 px-3.5 text-xs"
              >
                تحضير وصفة (استلام مباشر من المقر)
              </Button>
            </Link>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-brand-deep focus:outline-none rounded-lg"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* شريط البحث للهواتف المحمولة */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أدوية أو مستحضرات عناية..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pr-10 pl-4 text-xs focus:outline-none focus:border-brand-teal text-slate-800"
            />
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* 3. شريط كبسولات الأقسام (Pills Sub-Navigation Bar المستوحى حرفياً من المرجع بألوان PharmaClick) */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden md:block overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs font-semibold gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = item.isHome ? pathname === "/" : pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
                    isActive
                      ? "bg-brand-teal text-white shadow-xs"
                      : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasBadge && (
                    <span className="bg-brand-green text-white text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider">
                      {item.hasBadge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pharmacy-location"
              className="flex items-center gap-1.5 text-brand-teal hover:text-brand-deep font-bold transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-turquoise" />
              <span>موقعنا وفروعنا</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. القائمة المنسدلة للهواتف */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              href="/prescription"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 bg-teal-50 text-brand-deep rounded-2xl font-bold text-sm border border-teal-100"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">تحضير وصفة مسبقاً</div>
                <div className="text-[11px] text-slate-500 font-normal">
                  استلام مباشر (نطاق 5 كم)
                </div>
              </div>
            </Link>

            <Link
              href="/inquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 p-3 bg-emerald-50 text-brand-deep rounded-2xl font-bold text-sm border border-emerald-100"
            >
              <div className="w-8 h-8 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-brand-deep">استفسار عن دواء</div>
                <div className="text-[11px] text-slate-500 font-normal">
                  بالاسم أو صورة العلبة رد فوري
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-1">
            <Link
              href="/category/medicines"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              الأدوية والاستفسارات
            </Link>
            <Link
              href="/category/skincare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              العناية بالبشرة
            </Link>
            <Link
              href="/category/vitamins"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              الفيتامينات والمكملات
            </Link>
            <Link
              href="/category/baby"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              الأم والرضيع
            </Link>
            <Link
              href="/promotions"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-2.5 bg-emerald-50 text-brand-green rounded-xl text-center font-black flex items-center justify-center gap-1.5"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>العروض والتخفيضات الحصرية</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-medium">
            <Link href="/pharmacy-location" onClick={() => setMobileMenuOpen(false)}>
              موقعنا وفروعنا
            </Link>
            <Link href="/track-order" onClick={() => setMobileMenuOpen(false)}>
              تتبع طلبيتي
            </Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              اتصل بنا
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
