"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { FormLabelWithHelp } from "@/components/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setSuccessMessage("تم التحقق بنجاح! جاري تحويلك إلى لوحة التحكم...");
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location.host.startsWith('dash.')) {
            router.push('/');
          } else {
            router.push('/admin');
          }
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(data?.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@pharmaclick.dz");
    setPassword("admin123456");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-brand-deep to-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-turquoise/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-brand-deep to-brand-teal text-white shadow-xl shadow-brand-deep/30 border border-white/10 mb-2">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">
            لوحة الإدارة | PharmaClick
          </h1>
          <p className="text-xs text-slate-300">
            المنصة المركزية لإدارة المنتجات، الطلبات، والعمليات لكافة الـ 69
            ولاية
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <span className="text-sm font-extrabold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-turquoise" />
              تسجيل دخول المشرف
            </span>
            <span className="text-[11px] font-semibold text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              جلسة آمنة ومحمية
            </span>
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field with FormLabelWithHelp */}
            <div>
              <FormLabelWithHelp
                label={
                  <span className="text-white">البريد الإلكتروني الإداري</span>
                }
                htmlFor="adminEmailInput"
                required
                labelClassName="text-white"
                helpText="البريد الإلكتروني المسجل في النظام والمخصص للمسؤول أو المدير للدخول إلى لوحة التحكم."
              />
              <div className="relative">
                <input
                  id="adminEmailInput"
                  type="email"
                  required
                  dir="ltr"
                  placeholder="admin@pharmaclick.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-900/60 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field with FormLabelWithHelp */}
            <div>
              <FormLabelWithHelp
                label={<span className="text-white">كلمة المرور</span>}
                htmlFor="adminPasswordInput"
                required
                labelClassName="text-white"
                helpText="كلمة المرور المشفرة الخاصة بحساب المسؤول. يجب أن تكون سرية ولا يتم مشاركتها."
              />
              <div className="relative">
                <input
                  id="adminPasswordInput"
                  type="password"
                  required
                  dir="ltr"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-900/60 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-brand-deep/30 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>جاري التحقق والدخول...</span>
                </>
              ) : (
                <>
                  <span>دخول إلى لوحة التحكم</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-brand-turquoise hover:text-white font-semibold underline underline-offset-4 transition-colors"
            >
              تعبئة بيانات الحساب التجريبي السريع (admin@pharmaclick.dz)
            </button>
          </div>
        </div>

        {/* Return to Store Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
          >
            <span>العودة إلى متجر PharmaClick</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
