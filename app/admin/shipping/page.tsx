"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  ArrowRight,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Info,
} from "lucide-react";
import {
  ALGERIA_WILAYAS,
  TOTAL_ALGERIA_WILAYAS,
} from "@/lib/constants/wilayas";
import { FormLabelWithHelp } from "@/components/ui";

export default function AdminShippingSettingsPage() {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(10000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Search filter for wilayas table
  const [wilayaSearch, setWilayaSearch] = useState<string>("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/shipping-settings");
      const data = await res.json();
      if (data?.success) {
        setIsEnabled(Boolean(data.isFreeShippingEnabled));
        setThreshold(Number(data.freeShippingThreshold) || 10000);
      }
    } catch (err) {
      console.error("Failed to load shipping settings:", err);
      setFeedback({
        type: "error",
        message:
          "تعذر تحميل الإعدادات الحالية من الخادم، تم تطبيق القيم الافتراضية.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/shipping-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isFreeShippingEnabled: isEnabled,
          freeShippingThreshold: threshold,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setFeedback({
          type: "success",
          message:
            "تم حفظ وتحديث إعدادات التوصيل المجاني بنجاح وستطبق فوراً على كافة واجهات المتجر!",
        });
      } else {
        throw new Error(data?.message || "فشل حفظ الإعدادات");
      }
    } catch (err: any) {
      console.error("Error saving shipping settings:", err);
      setFeedback({
        type: "error",
        message: err.message || "حدث خطأ أثناء حفظ الإعدادات على الخادم",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredWilayas = ALGERIA_WILAYAS.filter(
    (w) =>
      w.nameAr.includes(wilayaSearch.trim()) ||
      w.nameFr.toLowerCase().includes(wilayaSearch.trim().toLowerCase()) ||
      w.code.toString().includes(wilayaSearch.trim()),
  );

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link
                href="/"
                className="hover:text-brand-deep transition-colors"
              >
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">لوحة الإدارة</span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">
                إعدادات الشحن والتوصيل
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-deep text-white flex items-center justify-center shadow-md shadow-brand-deep/20">
                <Truck className="w-5 h-5" />
              </div>
              إعدادات التوصيل والشحن المجاني
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              التحكم في تفعيل أو تعطيل التوصيل المجاني وتحديد الحد الأدنى لقيمة
              الطلبية لكافة الـ {TOTAL_ALGERIA_WILAYAS} ولاية جزائرية.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>معاينة السلة</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-start gap-3 transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{feedback.message}</div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Main Settings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  سياسة التوصيل المجاني العامة (Free Shipping Policy)
                </h2>
                <p className="text-xs text-slate-500">
                  تحدد هذه الإعدادات ما إذا كان الشحن المجاني متاحاً للزبائن
                  وقيمة السلة المطلوبة.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isEnabled
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {isEnabled ? "مفعل حالياً" : "معطل حالياً"}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
              <p className="text-xs text-slate-500">
                جاري تحميل إعدادات الشحن...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Toggle Switch */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <FormLabelWithHelp
                    label="تفعيل ميزة التوصيل المجاني"
                    badge={isEnabled ? 'نشط' : 'غير مفعل'}
                    helpText="عند تشغيل هذا الخيار، سيحصل الزبائن على توصيل مجاني (0 دج) لكافة الـ 69 ولاية فور تجاوز سلتهم المبلغ المحدد، وسيظهر لهم شريط تقدم تفاعلي في السلة."
                  />
                  <p className="text-xs text-slate-500 max-w-xl">
                    عند التفعيل، سيظهر شريط التقدم للزبون في سلة المشتريات وسيصبح التوصيل مجانياً
                    (0 دج) لكافة الـ {TOTAL_ALGERIA_WILAYAS} ولاية فور وصول السلة للمبلغ المحدد أدناه.
                    عند التعطيل، يدفع الزبون تكلفة الشحن الاعتيادية بالكامل ولا يظهر أي شريط ترويجي.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-teal focus:ring-offset-2 ${
                      isEnabled ? "bg-brand-green" : "bg-slate-300"
                    }`}
                    role="switch"
                    aria-checked={isEnabled}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "-translate-x-7" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-slate-700 min-w-11.25">
                    {isEnabled ? "مفعل" : "معطل"}
                  </span>
                </div>
              </div>

              {/* Threshold Amount Setting */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  isEnabled
                    ? "bg-white border-brand-teal/30 shadow-sm ring-1 ring-brand-teal/10"
                    : "bg-slate-50/50 border-slate-200 opacity-60"
                }`}
              >
                <div>
                  <FormLabelWithHelp
                    label="المبلغ الذي يصبح به التوصيل مجاني (دج)"
                    htmlFor="freeShippingThresholdInput"
                    required={isEnabled}
                    helpText="الحد الأدنى بالدينار الجزائري (دج) لقيمة المنتجات في السلة حتى يتم إلغاء تكلفة الشحن بالكامل لجميع ولايات الجزائر الـ 69."
                  />
                  <p className="text-xs text-slate-500 mb-3">
                    أدخل المبلغ المطلوب بالدينار الجزائري (مثلاً: 8,000 دج أو 10,000 دج).
                  </p>

                  <div className="relative max-w-md">
                    <input
                      id="freeShippingThresholdInput"
                      type="number"
                      min={0}
                      step={500}
                      disabled={!isEnabled}
                      value={threshold}
                      onChange={(e) =>
                        setThreshold(Math.max(0, Number(e.target.value)))
                      }
                      className="w-full px-4 py-3 pl-16 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white text-slate-900 font-extrabold text-lg disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                      دج
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                {isEnabled && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-slate-500 block">
                      مبالغ مقترحة سريعة:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[5000, 8000, 10000, 12000, 15000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setThreshold(amt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            threshold === amt
                              ? "bg-brand-deep text-white border-brand-deep shadow-sm"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {amt.toLocaleString("ar-DZ")} دج
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Live Demonstration Preview */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-slate-50 to-brand-turquoise/5 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Info className="w-4 h-4 text-brand-teal" />
                  <span>معاينة مباشرة لما يراه الزبون في سلة المشتريات:</span>
                </div>

                {isEnabled ? (
                  <div className="bg-white rounded-xl p-4 border border-brand-turquoise/30 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-brand-deep flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-brand-teal" />
                        أضف بقيمة{" "}
                        <span className="text-brand-green font-extrabold">
                          {(threshold * 0.4).toLocaleString("ar-DZ")} دج
                        </span>{" "}
                        للحصول على شحن مجاني
                      </span>
                      <span className="text-slate-600 font-bold">60%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-brand-teal to-brand-green rounded-full"
                        style={{ width: "60%" }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1">
                      عند وصول السلة إلى{" "}
                      <strong className="text-brand-green">
                        {threshold.toLocaleString("ar-DZ")} دج
                      </strong>
                      ، تصبح رسوم الشحن تلقائياً <strong>0 دج</strong> في صفحة
                      الدفع لكافة الولايات الـ {TOTAL_ALGERIA_WILAYAS}.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-4 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span>
                      <strong>الخاصية معطلة:</strong> لن يظهر أي شريط أو نص
                      للتوصيل المجاني في السلة، وسيتم احتساب أسعار التوصيل
                      المعتمدة لكل ولاية بدون أي إعفاء.
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={fetchSettings}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-extrabold text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>حفظ الإعدادات وتطبيقها فوراً</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Reference: All 69 Wilayas Standard Shipping Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-teal" />
                جدول تعرفة التوصيل لولايات الجزائر ({TOTAL_ALGERIA_WILAYAS}{" "}
                ولاية كاملة)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                الأسعار المعتمدة عند عدم تفعيل الشحن المجاني أو للطلبات الأقل من
                الحد المحدد.
              </p>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الرقم..."
                value={wilayaSearch}
                onChange={(e) => setWilayaSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">الرمز</th>
                  <th className="py-3 px-4">الولاية</th>
                  <th className="py-3 px-4">الاسم اللاتيني</th>
                  <th className="py-3 px-4">توصيل المنزل</th>
                  <th className="py-3 px-4">مكتب التوزيع (Stop Desk)</th>
                  <th className="py-3 px-4">المدة المتوقعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredWilayas.map((w) => (
                  <tr
                    key={w.code}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-2.5 px-4 font-bold text-slate-900">
                      {w.code}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">
                      {w.nameAr}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-sans">
                      {w.nameFr}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-brand-deep">
                      {w.defaultHomeFee.toLocaleString("ar-DZ")} دج
                    </td>
                    <td className="py-2.5 px-4 font-bold text-brand-green">
                      {w.defaultDeskFee.toLocaleString("ar-DZ")} دج
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {w.estimatedDays}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
