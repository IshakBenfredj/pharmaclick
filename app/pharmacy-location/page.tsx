"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  ExternalLink,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  Compass,
  AlertTriangle,
  Store,
  HeartPulse,
  MessageCircle,
  Info,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// إحداثيات ومعلومات المقر المعتمد
const PHARMACY_INFO = {
  name: "مركز بودشيش • PharmaClick",
  doctorName: "د. بودشيش (أخصائي معتمد مرخص)",
  wilaya: "ولاية قالمة (Guelma)",
  commune: "وادي الزناتي (Oued Zenati)",
  fullAddress:
    "الجزائر • ولاية قالمة، وادي الزناتي، الشارع الرئيسي (بجوار المركز الصحي)",
  coordinates: {
    lat: 36.386320783307085,
    lng: 7.248944842328149,
    formatted: "36.386321, 7.248945",
  },
  mapsUrl: "https://maps.app.goo.gl/w53NSh6yTrCK1ZqH8?g_st=aw",
  phone: "0541790205",
  phoneDisplay: "0541 79 02 05",
  whatsappUrl: "https://wa.me/213541790205",
};

// أوقات وساعات العمل الرسمية
const OPENING_HOURS = [
  {
    days: "السبت - الخميس",
    hours: "08:00 صباحاً - 20:00 مساءً",
    status: "مفتوح بانتظام",
  },
  {
    days: "الجمعة",
    hours: "08:30 صباحاً - 12:00 ظهراً / 15:00 - 20:00",
    status: "دوام مخفض",
  },
  {
    days: "نظام المناوبة الليلية (Garde)",
    hours: "وفق جدول المناوبة الرسمي لمديرية الصحة",
    status: "مناوبة دورية",
  },
];

// الأسئلة الشائعة حول خدمات المقر والتحضير والتوصيل
const FAQS = [
  {
    category: "تحضير الوصفات (Click & Collect)",
    question: "كيف تعمل خدمة طلب تحضير الوصفة الطبية مسبقاً؟",
    answer:
      "تتيح لك الخدمة رفع صورة وصفتك الطبية عبر الموقع إذا كنت متواجداً في نطاق 5 كيلومتر أو أقل من مقرنا. يقوم فريقنا المعتمد بتجهيز أدويتكم ومراجعتها بدقة لتجدوها معبأة وجاهزة للاستلام فور حضوركم الشخصي، مما يوفر وقتكم ويجنبكم الانتظار. (ملاحظة: إذا كنتم على بعد أقل من 50 متراً يمكنكم الدخول مباشرة لمقرنا دون الحاجة لرفع الوصفة عبر الموقع).",
  },
  {
    category: "سياسة الأدوية والتوصيل",
    question: "هل تتوفر خدمة توصيل الأدوية والوصفات الطبية إلى المنازل؟",
    answer:
      "التزاماً بالقوانين واللوائح الصحية الصارمة، لا يوجد أي توصيل نهائياً للأدوية والوصفات الطبية للمنازل. يتم صرف الأدوية حصرياً داخل مقرنا المعتمد بحضور المريض أو ذويه لضمان الرقابة الصحية والتوجيه الصحي الآمن والمباشر. في المقابل، نوفر خدمة التوصيل السريع لكافة مستحضرات العناية بالبشرة والشعر، المكملات الغذائية، والأجهزة شبه الطبية لجميع الـ 69 ولاية.",
  },
  {
    category: "نطاق الشحن الوطني",
    question: "ما هي الولايات التي يشملها شحن وتوصيل مستحضرات العناية والصحة؟",
    answer:
      "نوفر التوصيل السريع والآمن إلى كافة ولايات الجزائر الـ 69 ولاية دون استثناء، مع خيارات التوصيل حتى باب المنزل أو الاستلام من أقرب مكتب توصيل، مع إمكانية الدفع عند الاستلام (COD).",
  },
  {
    category: "الاستفسارات الدوائية",
    question: "كيف يمكنني الاستفسار عن توفر دواء أو بديل مكافئ؟",
    answer:
      "يمكنكم استخدام صفحة 'الاستفسار عن توفر دواء' أو مراسلتنا مباشرة عبر واتساب مع كتابة اسم الدواء أو إرفاق صورة العلبة، وسيقوم المستشار الصحي بالتحقق الفوري والرد لتأكيد التوفر أو اقتراح البدائل المعتمدة رسمياً.",
  },
  {
    category: "طرق الدفع والضمان",
    question: "ما هي طرق الدفع المعتمدة لديكم؟",
    answer:
      "عند طلب مستحضرات العناية والشحن لكافة الولايات الـ 69، يتم الدفع نقداً عند استلام طلبيتكم (COD). أما داخل مقرنا، فنقبل الدفع نقداً، البطاقات البنكية (CIB والذهبية)، بالإضافة إلى قبول بطاقة الشفاء للوصفات الطبية المستوفية للشروط.",
  },
  {
    category: "الموقع والوصول",
    question: "أين يقع مقركم بالضبط وكيف أصل إليكم بسهولة؟",
    answer:
      "يقع مقرنا بالشارع الرئيسي في بلدية وادي الزناتي، ولاية قالمة (بجوار المركز الصحي). يمكنكم الضغط على زر 'فتح في تطبيق Google Maps' في أعلى هذه الصفحة للتنقل المباشر عبر نظام الملاحة GPS.",
  },
];

