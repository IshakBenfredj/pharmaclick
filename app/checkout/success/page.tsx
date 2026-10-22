"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  PhoneCall,
  Package,
  ArrowRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import { TOTAL_ALGERIA_WILAYAS } from "@/lib/constants/wilayas";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "ORD-2026-CONFIRMED";
  const totalAmount = searchParams.get("total") || "";
  const wilaya = searchParams.get("wilaya") || "الجزائر";
  const estimatedDays = searchParams.get("days") || "24-48 ساعة";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-100/50 text-center space-y-6">
        {/* Animated Checkmark Badge */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-tr from-brand-teal to-brand-green text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-green/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            تم استلام طلبك وتأكيده بنجاح! 🎉
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            شكراً لثقتك في متجرنا. تم تسجيل طلبيتك بنجاح وجاري تحضيرها للشحن إلى
            ولاية <strong className="text-brand-deep">{wilaya}</strong>.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto space-y-2">
          <span className="text-xs text-slate-500 font-semibold block">
            رقم طلبك المرجعي:
          </span>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono font-black text-xl sm:text-2xl text-brand-deep tracking-wider">
              {orderNumber}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-500 hover:text-brand-deep hover:bg-white border border-transparent hover:border-slate-200 transition-all text-xs font-medium flex items-center gap-1"
              title="نسخ رقم الطلب"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-brand-green" />
                  <span className="text-brand-green font-bold">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>

          {totalAmount && (
            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
              المبلغ الإجمالي للدفع عند الاستلام:{" "}
              <strong className="text-slate-900 font-extrabold text-sm">
                {Number(totalAmount).toLocaleString("ar-DZ")} دج
              </strong>
            </div>
          )}
        </div>

        {/* What Happens Next Steps */}
        <div className="text-right p-5 rounded-2xl bg-linear-to-r from-brand-deep/5 to-brand-teal/5 border border-brand-teal/15 space-y-3">
          <h3 className="font-extrabold text-sm text-brand-deep flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-teal" />
            ما الذي سيحدث بعد ذلك؟
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-deep text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                1
              </div>
              <span>
                <strong>اتصال هاتفي للتأكيد:</strong> سيتواصل معك أحد ممثلي خدمة
                العملاء هاتفياً خلال ساعات لتأكيد عنوان التسليم بدقة.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                2
              </div>
              <span>
                <strong>تجهيز الطرد والشحن:</strong> يتم تغليف المنتجات بعناية
                وتسليمها لشركة التوصيل (المدة التقديرية للوصول:{" "}
                <strong>{estimatedDays}</strong>).
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                3
              </div>
              <span>
                <strong>الدفع عند الاستلام (COD):</strong> تدفع المبلغ نقدًا
                لعون التوصيل فقط عند استلام طردك وتفقده.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/track?orderNumber=${encodeURIComponent(orderNumber)}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-bold text-sm shadow-lg shadow-brand-deep/15 hover:opacity-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>تتبع حالة طلبيتك</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>العودة للتسوق</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Trust Note */}
        <p className="text-[11px] text-slate-400 pt-2">
          خدمة التوصيل تغطي كافة الولايات الـ {TOTAL_ALGERIA_WILAYAS} الجزائرية
          • ضمان أصالة 100%
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
