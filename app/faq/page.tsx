"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  Truck,
  ShieldCheck,
  CreditCard,
  Phone,
  MessageCircle,
  PackageCheck,
  RefreshCw,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "الشحن والتوصيل",
    question: "ما هي الولايات التي يشملها التوصيل في متجر PharmaClick؟",
    answer:
      "نوفر خدمة التوصيل السريع والموثوق لكافة ولايات الجزائر الـ 69 ولاية دون استثناء. يتم توصيل الطلبيات مباشرة حتى باب منزلك أو إلى أقرب مكتب توزيع رسمي، مع إشعارك برقم تتبع لمتابعة مسار شحنتك خطوة بخطوة.",
  },
  {
    category: "الشحن والتوصيل",
    question: "كم تستغرق مدة شحن وتوصيل الطلبية؟",
    answer:
      "يتم تجهيز وشحن الطلبيات في غضون 24 ساعة. يستغرق التوصيل عادةً بين 24 إلى 48 ساعة للولايات الشمالية والوسطى، ومن 3 إلى 5 أيام لولايات الهضاب والجنوب الكبير وفق جداول شركات التوصيل المعتمدة.",
  },
  {
    category: "الشحن والتوصيل",
    question: "كيف يمكنني تتبع حالة طلبيتي؟",
    answer:
      "بمجرد تأكيد طلبك، يمكنك زيارة صفحة 'تتبع طلبيتي' عبر الرابط الموجود في أعلى الموقع وإدخال رقم الطلب أو رقم هاتفك لمعرفة الحالة اللحظية للشحنة وموعد وصولها المتوقع.",
  },
  {
    category: "طرق الدفع والأسعار",
    question: "ما هي طرق الدفع المتاحة في المتجر؟",
    answer:
      "طريقة الدفع الأساسية والمعتمدة لجميع ولايات الوطن هي الدفع نقداً عند الاستلام (Cash on Delivery - COD). تدفع ثمن طلبيتك فقط بعد استلام الطرد بين يديك والتحقق من سلامته.",
  },
  {
    category: "طرق الدفع والأسعار",
    question: "هل الأسعار المعروضة في المتجر نهائية وشاملة؟",
    answer:
      "نعم، جميع أسعار المستحضرات المعروضة بالدينار الجزائري (دج) نهائية ومطابقة للأسعار الرسمية المعتمدة، وتضاف فقط تكلفة الشحن الرمزية حسب ولايتك عند إتمام الطلب.",
  },
  {
    category: "أصالة وجودة المستحضرات",
    question: "هل جميع المنتجات والمستحضرات أصلية ومضمونة؟",
    answer:
      "نعم، 100% من المنتجات المعروضة في متجر PharmaClick أصلية ومستوردة مباشرة من الوكلاء الحصريين والمخابر المعتمدة رسمياً في الجزائر. تخضع جميع المستحضرات لرقابة صارمة وظروف تخزين قياسية تضمن فعاليتها وسلامتها.",
  },
  {
    category: "أصالة وجودة المستحضرات",
    question: "كيف تتأكدون من سلامة تواريخ الصلاحية والتخزين؟",
    answer:
      "نلتزم بأعلى معايير مراقبة المخزون، حيث يتم فحص تواريخ الصلاحية دورياً وضمان تخزين المستحضرات ومستحضرات الوقاية في درجات حرارة ورطوبة مضبوطة ومثالية.",
  },
  {
    category: "الطلبات والإرجاع",
    question: "كيف يمكنني تعديل طلبي أو إلغاؤه؟",
    answer:
      "يمكنك تعديل طلبك أو إلغاؤه قبل شحنه عبر التواصل المباشر مع خدمة الزبائن هاتفياً أو عبر واتساب على الرقم 0541790205 وتزويدنا برقم الطلب لتعديل البيانات فوراً دون أي رسوم إضافية.",
  },
  {
    category: "الطلبات والإرجاع",
    question: "ما هي سياسة الاستبدال أو الإرجاع في حال وجود تلف؟",
    answer:
      "إذا وصلك مستحضر متضرر أو غير مطابق لما طلبته، نرجو إبلاغنا في غضون 48 ساعة من الاستلام عبر الواتساب مع صورة المنتج، وسنقوم باستبداله فوراً أو استرجاع قيمته دون أي تكاليف شحن عليك.",
  },
  {
    category: "خدمة العملاء والاستشارات",
    question: "كيف يمكنني الحصول على استشارة لمساعدتي في اختيار المنتج المناسب؟",
    answer:
      "يمكنك مراسلتنا في أي وقت عبر الواتساب على الرقم 0541790205، وسيسعد مستشارو العناية لدينا بتقديم نصائح مخصصة لنوع بشرتك واحتياجاتك اليومية.",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: "all", label: "جميع الأسئلة" },
    { id: "الشحن والتوصيل", label: "الشحن والتوصيل (69 ولاية)" },
    { id: "طرق الدفع والأسعار", label: "الدفع والأسعار" },
    { id: "أصالة وجودة المستحضرات", label: "الأصالة والجودة" },
    { id: "الطلبات والإرجاع", label: "الطلبات والاستبدال" },
    { id: "خدمة العملاء والاستشارات", label: "خدمة العملاء" },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">الأسئلة الشائعة</span>
        </div>

        {/* رأس الصفحة */}
        <div className="bg-gradient-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-8 shadow-lg text-right relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime">
              <HelpCircle className="w-4 h-4" />
              <span>إجابات واضحة لكل ما يهمك</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              الأسئلة الشائعة حول متجر PharmaClick
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              جمعنا لكم أهم الأسئلة والإجابات حول الشحن لـ 69 ولاية، الدفع عند الاستلام، أصالة المنتجات، وطرق متابعة طلباتكم بكل وضوح وشفافية.
            </p>
          </div>
        </div>

        {/* كبسولات فلترة الأقسام */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-brand-deep text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* قائمة الأسئلة التفاعلية (Accordion) */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-brand-deep transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-teal" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* بطاقة الاتصال المباشر السريعة في الأسفل */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-brand-deep">
              لم تجد الإجابة التي تبحث عنها؟
            </h3>
            <p className="text-xs text-slate-500">
              فريق دعم PharmaClick جاهز لمساعدتك مباشرة عبر واتساب أو الهاتف.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/213541790205"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>محادثة واتساب مباشرة</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-full transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>صفحة الاتصال</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
