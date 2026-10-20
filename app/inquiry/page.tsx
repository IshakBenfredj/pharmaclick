"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HelpCircle,
  Camera,
  UploadCloud,
  CheckCircle2,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  ChevronLeft,
  Trash2,
  Info,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function MedicationInquiryPage() {
  const [medicationName, setMedicationName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryCode, setInquiryCode] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة يتعدى 5 ميغابايت. الرجاء اختيار صورة أصغر.");
        return;
      }
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !patientPhone.trim()) {
      alert("يرجى ملء اسم الدواء ورقم الهاتف للتواصل.");
      return;
    }

    setIsSubmitting(true);

    // محاكاة الإرسال وتوليد الكود المرجعي الفريد
    setTimeout(() => {
      const generatedCode = `INQ-${Math.floor(10000 + Math.random() * 90000)}`;
      setInquiryCode(generatedCode);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">استفسار عن توفر دواء</span>
        </div>

        {/* رأس الصفحة التوضيحي */}
        <div className="bg-gradient-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-8 shadow-lg text-right relative overflow-hidden">
          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime mb-3">
              <Search className="w-4 h-4" />
              <span>فحص فوري وتوجيه معتمد</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 leading-tight">
              استفسر عن توفر دواء أو مستحضر
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              هل تبحث عن دواء معين أو منتج عناية نادر؟ أرسل اسمه أو صورة علبته وسيقوم المستشار الصحي بالتحقق الفوري من التوفر واقتراح البدائل المكافئة المعتمدة رسمياً.
            </p>
          </div>
        </div>

        {!submitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* نموذج الاستفسار */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs text-right">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم الدواء أو المستحضر المطلوب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    placeholder="مثال: Augmentin 1g, Panadol Extra, CeraVe Hydrating..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 transition-all font-medium"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    يمكنك كتابة الاسم التجاري أو المادة الفعالة مع تحديد الجرعة أو التركيز.
                  </span>
                </div>

                {/* رفع صورة علبة الدواء */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    صورة علبة الدواء أو الروشتة (اختياري)
                  </label>
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2">
                      <img
                        src={imagePreview}
                        alt="معاينة الصورة"
                        className="w-full h-48 object-contain rounded-xl"
                      />
                      <div className="flex items-center justify-between p-2 mt-2 bg-white rounded-xl border border-slate-100 text-xs">
                        <span className="truncate max-w-[200px] text-slate-600 font-medium">
                          {imageName}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-brand-teal/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-teal-50/30 transition-all cursor-pointer group">
                      <div className="w-12 h-12 rounded-full bg-teal-50 group-hover:bg-brand-teal group-hover:text-white text-brand-teal flex items-center justify-center mb-3 transition-colors">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 mb-1">
                        التقط صورة لعلبة الدواء أو اضغط لرفعها
                      </span>
                      <span className="text-[11px] text-slate-400">
                        PNG, JPG حتى 5 ميغابايت
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {/* بيانات المريض والتواصل */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم هاتفك للتواصل وموافاتك بالرد <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="05 / 06 / 07..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 transition-all font-medium text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم الكريم (اختياري)
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="اسمك أو لقبك"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* ملاحظات إضافية */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ملاحظات إضافية أو الكمية المطلوبة (اختياري)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي توضيحات تخص التركيز، الشكل (أقراص/شراب)، أو البديل المقبول..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 text-slate-800 transition-all font-medium"
                  />
                </div>

                {/* زر الإرسال */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-green hover:bg-emerald-600 active:scale-98 text-white font-black text-sm py-3.5 px-6 rounded-full shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                >
                  {isSubmitting ? (
                    <span>جاري فحص الاستفسار وإرساله...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>إرسال الاستفسار وتلقي الرد</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* بطاقات المساعدة والتواصل السريع */}
            <div className="space-y-6">
              {/* التواصل عبر واتساب */}
              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/80 text-right space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-black text-emerald-950 text-sm">
                  استفسار فوري مباشر عبر الواتساب
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  يمكنك أيضاً مراسلة المستشار الصحي مباشرة عبر الواتساب وإرسال صورة الوصفة أو العلبة للرد السريع.
                </p>
                <a
                  href="https://wa.me/213541790205?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AA%D9%88%D9%81%D8%B1%20%D8%AF%D9%88%D8%A7%D8%A1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors cursor-pointer w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>تواصل عبر الواتساب (0541790205)</span>
                </a>
              </div>

              {/* ضمانات الخدمة */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs text-right space-y-4">
                <h3 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2">
                  مزايا خدمة الاستفسار:
                </h3>
                <div className="space-y-3 text-xs text-slate-600 font-medium">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <span>فحص فوري ودقيق لمخزون المقر والمستودع.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                    <span>رد سريع خلال ساعات العمل المعتمدة.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-brand-deep shrink-0 mt-0.5" />
                    <span>اقتراح البدائل المكافئة المتطابقة في المادة الفعالة.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* شاشة تأكيد الإرسال الناجح */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-md text-center max-w-xl mx-auto space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-brand-green flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              تم استلام استفسارك بنجاح!
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              شكراً لتواصلك معنا. يقوم المستشار الصحي حالياً بالتحقق من توفر{" "}
              <strong className="text-brand-deep">&quot;{medicationName}&quot;</strong> وسيتم الاتصال بك أو موافاتك بالرد على الرقم{" "}
              <strong className="text-brand-deep font-mono" dir="ltr">
                {patientPhone}
              </strong>{" "}
              في أقرب وقت.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 inline-block">
              <span className="text-[11px] text-slate-400 block mb-1">
                الرقم المرجعي للاستفسار:
              </span>
              <span className="text-xl font-black text-brand-deep tracking-wider font-mono">
                {inquiryCode}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMedicationName("");
                  setImagePreview(null);
                  setNotes("");
                }}
                className="bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-6 py-3 rounded-full transition-colors cursor-pointer"
              >
                إرسال استفسار آخر
              </button>
              <Link
                href="/"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-3 rounded-full transition-colors"
              >
                العودة للرئيسية
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
