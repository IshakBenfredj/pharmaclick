"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Clock,
  Truck,
  ShieldCheck,
  Send,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { ALGERIA_WILAYAS } from "@/lib/constants/wilayas";

export default function ContactPage() {
  const { t, language, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilaya: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.phone || !formData.message) {
      setErrorMessage(t("contactFormValidation"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "حدث خطأ أثناء إرسال الرسالة");
      }

      setIsSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        wilaya: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "فشل إرسال الرسالة، يرجى المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            {t("home")}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">
            {t("contactBreadcrumb")}
          </span>
        </div>

        {/* رأس الصفحة الترحيبي */}
        <div className="bg-linear-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg text-start relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime">
              <Headphones className="w-4 h-4" />
              <span>{t("contactSupportAlways")}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              {t("contactHeroTitle")}
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              {t("contactHeroDesc")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* العمود الأول: نموذج التواصل المباشر */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs text-start">
            <h2 className="text-xl font-black text-brand-deep mb-2">
              {t("contactFormTitle")}
            </h2>
            <p className="text-xs text-slate-500 mb-6">{t("contactFormSub")}</p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-teal-50/60 border border-teal-100 rounded-2xl space-y-3 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-brand-deep">
                  {t("contactSuccessTitle")}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {t("contactSuccessDesc")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 bg-brand-deep text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-brand-teal transition-colors cursor-pointer"
                >
                  {t("contactSendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t("contactFullName")}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder={t("contactFullNamePlaceholder")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-start"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t("contactPhone")}{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="05 / 06 / 07 ..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t("contactWilayaLabel")}
                    </label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) =>
                        setFormData({ ...formData, wilaya: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all cursor-pointer text-start"
                    >
                      <option value="">{t("contactChooseWilaya")}</option>
                      {ALGERIA_WILAYAS.map((w) => {
                        const wilayaName =
                          language === "ar" ? w.nameAr : w.nameFr;
                        const formatted = `${String(w.code).padStart(2, "0")} - ${wilayaName}`;
                        return (
                          <option key={w.code} value={formatted}>
                            {formatted}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t("contactSubject")}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder={t("contactSubjectPlaceholder")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all text-start"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t("contactMessage")}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={t("contactMessagePlaceholder")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all resize-none text-start"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-brand-deep hover:bg-brand-teal text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? t("contactSubmitting")
                      : t("contactSendBtn")}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* العمود الثاني: قنوات التواصل ومعلومات الخدمة */}
          <div className="lg:col-span-5 space-y-4 text-start">
            {/* بطاقة واتساب السريعة */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black leading-tight">
                  {t("contactWhatsappTitle")}
                </h3>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  {t("contactWhatsappDesc")}
                </p>
              </div>
              <a
                href="https://wa.me/213541790205"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs px-6 py-3 rounded-full transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{t("contactWhatsappBtn")}</span>
              </a>
            </div>

            {/* بطاقة الاتصال الهاتفي وأوقات العمل */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    {t("contactPhoneTitle")}
                  </h4>
                  <a
                    href="tel:0541790205"
                    dir="ltr"
                    className="text-base font-black text-brand-deep hover:text-brand-teal transition-colors block mt-0.5"
                  >
                    0541 79 02 05
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t("contactPhoneAvail")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    {t("contactHoursTitle")}
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {t("contactHoursVal")}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t("contactFridayVal")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-brand-deep flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    {t("contactCoverageTitle")}
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {t("contactCoverageVal")}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t("contactCoverageSub")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    {t("contactQualityTitle")}
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {t("contactQualityVal")}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t("contactQualitySub")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
