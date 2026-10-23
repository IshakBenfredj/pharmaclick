"use client";

import Link from "next/link";
import { WifiOff, RotateCw, Home, PhoneCall, ShieldCheck } from "lucide-react";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-sky-50/40 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 text-center relative overflow-hidden">
        {/* Decorative Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-100 rounded-full blur-2xl pointer-events-none opacity-60" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-100 rounded-full blur-2xl pointer-events-none opacity-60" />

        {/* Brand Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-100/80 text-sky-800 text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>PharmaClick | وضع عدم الاتصال</span>
        </div>

        {/* Offline Icon Circle */}
        <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-50 animate-ping opacity-30" />
          <div className="relative w-20 h-20 rounded-full bg-linear-to-tr from-rose-100 to-amber-50 flex items-center justify-center border border-rose-200/60 shadow-inner">
            <WifiOff className="w-10 h-10 text-rose-500 stroke-[2.2]" />
          </div>
        </div>

        {/* Text Details */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mb-3">
          أنت غير متصل بالإنترنت حالياً
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          يبدو أن شبكة الإنترنت لديك قد انقطعت مؤقتاً. تحقق من اتصال الواي فاي
          أو بيانات الهاتف وسنكون جاهزين لعرض مستحضرات العناية المفضلة لديك فور
          عودة الاتصال.
        </p>

        {/* Information badge */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-8 text-right text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>نصائح لاستعادة الاتصال:</span>
          </div>
          <p className="text-slate-500 pr-4">
            • تأكد من تشغيل الواي فاي أو شبكة بيانات الهاتف (4G/5G).
          </p>
          <p className="text-slate-500 pr-4">
            • أعد تشغيل وضع الطيران ثم أوقفه لتنشيط الاتصال.
          </p>
          <p className="text-slate-500 pr-4">
            • مستحضراتك في السلة سيتم حفظها تلقائياً على جهازك.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={handleReload}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
          >
            <RotateCw className="w-4 h-4 animate-spin-reverse" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm active:scale-95 transition-all"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>

        {/* Emergency contact helper */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
          <span>للطلبات الهاتفية المستعجلة: اتصل بنا على 032-00-00-00</span>
        </div>
      </div>
    </div>
  );
}
