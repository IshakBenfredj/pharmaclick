"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Truck,
  ShieldCheck,
  Send,
  CheckCircle2,
  ChevronLeft,
  MapPin,
  Headphones,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// قائمة الـ 69 ولاية الجزائرية المعتمدة رسمياً
const WILAYAS_LIST = [
  "01 - أدرار",
  "02 - الشلف",
  "03 - الأغواط",
  "04 - أم البواقي",
  "05 - باتنة",
  "06 - بجاية",
  "07 - بسكرة",
  "08 - بشار",
  "09 - البليدة",
  "10 - البويرة",
  "11 - تمنراست",
  "12 - تبسة",
  "13 - تلمسان",
  "14 - تيارت",
  "15 - تيزي وزو",
  "16 - الجزائر",
  "17 - الجلفة",
  "18 - جيجل",
  "19 - سطيف",
  "20 - سعيدة",
  "21 - سكيكدة",
  "22 - سيدي بلعباس",
  "23 - عنابة",
  "24 - قالمة",
  "25 - قسنطينة",
  "26 - المدية",
  "27 - مستغانم",
  "28 - المسيلة",
  "29 - معسكر",
  "30 - ورقلة",
  "31 - وهران",
  "32 - البيض",
  "33 - إليزي",
  "34 - برج بوعريريج",
  "35 - بومرداس",
  "36 - الطارف",
  "37 - تندوف",
  "38 - تسمسيلت",
  "39 - الوادي",
  "40 - خنشلة",
  "41 - سوق أهراس",
  "42 - تيبازة",
  "43 - ميلة",
  "44 - عين الدفلى",
  "45 - النعامة",
  "46 - عين تموشنت",
  "47 - غرداية",
  "48 - غليزان",
  "49 - تيميمون",
  "50 - برج باجي مختار",
  "51 - أولاد جلال",
  "52 - بني عباس",
  "53 - عين صالح",
  "54 - عين قزام",
  "55 - تقرت",
  "56 - جانت",
  "57 - المغير",
  "58 - المنيعة",
  "59 - العريشة",
  "60 - عين وسارة",
  "61 - بوسعادة",
  "62 - الأبيض سيدي الشيخ",
  "63 - بريكة",
  "64 - القنطرة",
  "65 - مسعد",
  "66 - شلغوم العيد",
  "67 - أفلو",
  "68 - قصر البخاري",
  "69 - عين البيضاء",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    wilaya: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) {
      alert("يرجى ملء الاسم ورقم الهاتف ونص الرسالة.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        fullName: "",
        phone: "",
        wilaya: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] flex flex-col font-sans"
      dir="rtl"
    >
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">
            اتصل بنا وخدمة العملاء
          </span>
        </div>

        {/* رأس الصفحة الترحيبي */}
        <div className="bg-linear-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-10 shadow-lg text-right relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime">
              <Headphones className="w-4 h-4" />
              <span>فريق الدعم في خدمتكم دائماً</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              تواصل مع متجر PharmaClick
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              نسعد دائماً بالإجابة عن استفساراتكم ومساعدتكم في اختيار أفضل
              مستحضرات العناية والتجميل المعتمدة، مع متابعة فورية لطلبياتكم في
              جميع الولايات الـ 69.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* العمود الأيمن: نموذج التواصل المباشر */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs">
            <h2 className="text-xl font-black text-brand-deep mb-2">
              أرسل لنا رسالة مباشرة
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              املأ النموذج أدناه وسيقوم فريق الدعم بالرد عليك في أقرب وقت عبر
              الهاتف أو البريد.
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center bg-teal-50/60 border border-teal-100 rounded-2xl space-y-3 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-brand-deep">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  شكراً لتواصلك مع PharmaClick. تم استلام رسالتك وسيتواصل معك
                  مستشار خدمة العملاء قريباً.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 bg-brand-deep text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-brand-teal transition-colors cursor-pointer"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم الكامل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="أدخل اسمك الكامل..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الهاتف <span className="text-rose-500">*</span>
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
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 text-right focus:outline-none focus:border-brand-teal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الولاية (69 ولاية)
                    </label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) =>
                        setFormData({ ...formData, wilaya: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all"
                    >
                      <option value="">اختر ولايتك...</option>
                      {WILAYAS_LIST.map((w, idx) => (
                        <option key={idx} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      موضوع الاستفسار
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="طلب منتج، متابعة شحن، استفسار..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الرسالة أو تفاصيل الطلب{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="اكتب استفسارك أو تفاصيل المنتجات التي تبحث عنها..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:outline-none focus:border-brand-teal focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-brand-deep hover:bg-brand-teal text-white font-bold text-xs px-8 py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة الآن"}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* العمود الأيسر: قنوات التواصل ومعلومات الخدمة */}
          <div className="lg:col-span-5 space-y-4">
            {/* بطاقة واتساب السريعة */}
            <div className="bg-linear-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-md space-y-4 text-right">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black leading-tight">
                  تواصل فوري عبر الواتساب
                </h3>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  احصل على رد سريع ومباشر من فريق الدعم للإجابة عن أسئلتكم
                  ومساعدتكم في الطلب فوراً.
                </p>
              </div>
              <a
                href="https://wa.me/213541790205"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs px-6 py-3 rounded-full transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>محادثة واتساب مباشرة</span>
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
                    الهاتف وخدمة الزبائن
                  </h4>
                  <a
                    href="tel:0541790205"
                    dir="ltr"
                    className="text-base font-black text-brand-deep hover:text-brand-teal transition-colors block mt-0.5"
                  >
                    0541 79 02 05
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    متاح طوال أيام العمل الرسمية
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-green flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    أوقات العمل والدعم
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    السبت - الخميس: 08:30 صباحاً إلى 20:30 مساءً
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    الجمعة: خدمة العملاء متاحة عبر الواتساب
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-brand-deep flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    نطاق التوصيل والشحن
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    توصيل سريع وموثوق لكافة الـ 69 ولاية
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    الدفع عند الاستلام نقداً (COD) حتى باب المنزل
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">
                    ضمان الجودة والأصالة
                  </h4>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    100% مستحضرات أصلية ومطابقة للمواصفات
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    مستوردة ومعتمدة من الوكلاء والموزعين الرسميين
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
