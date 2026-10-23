"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MockProduct, MOCK_CATEGORIES } from "@/lib/data/mockData";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ShoppingBag,
  Share2,
  Star,
} from "lucide-react";

interface ProductDetailClientProps {
  product: MockProduct;
  relatedProducts: MockProduct[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  relatedProducts,
}) => {
  const { addItem } = useCart();
  const { getLocalized, t, direction } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"usage" | "warnings" | "details">(
    "usage",
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const productName = getLocalized(product, "name") || product.name;
  const productDescription =
    getLocalized(product, "description") || product.description;
  const productUsage =
    getLocalized(product, "usageInstructions") || product.usageInstructions;
  const productWarnings =
    getLocalized(product, "healthWarnings") || product.healthWarnings;

  const categoryObj = MOCK_CATEGORIES.find((c) => c.slug === product.categorySlug);
  const categoryName = (categoryObj ? getLocalized(categoryObj, "name") : null) || product.category;

  const selectedVariant = product.variants?.[selectedVariantIndex];
  const finalPrice = product.price + (selectedVariant?.priceDelta || 0);
  const originalPrice = product.originalPrice
    ? product.originalPrice + (selectedVariant?.priceDelta || 0)
    : undefined;

  const discountPercent =
    originalPrice && originalPrice > finalPrice
      ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
      : product.discountPercentage;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    const imageUrl =
      typeof product.images?.[0] === "string"
        ? product.images[0]
        : (product.images?.[0] as any)?.url || "";

    const variantLabel = selectedVariant
      ? `${selectedVariant.name || "Variant"}: ${selectedVariant.option}`
      : undefined;

    addItem(
      {
        productId: product._id || (product as any).id,
        name: productName,
        slug: product.slug,
        image: imageUrl,
        price: finalPrice,
        originalPrice: originalPrice,
        selectedVariant: variantLabel,
        stock: product.stockQuantity || (product as any).stockCount,
      },
      quantity
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const BreadcrumbArrow = direction === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div className="space-y-12">
      {/* 1. مسار التنقل (Breadcrumbs) */}
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-2 text-xs text-slate-500 flex-wrap"
      >
        <Link href="/" className="hover:text-brand-deep transition-colors">
          {t("home")}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href="/products"
          className="hover:text-brand-deep transition-colors"
        >
          {t("allProducts")}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-brand-deep transition-colors"
        >
          {categoryName}
        </Link>
        <BreadcrumbArrow className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-bold text-brand-deep truncate max-w-xs">
          {productName}
        </span>
      </nav>

      {/* 2. شبكة تفاصيل المنتج الرئيسية (معرض الصور + البطاقة التفاعلية) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs">
        {/* معرض الصور التفاعلي */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* شريط الصور المصغرة (Thumbnails) */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-slate-50 cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-brand-teal shadow-md scale-102"
                      : "border-slate-200/80 hover:border-slate-300 opacity-80"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || productName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>
          )}

          {/* الصورة الرئيسية الكبيرة */}
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100/80 group">
            <img
              src={
                product.images[selectedImageIndex]?.url ||
                product.images[0]?.url
              }
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* شارات الخصم */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {discountPercent && discountPercent > 0 && (
                <span className="bg-brand-green text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                  {t("discount")} {discountPercent}%
                </span>
              )}
            </div>

            {/* زر المشاركة */}
            <button
              onClick={handleShare}
              type="button"
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-brand-deep hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
              title={t("shareProduct")}
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="absolute top-14 left-4 bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-md animate-in fade-in">
                {t("linkCopied")}
              </span>
            )}
          </div>
        </div>

        {/* تفاصيل الشراء، الأسعار، المتغيرات، وإضافة للسلة */}
        <div className="lg:col-span-6 flex flex-col justify-between text-start">
          <div>
            {/* الماركة والتصنيف */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <Link
                href={`/brands/${product.brandId}`}
                className="text-xs font-extrabold text-brand-teal hover:underline tracking-wide"
              >
                {product.brand}
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50/80 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({product.reviewsCount})
                </span>
              </div>
            </div>

            {/* اسم المستحضر */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug mb-3">
              {productName}
            </h1>

            {/* نبذة سريعة */}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
              {productDescription}
            </p>

            {/* السعر والتخفيض */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 mb-6 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  {t("officialPrice")}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-brand-deep">
                    {finalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    {t("currency")}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {originalPrice.toLocaleString()} {t("currency")}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent && discountPercent > 0 && originalPrice && (
                <div className="text-start bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] font-bold text-brand-green block">
                    {t("youSaved")}
                  </span>
                  <span className="text-xs font-black text-emerald-700">
                    {(originalPrice - finalPrice).toLocaleString()}{" "}
                    {t("currency")}
                  </span>
                </div>
              )}
            </div>

            {/* المتغيرات إن وجدت */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-bold text-slate-700 block mb-2.5">
                  {t("choose")} {product.variants[0].name}:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        selectedVariantIndex === idx
                          ? "bg-brand-deep text-white border-brand-deep shadow-md"
                          : "bg-white text-slate-700 border-slate-200 hover:border-brand-teal/50"
                      }`}
                    >
                      <span>{v.option}</span>
                      {v.priceDelta > 0 && (
                        <span className="text-[10px] opacity-80 mx-1">
                          (+{v.priceDelta} {t("currency")})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* كمية الطلب وأزرار الإضافة للسلة */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {/* محدد الكمية */}
              <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* زر إضافة إلى السلة */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 min-w-45 bg-brand-green hover:bg-emerald-600 active:scale-98 text-white font-black text-sm py-3.5 px-6 rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {product.inStock ? t("addToCart") : t("outOfStock")}
                </span>
              </button>

              {/* رسالة النجاح عند الإضافة */}
              {addedToCart && (
                <div className="w-full text-center text-xs font-bold text-brand-green bg-emerald-50 border border-emerald-200 py-2 rounded-xl animate-in fade-in">
                  {t("addedToCartSuccess")}
                </div>
              )}
            </div>
          </div>

          {/* بطاقات الضمان والتوصيل لـ 69 ولاية */}
          <div className="grid grid-cols-2 gap-3 pt-6 mt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
              <Truck className="w-5 h-5 text-brand-turquoise shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-slate-800">
                  {t("trust69Wilayas")}
                </span>
                <span className="text-slate-400">{t("footerDeliveryDesk")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
              <ShieldCheck className="w-5 h-5 text-brand-green shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-slate-800">
                  {t("trust100Original")}
                </span>
                <span className="text-slate-400">
                  {t("officialLabs")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. تبويبات المعلومات والإرشادات الصحية */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs text-start">
        {/* أزرار التبويبات */}
        <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-100 pb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("usage")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "usage"
                ? "bg-brand-deep text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("usageTab")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("warnings")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "warnings"
                ? "bg-brand-deep text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("warningsTab")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "details"
                ? "bg-brand-deep text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t("detailsTab")}
          </button>
        </div>

        {/* محتوى التبويب النشط */}
        <div className="pt-6">
          {activeTab === "usage" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {productUsage ||
                    (direction === "rtl"
                      ? "يرجى اتباع إرشادات الاستخدام المدونة على العبوة بدقة."
                      : "Please follow the usage directions provided on the product packaging.")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  {productWarnings ||
                    (direction === "rtl"
                      ? "للاستعمال الخارجي فقط. يحفظ بعيداً عن متناول الأطفال."
                      : "For external use only. Keep out of reach of children.")}
                </p>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-400">{t("brandLabel")}</span>
                <span className="font-bold text-slate-800">
                  {product.brand}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-400">{t("categoryLabel")}</span>
                <span className="font-bold text-slate-800">
                  {categoryName}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-400">{t("volumeLabel")}</span>
                <span className="font-bold text-slate-800">
                  {product.sizeOrVolume}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span className="text-slate-400">{t("stockStatus")}</span>
                <span className="font-bold text-brand-green">
                  {t("inStockImmediate")} ({product.stockQuantity} {t("units")})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. مستحضرات مشابهة وموصى بها */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t("relatedProductsTitle")}
            </h2>
            <Link
              href={`/category/${product.categorySlug}`}
              className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
            >
              <span>{t("viewMore")}</span>
              <BreadcrumbArrow className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
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
                  image: p.images[0]?.url || "",
                  category: p.category,
                  inStock: p.inStock,
                  sizeOrVolume: p.sizeOrVolume,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
