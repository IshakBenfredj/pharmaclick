"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Tag,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  ALGERIA_WILAYAS,
  calculateShippingFee,
  getWilayaByCode,
  TOTAL_ALGERIA_WILAYAS,
} from "@/lib/constants/wilayas";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    totalItemsCount,
    isFreeShippingEnabled,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
    hasHydrated,
  } = useCart();

  // Delivery estimator state
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number>(16); // Alger default
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");

  const selectedWilaya =
    getWilayaByCode(selectedWilayaCode) || ALGERIA_WILAYAS[0];
  const shippingFee = calculateShippingFee(
    selectedWilayaCode,
    deliveryType,
    subtotal,
    {
      isEnabled: isFreeShippingEnabled,
      threshold: freeShippingThreshold,
    },
  );
  const totalAmount = subtotal + shippingFee;

  if (!hasHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header & Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link
                href="/"
                className="hover:text-brand-deep transition-colors"
              >
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                سلة المشتريات
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-brand-deep" />
              سلة المشتريات
              {totalItemsCount > 0 && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-brand-deep/10 text-brand-deep">
                  {totalItemsCount} مستحضر
                </span>
              )}
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              إفراغ السلة
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">
                سلة مشترياتك فارغة حالياً
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                لم تقم بإضافة أي مستحضرات بعد. تصفح تشكيلتنا الواسعة من منتجات
                العناية بالبشرة، الشعر، والمكملات الغذائية الأصلية 100%.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/categories"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-bold text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2"
              >
                <span>تصفح الأقسام</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/offers"
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all inline-flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-brand-green" />
                <span>عروض وتخفيضات حصرية</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Main Column: Items List & Free shipping */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Alert Banner (Only when enabled by Admin) */}
              {isFreeShippingEnabled && freeShippingThreshold > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-turquoise/20 shadow-sm">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2 text-brand-deep">
                      <Truck className="w-4 h-4 text-brand-teal" />
                      {amountToFreeShipping > 0 ? (
                        <>
                          أضف بقيمة{" "}
                          <span className="text-brand-green font-extrabold">
                            {amountToFreeShipping.toLocaleString("ar-DZ")} دج
                          </span>{" "}
                          إضافية للاستفادة من التوصيل المجاني
                        </>
                      ) : (
                        <span className="text-brand-green font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          مبروك! طلبيتك مؤهلة للشحن المجاني لكافة الولايات الـ{" "}
                          {TOTAL_ALGERIA_WILAYAS} 🎉
                        </span>
                      )}
                    </span>
                    <span className="text-slate-600 font-bold">
                      {freeShippingProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-brand-teal via-brand-turquoise to-brand-green rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items Card */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                <div className="p-4 sm:p-5 bg-slate-50/70 hidden sm:grid grid-cols-12 text-xs font-bold text-slate-500">
                  <span className="col-span-6">المستحضر والمواصفات</span>
                  <span className="col-span-2 text-center">سعر الوحدة</span>
                  <span className="col-span-2 text-center">الكمية</span>
                  <span className="col-span-2 text-left">المجموع</span>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Product & Variant */}
                    <div className="w-full sm:col-span-6 flex items-center gap-3 sm:gap-4">
                      <div className="w-20 h-20 rounded-xl bg-slate-50 relative shrink-0 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-brand-deep transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        {item.selectedVariant && (
                          <p className="text-xs text-brand-teal font-medium mt-1">
                            {item.selectedVariant}
                          </p>
                        )}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors sm:hidden"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          حذف
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="hidden sm:block sm:col-span-2 text-center">
                      <span className="font-bold text-sm text-slate-800">
                        {item.price.toLocaleString("ar-DZ")} دج
                      </span>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <span className="block text-xs text-slate-400 line-through">
                            {item.originalPrice.toLocaleString("ar-DZ")} دج
                          </span>
                        )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-center">
                      <span className="text-xs text-slate-500 sm:hidden">
                        الكمية:
                      </span>
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors"
                          aria-label="إنقاص الكمية"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-xs sm:text-sm text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-green transition-colors"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price & Delete button */}
                    <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                      <span className="text-xs text-slate-500 sm:hidden">
                        المجموع:
                      </span>
                      <span className="font-extrabold text-base text-brand-deep">
                        {(item.price * item.quantity).toLocaleString("ar-DZ")}{" "}
                        دج
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="hidden sm:flex text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        title="حذف المستحضر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Cost Estimator */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Truck className="w-4 h-4 text-brand-teal" />
                  حاسبة تكلفة التوصيل التقديرية (تغطية لكافة الـ{" "}
                  {TOTAL_ALGERIA_WILAYAS} ولاية)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Wilaya Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      اختر ولايتك ({TOTAL_ALGERIA_WILAYAS} ولاية جزائرية):
                    </label>
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) =>
                        setSelectedWilayaCode(Number(e.target.value))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.nameAr} ({w.nameFr})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Type Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      نوع التوصيل:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("home")}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          deliveryType === "home"
                            ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        لباب المنزل
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("desk")}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                          deliveryType === "desk"
                            ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        مكتب التوزيع (Stop Desk)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimate Result */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span>
                    المدة التقديرية للتسليم إلى{" "}
                    <strong>{selectedWilaya.nameAr}</strong>:{" "}
                    <strong className="text-slate-900">
                      {selectedWilaya.estimatedDays}
                    </strong>
                  </span>
                  <span>
                    تكلفة التوصيل:{" "}
                    <strong className="text-brand-green font-extrabold text-sm">
                      {shippingFee === 0
                        ? "مجاناً"
                        : `${shippingFee.toLocaleString("ar-DZ")} دج`}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Continue Shopping Link */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-deep hover:text-brand-teal transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>متابعة التسوق وإضافة مستحضرات أخرى</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout CTA */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-5">
                <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
                  ملخص الطلبية
                </h3>

                {/* Breakdown */}
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>مجموع المستحضرات ({totalItemsCount})</span>
                    <span className="font-bold text-slate-900">
                      {subtotal.toLocaleString("ar-DZ")} دج
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>التوصيل التقديري</span>
                      <span className="text-[11px] text-slate-400">
                        ({selectedWilaya.nameAr})
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? (
                        <span className="text-brand-green font-bold">
                          مجاني
                        </span>
                      ) : (
                        `${shippingFee.toLocaleString("ar-DZ")} دج`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base">
                    <span className="font-extrabold text-slate-900">
                      المبلغ الإجمالي
                    </span>
                    <div className="text-left">
                      <span className="font-black text-xl text-brand-deep">
                        {totalAmount.toLocaleString("ar-DZ")} دج
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        شامل كافة الرسوم والتوصيل
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-extrabold text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-deep/20 hover:shadow-xl active:scale-[0.99] transition-all text-center"
                >
                  <span>متابعة إتمام الطلب (الدفع عند الاستلام)</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>الدفع عند الاستلام (COD):</strong> ادفع نقداً فور
                      استلام طلبيتك وتفقدها.
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-50 text-brand-teal flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>توصيل سريع:</strong> تغطية كاملة لكافة الولايات
                      الـ {TOTAL_ALGERIA_WILAYAS} بالجزائر.
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span>
                      <strong>منتجات أصلية 100%:</strong> من الموزعين والمخابر
                      المعتمدة مباشرة.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
