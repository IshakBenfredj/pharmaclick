"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  MapPin,
  Phone,
  Menu,
  X,
  Percent,
  Truck,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/data/mockData";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface CategoryNavItem {
  _id?: string;
  nameAr: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  subCategories?: {
    nameAr: string;
    nameFr?: string;
    nameEn?: string;
    slug: string;
    image?: string;
  }[];
}

function NavigationPills() {
  const pathname = usePathname();
  const { t, getLocalized, direction } = useLanguage();
  const [openDropdownSlug, setOpenDropdownSlug] = useState<string | null>(null);
  const ChevronNext = direction === "rtl" ? ChevronLeft : ChevronRight;
  const ArrowNext = direction === "rtl" ? "←" : "→";
  const [topCategories, setTopCategories] = useState<CategoryNavItem[]>(() =>
    MOCK_CATEGORIES.slice(0, 5).map((c) => ({
      _id: c._id,
      nameAr: c.nameAr,
      nameFr: c.nameFr,
      slug: c.slug,
      subCategories: c.subCategories,
    })),
  );

  useEffect(() => {
    let isMounted = true;
    fetch("/api/categories?topNav=true&limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (
          isMounted &&
          data.success &&
          Array.isArray(data.categories) &&
          data.categories.length > 0
        ) {
          setTopCategories(data.categories);
        }
      })
      .catch((err) => {
        console.error("Error loading top categories:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // إغلاق القائمة المنسدلة عند النقر في أي مكان آخر
  useEffect(() => {
    const handleDocClick = () => setOpenDropdownSlug(null);
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 overflow-visible py-0.5 whitespace-nowrap">
      {/* 1. الرئيسية */}
      <Link
        href="/"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
          pathname === "/"
            ? "bg-brand-teal text-white shadow-xs"
            : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
        }`}
      >
        <span>{t("home")}</span>
      </Link>

      {/* 2. كل المنتجات */}
      <Link
        href="/products"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
          pathname === "/products"
            ? "bg-brand-teal text-white shadow-xs"
            : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
        }`}
      >
        <span>{t("allProducts")}</span>
      </Link>

      {/* 3. كافة التصنيفات */}
      <Link
        href="/categories"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
          pathname === "/categories"
            ? "bg-brand-teal text-white shadow-xs"
            : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
        }`}
      >
        <span>{t("allCategories")}</span>
      </Link>

      {/* 4. الماركات المعتمدة */}
      <Link
        href="/brands"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
          pathname === "/brands"
            ? "bg-brand-teal text-white shadow-xs"
            : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
        }`}
      >
        <span>{t("certifiedBrands")}</span>
      </Link>

      {/* 5. العروض والتخفيضات */}
      <Link
        href="/offers"
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap cursor-pointer text-xs font-bold ${
          pathname === "/offers"
            ? "bg-brand-teal text-white shadow-xs"
            : "text-slate-600 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
        }`}
      >
        <span>{t("offersAndDiscounts")}</span>
        <span className="bg-brand-green text-white text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider">
          {t("discount")}
        </span>
      </Link>

      {/* 6. أشهر الفئات من قاعدة البيانات مع القوائم المنسدلة عند التحويم */}
      {topCategories.map((cat) => {
        const hasSubs =
          Array.isArray(cat.subCategories) && cat.subCategories.length > 0;
        const isActive =
          pathname === `/category/${cat.slug}` ||
          pathname.startsWith(`/category/${cat.slug}?`);
        const isOpen = openDropdownSlug === cat.slug;

        return (
          <div
            key={cat.slug}
            className="relative group"
            onMouseEnter={() => setOpenDropdownSlug(cat.slug)}
            onMouseLeave={() => setOpenDropdownSlug(null)}
          >
            <div
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 select-none whitespace-nowrap text-xs font-bold ${
                isActive
                  ? "bg-brand-teal text-white shadow-xs"
                  : "text-slate-700 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200/80"
              }`}
            >
              <Link
                href={`/category/${cat.slug}`}
                className="cursor-pointer hover:underline"
              >
                {getLocalized(cat, "name") || cat.nameAr}
              </Link>
              {hasSubs && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenDropdownSlug((prev) =>
                      prev === cat.slug ? null : cat.slug,
                    );
                  }}
                  className={`p-0.5 rounded-full hover:bg-slate-100/60 transition-colors cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 hover:text-brand-deep"
                  }`}
                  aria-label={`تصفح أقسام ${getLocalized(cat, "name") || cat.nameAr}`}
                >
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : "group-hover:rotate-180"
                    }`}
                  />
                </button>
              )}
            </div>

            {/* القائمة المنسدلة للفئات الفرعية (Hover & Toggle Dropdown) */}
            {hasSubs && (
              <div
                className={`absolute top-full rtl:right-0 ltr:left-0 pt-1.5 transition-all duration-200 z-50 ${
                  isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-1 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100/90 p-3 min-w-67.5 text-start">
                  {/* ترويسة القائمة المنسدلة ورابط جلب كافة المنتجات */}
                  <div className="px-2.5 py-1.5 border-b border-slate-100/80 mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-400">
                      {getLocalized(cat, "name") || cat.nameAr}
                    </span>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-[11px] font-bold text-brand-teal hover:text-brand-deep hover:underline"
                    >
                      {t("viewAllResults")} {ArrowNext}
                    </Link>
                  </div>

                  {/* قائمة الفئات الفرعية بالصور والعناوين */}
                  <div className="space-y-1">
                    {cat.subCategories!.map((sub, sIdx) => {
                      const subName = getLocalized(sub, "name") || sub.nameAr;
                      return (
                        <Link
                          key={sIdx}
                          href={`/category/${cat.slug}?sub=${sub.slug}`}
                          className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={subName}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center shrink-0 text-xs font-bold">
                                {subName.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="block text-xs font-bold text-slate-700 group-hover/item:text-brand-deep truncate">
                                {subName}
                              </span>
                            </div>
                          </div>
                          <ChevronNext className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-brand-teal transition-transform shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const HeaderContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItemsCount, openDrawer } = useCart();
  const { t, getLocalized, direction, language } = useLanguage();
  const ArrowNext = direction === "rtl" ? "←" : "→";

  // بحث فوري متجاوب
  const QUICK_SUGGESTIONS =
    language === "fr"
      ? [
          "Sérum Hyaluronique",
          "Protection Solaire",
          "CeraVe",
          "Bioderma",
          "Oméga 3",
          "Compléments",
        ]
      : language === "en"
        ? [
            "Hyaluronic Serum",
            "Sunscreen",
            "CeraVe",
            "Bioderma",
            "Omega 3",
            "Supplements",
          ]
        : [
            "سيروم هيالورونيك",
            "واقي شمس",
            "سيرافي",
            "بايوديرما",
            "أوميغا 3",
            "أجهزة قياس",
          ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-slate-100">
      {/* 1. الشريط العلوي للإعلانات والخدمة (Top Utility Bar) */}
      <div className="bg-brand-deep text-white text-xs py-2 px-4 border-b border-brand-teal/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* الجانب الأيمن: التوصيل والأصالة */}
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Truck className="w-3.5 h-3.5 text-brand-turquoise" />
              <span>{t("deliveryBadge")}</span>
            </span>
          </div>

          {/* الجانب الأيسر: رقم المساعدة / الواتساب ومبدل اللغة */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/213541790205"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-brand-lime hover:text-white transition-colors font-medium text-[11px]"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t("customerService")}: 0541790205</span>
            </a>
            <span className="text-slate-500 hidden sm:inline">•</span>
            {/* مبدل اللغة في الشريط العلوي */}
            <LanguageSwitcher variant="topbar" />
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
                placeholder={t("searchPlaceholder")}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 rtl:pr-11 rtl:pl-28 ltr:pl-11 ltr:pr-28 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="absolute rtl:right-4 ltr:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <button
                type="submit"
                className="absolute rtl:left-1.5 ltr:right-1.5 top-1/2 -translate-y-1/2 bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-5 py-2 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>{t("searchButton")}</span>
              </button>
            </form>

            {/* نافذة النتائج المنسدلة للبحث الفوري (Live Search Dropdown) */}
            {isSearchFocused && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsSearchFocused(false)}
                />
                <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden text-start animate-in fade-in duration-150">
                  {searchQuery.trim().length === 0 ? (
                    <div className="p-4">
                      <p className="text-xs font-bold text-slate-400 mb-2.5">
                        {t("quickSuggestions")}
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
                        <span>{t("liveSearchResults")}</span>
                        <span className="font-bold text-brand-teal">
                          {
                            MOCK_PRODUCTS.filter(
                              (p) =>
                                p.name.includes(searchQuery.trim()) ||
                                p.brand
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase()) ||
                                p.category.includes(searchQuery.trim()),
                            ).length
                          }{" "}
                          {t("productUnit")}
                        </span>
                      </div>

                      <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                        {MOCK_PRODUCTS.filter(
                          (p) =>
                            p.name.includes(searchQuery.trim()) ||
                            p.brand
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            p.category.includes(searchQuery.trim()),
                        ).length > 0 ? (
                          MOCK_PRODUCTS.filter(
                            (p) =>
                              p.name.includes(searchQuery.trim()) ||
                              p.brand
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              p.category.includes(searchQuery.trim()),
                          )
                            .slice(0, 5)
                            .map((prod) => {
                              const displayName =
                                getLocalized(prod, "name") || prod.name;
                              return (
                                <Link
                                  key={prod._id}
                                  href={`/product/${prod.slug}`}
                                  onClick={() => setIsSearchFocused(false)}
                                  className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                                >
                                  <img
                                    src={prod.images[0]?.url}
                                    alt={displayName}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 bg-white shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-brand-teal">
                                        {prod.brand}
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        •{" "}
                                        {(() => {
                                          const catObj = MOCK_CATEGORIES.find(
                                            (c) =>
                                              c.nameAr === prod.category ||
                                              c.slug === prod.category,
                                          );
                                          return catObj
                                            ? getLocalized(catObj, "name") ||
                                                catObj.nameAr
                                            : prod.category;
                                        })()}
                                      </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-slate-800 truncate">
                                      {displayName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs font-black text-brand-deep">
                                        {prod.price.toLocaleString()}{" "}
                                        {t("currency")}
                                      </span>
                                      {prod.originalPrice && (
                                        <span className="text-[10px] text-slate-400 line-through">
                                          {prod.originalPrice.toLocaleString()}{" "}
                                          {t("currency")}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })
                        ) : (
                          <div className="p-6 text-center">
                            <p className="text-xs text-slate-500 mb-2">
                              {t("noResults")} &quot;{searchQuery}&quot;
                            </p>
                            <Link
                              href="/search"
                              className="text-xs text-brand-teal font-bold hover:underline"
                            >
                              {t("viewAllResults")}
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
                          {t("viewAllResults")} &quot;{searchQuery}&quot;{" "}
                          {ArrowNext}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* أزرار العمليات للزبون (تتبع، تغيير اللغة، السلة، عروض) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* تتبع طلبيتي */}
            <Link
              href="/track-order"
              className="hidden lg:flex items-center gap-2 text-slate-700 hover:text-brand-deep transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
            >
              <Truck className="w-5 h-5 text-brand-teal" />
              <div className="flex flex-col text-start leading-tight">
                <span className="text-[11px] text-slate-400">
                  {t("trackOrderSub")}
                </span>
                <span className="text-xs font-bold">{t("trackOrder")}</span>
              </div>
            </Link>

            {/* مبدل اللغة في الشريط الرئيسي */}
            <LanguageSwitcher variant="compact" />

            {/* سلة المشتريات */}
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex items-center gap-2 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-all text-brand-deep group cursor-pointer"
              aria-label={t("cart")}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-brand-deep group-hover:text-brand-green transition-colors" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-brand-green text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs text-brand-deep">
                {t("cart")}
              </span>
            </button>

            {/* زر العروض الحصرية (CTA) */}
            <Link href="/offers" className="hidden lg:inline-flex">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Percent className="w-4 h-4 text-brand-teal" />}
                className="border-brand-teal text-brand-deep hover:bg-brand-teal/5 font-bold rounded-full py-2 px-3.5 text-xs"
              >
                {t("offersAndDiscounts")}
              </Button>
            </Link>

            {/* زر القائمة للشاشات الصغيرة */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-brand-deep focus:outline-none rounded-lg"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
              placeholder={t("searchPlaceholder")}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 text-xs focus:outline-none focus:border-brand-teal text-slate-800"
            />
            <Search className="absolute rtl:right-3.5 ltr:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. شريط كبسولات الأقسام (Pills Sub-Navigation Bar المستوحى حرفياً من المرجع بألوان PharmaClick) */}
      <nav className="border-t border-slate-100 bg-slate-50/70 hidden md:block relative z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs font-semibold gap-2">
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-0.5">
            <Suspense
              fallback={
                <div className="h-8 w-80 bg-slate-100 rounded-full animate-pulse" />
              }
            >
              <NavigationPills />
            </Suspense>
          </div>

          <div className="flex items-center gap-3 shrink-0 ps-3">
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-brand-teal hover:text-brand-deep font-bold transition-colors whitespace-nowrap shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-brand-turquoise shrink-0" />
              <span className="whitespace-nowrap">{t("contactUs")}</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. القائمة المنسدلة للهواتف */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in fade-in slide-from-top-2 duration-200">
          {/* مبدل اللغة للهواتف */}
          <div className="pb-2 border-b border-slate-100">
            <LanguageSwitcher variant="drawer" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700 pt-1">
            <Link
              href="/category/skincare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("heroQuickSkincare")}
            </Link>
            <Link
              href="/category/sun-protection"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("catSunProtection")}
            </Link>
            <Link
              href="/category/vitamins"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("heroQuickVitamins")}
            </Link>
            <Link
              href="/category/haircare"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("heroQuickHaircare")}
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("allCategories")}
            </Link>
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-50 rounded-xl hover:bg-teal-50 hover:text-brand-teal"
            >
              {t("certifiedBrands")}
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 p-2.5 bg-emerald-50 text-brand-green rounded-xl text-center font-black flex items-center justify-center gap-1.5"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>{t("offersAndDiscounts")}</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-medium">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              {t("contactUs")}
            </Link>
            <Link href="/track-order" onClick={() => setMobileMenuOpen(false)}>
              {t("trackOrder")}
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
              {t("allProducts")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export const Header: React.FC = () => {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs h-20" />
      }
    >
      <HeaderContent />
    </Suspense>
  );
};

export default Header;
