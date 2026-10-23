"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Truck,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export const CartDrawer: React.FC = () => {
  const pathname = usePathname();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    subtotal,
    totalItemsCount,
    isFreeShippingEnabled,
    freeShippingThreshold,
    amountToFreeShipping,
    freeShippingProgress,
  } = useCart();
  const { t, direction } = useLanguage();

  const ArrowNext = direction === "rtl" ? ArrowLeft : ArrowRight;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  if (pathname?.startsWith("/admin") || !isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel - slides in depending on RTL/LTR */}
      <div
        className={`fixed inset-y-0 max-w-full flex z-10 w-full sm:w-110 ${
          direction === "rtl" ? "left-0 pl-0" : "right-0 pr-0"
        }`}
      >
        <div
          className={`w-full bg-white shadow-2xl flex flex-col h-full border-slate-100 ${
            direction === "rtl"
              ? "border-r animate-slideInLeft"
              : "border-l animate-slideInRight"
          }`}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-deep/10 text-brand-deep flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-brand-deep" />
              </div>
              <div className="text-start">
                <h3 className="font-bold text-slate-800 text-lg">
                  {t("cartTitle")}
                </h3>
                <p className="text-xs text-slate-500">
                  {totalItemsCount > 0
                    ? `${totalItemsCount} ${t("itemsInYourCart")}`
                    : t("cartEmptyNow")}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              aria-label={t("closeCart")}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (Only when enabled by Admin) */}
          {isFreeShippingEnabled &&
            freeShippingThreshold > 0 &&
            items.length > 0 && (
              <div className="px-5 py-3.5 bg-brand-turquoise/5 border-b border-brand-turquoise/15">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5 text-brand-deep font-semibold">
                    <Truck className="w-4 h-4 text-brand-teal" />
                    {amountToFreeShipping > 0 ? (
                      <>
                        {t("cartFreeShippingProgress")}{" "}
                        <span className="text-brand-green font-bold">
                          {amountToFreeShipping.toLocaleString()}{" "}
                          {t("currency")}
                        </span>{" "}
                        {direction === "rtl" ? "للحصول على شحن مجاني" : "for free shipping"}
                      </>
                    ) : (
                      <span className="text-brand-green font-bold">
                        {t("freeShippingCongrat")}
                      </span>
                    )}
                  </span>
                  <span className="text-slate-500 font-bold">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-brand-teal to-brand-green rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    {t("cartEmptyTitle")}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-60">
                    {t("cartEmptySub")}
                  </p>
                </div>
                <button
                  onClick={closeDrawer}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-deep text-white font-medium text-sm hover:bg-brand-deep/90 transition-all shadow-md shadow-brand-deep/15 cursor-pointer"
                >
                  <Link href="/products" onClick={closeDrawer}>
                    {t("browseProductsBtn")}
                  </Link>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl border border-slate-100 hover:border-slate-200 bg-white hover:shadow-xs transition-all relative group text-start"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden relative shrink-0 border border-slate-100 flex items-center justify-center">
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

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-bold text-sm text-slate-800 hover:text-brand-deep transition-colors line-clamp-2 leading-tight"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label={`${t("deleteItem")} ${item.name}`}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedVariant && (
                        <p className="text-[11px] text-brand-teal font-medium mt-0.5">
                          {item.selectedVariant}
                        </p>
                      )}
                    </div>

                    {/* Price and Counter */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                      <div>
                        <span className="font-extrabold text-sm text-brand-deep">
                          {(item.price * item.quantity).toLocaleString()}{" "}
                          {t("currency")}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-slate-400 block">
                            ({item.price.toLocaleString()} {t("currency")}{" "}
                            {t("perItem")})
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="-"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-brand-green transition-colors cursor-pointer"
                          aria-label="+"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
              {/* Subtotal */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>
                    {t("cartSubtotal")} ({totalItemsCount} {t("units")})
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {subtotal.toLocaleString()} {t("currency")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>{t("trust69Wilayas")}</span>
                  <span className="text-brand-teal font-medium">
                    {isFreeShippingEnabled &&
                    subtotal >= freeShippingThreshold ? (
                      <span className="text-brand-green font-bold">
                        {t("free")}
                      </span>
                    ) : (
                      t("calculatedAtCheckout")
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-brand-deep/20 hover:shadow-xl active:scale-[0.99]"
                >
                  <span>{t("drawerCheckoutBtn")}</span>
                  <ArrowNext className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium text-xs flex items-center justify-center hover:bg-slate-100 transition-colors"
                >
                  {t("viewCartDetails")}
                </Link>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>{t("trustCod")}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