export default function PharmacyLocationPage() {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(PHARMACY_INFO.coordinates.formatted);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PHARMACY_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f8fafc]"
      suppressHydrationWarning
    >
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* 1. مسار التصفح ورأس الصفحة */}
          <div className="space-y-3 text-right">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Link
                href="/"
                className="hover:text-brand-deep transition-colors"
              >
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-brand-teal">موقعنا والاتصال</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div>
                <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-teal border border-teal-200/60 px-3.5 py-1.5 rounded-full text-xs font-black mb-2 shadow-2xs">
                  <Store className="w-3.5 h-3.5 text-brand-green" />
                  <span>المقر الجغرافي الرسمي المعتمد</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-brand-deep tracking-tight">
                  موقع مقر بودشيش ومعلومات الزيارة
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                  يسعدنا استقبالكم في مقرنا لصرف الوصفات الطبية،
                  الاستشارات الصحية المباشرة، واستلام الطلبات المجهزة
                  مسبقاً.
                </p>
              </div>

              {/* أزرار التوجيه السريع */}
              <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                <a
                  href={PHARMACY_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-deep hover:bg-brand-teal text-white font-black text-xs px-5 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                >
                  <Navigation className="w-4 h-4 text-brand-lime" />
                  <span>فتح في تطبيق Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={PHARMACY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs px-4 py-3 rounded-2xl transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. الخريطة التفاعلية وبطاقة الموقع الجغرافي */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* نافذة الخريطة التفاعلية المدمجة */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden space-y-0">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between text-right">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-brand-deep">
                      الخريطة الحية لمقرنا
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      وادي الزناتي، ولاية قالمة
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCoords}
                  className="text-xs font-bold text-slate-600 hover:text-brand-deep bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-green" />
                      <span className="text-brand-green">
                        تم نسخ الإحداثيات
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الإحداثيات GPS</span>
                    </>
                  )}
                </button>
              </div>

              {/* إطار الخريطة الحي عبر OpenStreetMap / Google Maps Embed */}
              <div className="relative w-full h-95 sm:h-115 bg-slate-100">
                <iframe
                  title="موقع مركز بودشيش"
                  src={`https://maps.google.com/maps?q=${PHARMACY_INFO.coordinates.lat},${PHARMACY_INFO.coordinates.lng}&hl=ar&z=16&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* شارة توجيه عائمة فوق الخريطة */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100 max-w-xs text-right hidden sm:block">
                  <div className="flex items-center gap-2 font-black text-brand-deep text-xs">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>مركز بودشيش • PharmaClick</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    إحداثيات GPS: {PHARMACY_INFO.coordinates.formatted}
                  </p>
                </div>
              </div>

              {/* شريط الإجراء السفلي للخريطة */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Info className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>
                    انقر على زر فتح في Google Maps للحصول على خط سير القيادة
                    والملاحة الصوتية المباشرة.
                  </span>
                </div>
                <a
                  href={PHARMACY_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-teal hover:text-brand-deep flex items-center gap-1 transition-colors"
                >
                  <span>بدء الاتجاهات والملاحة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* بطاقات البيانات الجانبية (ساعات العمل ومعلومات التواصل) */}
            <div className="lg:col-span-4 space-y-5 text-right">
              {/* بطاقة معلومات العنوان والاتصال المباشر */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-brand-deep text-base">
                      بيانات التواصل المباشر
                    </h3>
                    <span className="text-xs text-slate-500">
                      {PHARMACY_INFO.doctorName}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <div className="font-bold text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal" />
                      <span>العنوان الكامل:</span>
                    </div>
                    <p className="font-bold text-slate-800 leading-relaxed text-[13px]">
                      {PHARMACY_INFO.fullAddress}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-green" />
                        <span>الهاتف المباشر:</span>
                      </div>
                      <a
                        href={`tel:${PHARMACY_INFO.phone}`}
                        className="font-black text-brand-deep text-sm tracking-wider hover:text-brand-teal transition-colors block pt-0.5"
                      >
                        {PHARMACY_INFO.phoneDisplay}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="text-[11px] font-bold text-slate-600 hover:text-brand-deep bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedPhone ? "تم النسخ ✓" : "نسخ"}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={`tel:${PHARMACY_INFO.phone}`}
                    className="w-full bg-brand-green hover:bg-[#00B048] text-white font-extrabold text-xs py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                  >
                    <Phone className="w-4 h-4" />
                    <span>اتصال هاتفي فوري</span>
                  </a>

                  <a
                    href={PHARMACY_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs py-3 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>مراسلة المستشار الصحي عبر واتساب</span>
                  </a>
                </div>
              </div>

              {/* بطاقة ساعات وأيام العمل الرسمية */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-brand-deep text-base">
                      أوقات الدوام وساعات العمل
                    </h3>
                    <span className="text-xs text-brand-green font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                      استقبال الزبائن طيلة أيام الأسبوع
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  {OPENING_HOURS.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-brand-deep">
                          {slot.days}
                        </span>
                        <span className="text-[10px] bg-teal-100/80 text-brand-teal font-extrabold px-2 py-0.5 rounded-full">
                          {slot.status}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{slot.hours}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. تنبيه خدمة الوصفات الطبية ونطاق الـ 5 كم (معيار عدم التوصيل) */}
          <div className="bg-linear-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200 rounded-3xl p-5 sm:p-6 text-right space-y-3">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-amber-950 text-sm sm:text-base">
                  معيار خدمة تحضير الوصفات الطبية (Click & Collect)
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  تحضير الوصفة الطبية هو{" "}
                  <strong>
                    مجرد إجراء تجهيز مسبق لتجد أدويتك جاهزة ومعبأة فور حضورك إلى
                    المقر وتفادي الانتظار
                  </strong>
                  .
                  <strong className="text-rose-700">
                    {" "}
                    لا يوجد أي توصيل نهائياً للوصفات والأدوية الطبية للمنازل
                  </strong>{" "}
                  التزاماً بالقانون الصحي الصارم. خدمة رفع الوصفة متاحة حصرياً
                  للمتواجدين في نطاق <strong>5 كيلومتر أو أقل</strong> من
                  المقر للاستلام الشخصي.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link href="/prescription">
                    <button className="bg-brand-deep hover:bg-brand-teal text-white font-extrabold text-xs px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-brand-lime" />
                      <span>فحص المسافة وطلب تجهيز وصفتك مسبقاً</span>
                    </button>
                  </Link>

                  <Link href="/category/skincare">
                    <button className="text-brand-deep hover:text-brand-teal font-bold text-xs underline decoration-brand-teal/40 transition-colors">
                      تصفح منتجات العناية (شحن لكافة الولايات الـ 69)
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4. الخدمات المتوفرة في المقر الفعلي */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-5 text-right">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-brand-deep">
                الخدمات المتوفرة عند زيارتك لمقرنا
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                نقدم رعاية صحية متكاملة داخل مقرنا لضمان صحتك وسلامتك
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <h4 className="font-black text-brand-deep text-sm">
                  صرف الأدوية والوصفات
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  صرف دقيق للوصفات الطبية مع قبول بطاقة الشفاء ومراجعة الجرعات
                  المناسبة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h4 className="font-black text-brand-deep text-sm">
                  قياس الضغط والسكر
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  فحص ومتابعة المؤشرات الحيوية كضغط الدم ومستوى السكر بأجهزة
                  معايرة طبية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-brand-deep text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-black text-brand-deep text-sm">
                  استشارة صحية متخصصة
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  نصائح مهنية مباشرة حول التداخلات الدوائية وطرق الاستخدام
                  السليمة والآمنة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-black text-brand-deep text-sm">
                  استلام التحضير المسبق
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  شباك مخصص لاستلام طلبيتك المعبأة مسبقاً عبر الموقع لتفادي أي
                  طابور انتظار.
                </p>
              </div>
            </div>
          </div>

          {/* 5. قسم الأسئلة الشائعة (Interactive FAQ Accordion) */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6 text-right">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-teal-50 text-brand-teal px-3 py-1 rounded-full text-xs font-black mb-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>دليل الإجابات السريعة</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-brand-deep">
                  الأسئلة الشائعة حول خدماتنا وزيارة مقرنا
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  كل ما يهمك معرفته حول التحضير المسبق للوصفات، نطاق الشحن للـ 69 ولاية، ومواعيد العمل
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-teal-200 bg-teal-50/20 shadow-xs"
                        : "border-slate-200/80 bg-white hover:border-slate-300"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-right cursor-pointer select-none"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-brand-teal bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-md">
                            {faq.category}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-brand-deep">
                          {faq.question}
                        </h4>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "bg-brand-deep text-white rotate-180"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-teal-100/60">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* بطاقة المساعدة السريعة */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-deep text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-brand-lime" />
                </div>
                <div>
                  <h4 className="font-black text-brand-deep text-xs sm:text-sm">
                    هل لديك سؤال آخر أو تحتاج مساعدة فورية؟
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    فريق الدعم والمستشار الصحي متاحون للرد المباشر وتقديم الإرشادات اللازمة.
                  </p>
                </div>
              </div>

              <a
                href={PHARMACY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2 shrink-0 shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل معنا عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
