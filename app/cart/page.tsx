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
import { useLanguage } from "@/context/LanguageContext";
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

  const { t, direction, language } = useLanguage();

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

  const ArrowNext = direction === "rtl" ? ArrowLeft : ArrowRight;

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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-start">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link
                href="/"
                className="hover:text-brand-deep transition-colors"
              >
                {t("home")}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                {t("cartTitle")}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-brand-deep" />
              {t("cartTitle")}
              {totalItemsCount > 0 && (
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-brand-deep/10 text-brand-deep">
                  {totalItemsCount} {t("cartItemsCount")}
                </span>
              )}
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("cartClearAll")}
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
                {t("cartEmptyTitle")}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                {t("cartEmptyDesc")}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/categories"
                className="px-6 py-3 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-bold text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t("allCategories")}</span>
                <ArrowNext className="w-4 h-4" />
              </Link>
              <Link
                href="/offers"
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Tag className="w-4 h-4 text-brand-green" />
                <span>{t("offersAndDiscounts")}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Main Column: Items List & Free shipping */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Alert Banner */}
              {isFreeShippingEnabled && freeShippingThreshold > 0 && (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-turquoise/20 shadow-sm text-start">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2 text-brand-deep">
                      <Truck className="w-4 h-4 text-brand-teal" />
                      {amountToFreeShipping > 0 ? (
                        <>
                          {t("cartFreeShippingProgress")}{" "}
                          <span className="text-brand-green font-extrabold">
                            {amountToFreeShipping.toLocaleString()}{" "}
                            {t("currency")}
                          </span>
                        </>
                      ) : (
                        <span className="text-brand-green font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          {t("cartFreeShippingEarned")}
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
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-wrap sm:grid sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 sm:col-span-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-40 sm:col-span-5 text-start">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-bold text-sm sm:text-base text-slate-800 hover:text-brand-deep transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <span>
                          {item.price.toLocaleString()} {t("currency")}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="line-through text-slate-300">
                              {item.originalPrice.toLocaleString()}{" "}
                              {t("currency")}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Decrease"
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
                          className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-green transition-colors cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price & Delete button */}
                    <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
                      <span className="font-extrabold text-base text-brand-deep">
                        {(item.price * item.quantity).toLocaleString()}{" "}
                        {t("currency")}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Cost Estimator */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 text-start">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Truck className="w-4 h-4 text-brand-teal" />
                  {t("cartDeliveryLocation")} ({TOTAL_ALGERIA_WILAYAS} Wilayas)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Wilaya Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {t("checkoutWilaya")}:
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
                          {w.code} -{" "}
                          {language === "ar" ? w.nameAr : w.nameFr || w.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Type Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      {t("checkoutDeliveryType")}:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType("home")}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          deliveryType === "home"
                            ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t("cartHomeDelivery")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType("desk")}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                          deliveryType === "desk"
                            ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {t("cartDeskDelivery")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Estimate Result */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <span>
                    <strong>
                      {language === "ar"
                        ? selectedWilaya.nameAr
                        : selectedWilaya.nameFr || selectedWilaya.nameAr}
                    </strong>
                    :{" "}
                    <strong className="text-slate-900">
                      {selectedWilaya.estimatedDays}
                    </strong>
                  </span>
                  <span>
                    {t("cartShippingFee")}:{" "}
                    <strong className="text-brand-green font-extrabold text-sm">
                      {shippingFee === 0
                        ? t("free")
                        : `${shippingFee.toLocaleString()} ${t("currency")}`}
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
                  <ArrowNext className="w-4 h-4" />
                  <span>{t("cartContinueShopping")}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary & Checkout CTA */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 text-start">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-5">
                <h3 className="font-extrabold text-lg text-slate-900 border-b border-slate-100 pb-3">
                  {t("cartOrderSummary")}
                </h3>

                {/* Breakdown */}
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>
                      {t("cartSubtotal")} ({totalItemsCount})
                    </span>
                    <span className="font-bold text-slate-900">
                      {subtotal.toLocaleString()} {t("currency")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>{t("cartShippingFee")}</span>
                      <span className="text-[11px] text-slate-400">
                        (
                        {language === "ar"
                          ? selectedWilaya.nameAr
                          : selectedWilaya.nameFr || selectedWilaya.nameAr}
                        )
                      </span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? (
                        <span className="text-brand-green font-bold">
                          {t("free")}
                        </span>
                      ) : (
                        `${shippingFee.toLocaleString()} ${t("currency")}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base">
                    <span className="font-extrabold text-slate-900">
                      {t("cartTotal")}
                    </span>
                    <div className="text-end">
                      <span className="font-black text-xl text-brand-deep">
                        {totalAmount.toLocaleString()} {t("currency")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-extrabold text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-deep/20 hover:shadow-xl active:scale-[0.99] transition-all text-center cursor-pointer"
                >
                  <span>{t("cartCheckoutBtn")}</span>
                  <ArrowNext className="w-5 h-5" />
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>{t("checkoutCodNotice")}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-50 text-brand-teal flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span>{t("trust69Wilayas")}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <span>{t("trust100Original")}</span>
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
