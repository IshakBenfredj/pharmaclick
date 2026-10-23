import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Search, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-brand-deep to-brand-teal text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-deep/20 text-3xl font-black">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              الصفحة غير موجودة
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو ربما تم نقله أو حذفه.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>الرئيسية</span>
            </Link>

            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>البحث عن مستحضر</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
