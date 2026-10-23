"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

interface TimelineStep {
  step: number;
  key: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface OrderData {
  orderNumber: string;
  customerName?: string;
  phoneMasked?: string;
  shippingAddress: {
    wilayaCode: number;
    wilayaName: string;
    commune: string;
    streetAddress: string;
    deliveryType: "home" | "desk";
  };
  items: Array<{
    productName: string;
    selectedVariant?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  timeline: TimelineStep[];
}

function TrackingContent() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (initialOrderNumber && initialOrderNumber.length >= 6) {
      setOrderNumber(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setOrder(null);

    const cleanOrderNumber = orderNumber.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, "");

    if (!cleanOrderNumber) {
      setErrorMessage(t("trackOrderRequiredErr"));
      return;
    }

    if (!cleanPhone) {
      setErrorMessage(t("trackPhoneRequiredErr"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(
          cleanOrderNumber,
        )}&phone=${encodeURIComponent(cleanPhone)}`,
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || t("orderNotFound"));
      }

      setOrder(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || t("orderNotFound"));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: t("statusPending"),
          className: "bg-amber-100 text-amber-800 border-amber-200",
        };
      case "confirmed":
        return {
          text: t("statusConfirmed"),
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "processing":
        return {
          text: t("statusProcessing"),
          className: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "shipped":
        return {
          text: t("statusShipped"),
          className: "bg-cyan-100 text-cyan-800 border-cyan-200",
        };
      case "delivered":
        return {
          text: t("statusDelivered"),
          className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
      case "cancelled":
        return {
          text: t("statusCancelled"),
          className: "bg-rose-100 text-rose-800 border-rose-200",
        };
      default:
        return {
          text: status,
          className: "bg-slate-100 text-slate-800 border-slate-200",
        };
    }
  };

  const localeCode =
    language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-deep/10 text-brand-deep text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
          <span>{t("trackWilayasBadge")}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t("trackOrderTitle")}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {t("trackOrderDesc")}
        </p>
      </div>

      {/* Tracking Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-100/50 max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Number */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t("trackOrderRefInput")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                placeholder="ORD-2026-XXXXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono font-bold uppercase"
              />
            </div>

            {/* Phone */}
            <div className="text-start">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t("trackPhoneInput")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="0550XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-brand-deep/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t("trackingSearching")}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{t("trackSubmitBtn")}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden divide-y divide-slate-100 animate-fadeIn text-start">
          {/* Header Summary */}
          <div className="p-6 sm:p-8 bg-linear-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">
                {t("trackRefDetails")}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-deep font-mono tracking-wider">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t("trackOrderDate")}{" "}
                {new Date(order.createdAt).toLocaleDateString(localeCode)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                  getStatusBadge(order.status).className
                }`}
              >
                {getStatusBadge(order.status).text}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-teal" />
              <span>{t("trackTimelineTitle")}</span>
            </h3>

            <div className="relative">
              <div className="space-y-6">
                {order.timeline.map((step, idx) => {
                  const isLast = idx === order.timeline.length - 1;
                  return (
                    <div key={step.step} className="flex gap-4 relative">
                      {/* Line connector */}
                      {!isLast && (
                        <div
                          className={`absolute inset-s-4 top-8 bottom-0 w-0.5 -ms-px ${
                            step.completed ? "bg-brand-green" : "bg-slate-200"
                          }`}
                        />
                      )}

                      {/* Icon Node */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                          step.completed
                            ? "bg-brand-green text-white shadow-md shadow-brand-green/30"
                            : step.current
                              ? "bg-brand-deep text-white ring-4 ring-brand-deep/20"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.step}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 pb-4">
                        <h4
                          className={`text-sm font-bold ${
                            step.completed
                              ? "text-slate-900"
                              : step.current
                                ? "text-brand-deep font-extrabold"
                                : "text-slate-400"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50">
            {/* Delivery destination */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal" />
                <span>{t("trackDeliveryDestination")}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">
                  {t("trackWilaya")} {order.shippingAddress.wilayaName} (
                  {t("trackWilaya")} {order.shippingAddress.wilayaCode})
                </p>
                <p className="text-slate-600">
                  {t("trackCommune")} {order.shippingAddress.commune}
                </p>
                <p className="text-slate-500">
                  {t("trackAddress")}{" "}
                  {order.shippingAddress.deliveryType === "home"
                    ? order.shippingAddress.streetAddress
                    : t("trackStopDesk")}
                </p>
                <p className="text-brand-deep font-semibold pt-1">
                  {t("trackDeliveryType")}{" "}
                  {order.shippingAddress.deliveryType === "home"
                    ? t("trackHomeDelivery")
                    : t("trackDeskDelivery")}
                </p>
              </div>
            </div>

            {/* Payment & Total Amount */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                <span>{t("trackPaymentSummary")}</span>
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t("trackSubtotal")}</span>
                  <span className="font-semibold">
                    {order.subtotal.toLocaleString()} {t("currency")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{t("trackShippingFee")}</span>
                  <span className="font-semibold">
                    {order.shippingFee === 0
                      ? t("free")
                      : `${order.shippingFee.toLocaleString()} ${t("currency")}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">
                    {t("trackCodAmount")}
                  </span>
                  <span className="font-extrabold text-base text-brand-deep">
                    {order.totalAmount.toLocaleString()} {t("currency")}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium pt-1">
                  {t("trackCodNotice")}
                </p>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="p-6 sm:p-8 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-brand-deep" />
              <span>
                {t("trackPackageContents")} ({order.items.length})
              </span>
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">
                      {item.productName}
                    </span>
                    {item.selectedVariant && (
                      <span className="text-[11px] text-brand-teal mx-2">
                        ({item.selectedVariant})
                      </span>
                    )}
                    <span className="text-slate-400 block sm:inline sm:mx-3">
                      {t("trackQuantity")} {item.quantity}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {item.totalPrice.toLocaleString()} {t("currency")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Support CTA */}
          <div className="p-6 bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800">
                {t("trackNeedHelpTitle")}
              </p>
              <p className="text-slate-500">{t("trackNeedHelpSub")}</p>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-deep font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t("trackContactSupport")}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
            </div>
          }
        >
          <TrackingContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
