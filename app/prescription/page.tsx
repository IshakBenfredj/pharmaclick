"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  MapPin,
  Navigation,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  ShieldCheck,
  ExternalLink,
  Store,
  Check,
  ArrowRight,
  Info,
  ShoppingBag,
  Camera,
  Trash2,
  AlertCircle,
  Footprints,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// إحداثيات وموقع المقر المعتمد
const PHARMACY_LOCATION = {
  lat: 36.386320783307085,
  lng: 7.248944842328149,
  name: "مركز بودشيش • PharmaClick",
  address: "الجزائر • قالمة / وادي الزناتي",
  mapsUrl: "https://maps.app.goo.gl/w53NSh6yTrCK1ZqH8?g_st=aw",
};

// حساب المسافة بدقة باستخدام صيغة Haversine (بالمتر)
function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // نصف قطر الأرض بالمتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type DistanceStatus =
  | "idle"
  | "checking"
  | "too_close"
  | "eligible"
  | "too_far"
  | "error";

export default function PrescriptionPage() {
  // وضع التجربة مفعّل مؤقتاً بناءً على طلب المستخدم لاختبار النموذج وتجربته فوراً
  const [testMode, setTestMode] = useState<boolean>(true);
  const [distanceStatus, setDistanceStatus] = useState<DistanceStatus>("eligible");
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(
    1200,
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [checkingPhase, setCheckingPhase] = useState<number>(1);

  // تحديث مراحل الفحص تدريجياً لمنح المستخدم مؤشر انتظار تفاعلي وحيوي
  React.useEffect(() => {
    if (distanceStatus === "checking") {
      setCheckingPhase(1);
      const timer1 = setTimeout(() => setCheckingPhase(2), 2500);
      const timer2 = setTimeout(() => setCheckingPhase(3), 6000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [distanceStatus]);

  // بيانات النموذج
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [chifaCard, setChifaCard] = useState<"yes" | "no">("yes");
  const [pickupTime, setPickupTime] = useState("30_min");
  const [notes, setNotes] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // تقييم المسافة وتحديد الحالة
  const evaluateDistance = (distanceInMeters: number) => {
    setCalculatedDistance(distanceInMeters);
    if (testMode) {
      // في وضع التجربة المؤقت، يتم تأهيل المستخدم لاختبار النموذج فوراً
      setDistanceStatus("eligible");
      return;
    }
    if (distanceInMeters <= 50) {
      setDistanceStatus("too_close");
    } else if (distanceInMeters <= 5000) {
      setDistanceStatus("eligible");
    } else {
      setDistanceStatus("too_far");
    }
  };

  // فحص الموقع الفعلي بواسطة المتصفح مع وقت انتظار مريح ومؤشر Loading واضح
  const handleCheckLocation = () => {
    setDistanceStatus("checking");
    setErrorMessage("");
    setCheckingPhase(1);

    if (!navigator.geolocation) {
      setDistanceStatus("error");
      setErrorMessage("متصفحك لا يدعم خاصية تحديد الموقع الجغرافي.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = calculateDistanceInMeters(
          userLat,
          userLng,
          PHARMACY_LOCATION.lat,
          PHARMACY_LOCATION.lng,
        );
        evaluateDistance(dist);
      },
      (error) => {
        setDistanceStatus("error");
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage(
            "تم رفض إذن الوصول إلى الموقع في المتصفح. يرجى تفعيل إذن الموقع من شريط العنوان ثم الضغط على زر إعادة المحاولة.",
          );
        } else if (error.code === error.TIMEOUT) {
          setErrorMessage(
            "استغرق المتصفح وقتاً أطول للاستجابة. يرجى التحقق من اتصال الإنترنت والنقر على زر إعادة المحاولة أدناه.",
          );
        } else {
          setErrorMessage(
            "تعذر قراءة إحداثيات الموقع حالياً. يرجى تفعيل خدمة الموقع في جهازك والضغط على إعادة المحاولة.",
          );
        }
      },
      { enableHighAccuracy: false, timeout: 35000, maximumAge: 300000 },
    );
  };

  // معالجة اختيار صورة الوصفة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // إرسال طلب التحضير
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("يرجى إرفاق صورة الوصفة الطبية أولاً");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const formatDistanceDisplay = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} متر`;
    }
    return `${(meters / 1000).toFixed(1)} كم`;
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f8fafc]"
      suppressHydrationWarning
    >
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6 sm:space-y-8">
          {/* 1. رأس الصفحة والتنبيه القانوني لعدم التوصيل */}
          <div className="text-right space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-brand-green border border-emerald-200/60 px-3.5 py-1.5 rounded-full text-xs font-black">
              <Store className="w-3.5 h-3.5" />
              <span>
                خدمة التحضير المسبق والاستلام المباشر (Click & Collect)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-brand-deep leading-tight">
              طلب تحضير الوصفة الطبية مسبقاً
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
              وفر وقتك وتجنب الانتظار؛ أرسل صورة وصفتك الطبية ليقوم الأخصائي
              بمراجعتها وتجهيزها مسبقاً لتجدها معبأة وجاهزة عند حضورك إلى
              المقر.
            </p>

            {/* تنبيه قانوني صارم: لا يوجد توصيل للأدوية */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-extrabold block text-[13px] text-amber-950">
                  تنبيه تنظيمي وقانوني ملزم:
                </span>
                <p className="leading-relaxed text-amber-800">
                  تحضير الوصفة الطبية هو{" "}
                  <span className="font-bold underline">
                    مجرد إجراء مسبق لتجد أدويتك جاهزة عند قدومك للاستلام المباشر دون
                    انتظار
                  </span>
                  .
                  <strong className="text-rose-700">
                    {" "}
                    لا يوجد أي توصيل نهائياً للأدوية والوصفات الطبية
                  </strong>{" "}
                  التزاماً بالقانون الصحي الصارم. (خدمة التوصيل لكافة الـ 69
                  ولاية تقتصر حصراً على مستحضرات التجميل والعناية والمنتجات
                  المعتمدة).
                </p>
              </div>
            </div>

            {/* بطاقة توجيه سريعة للاستفسار عن دواء محدد */}
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-brand-deep text-xs sm:text-sm">
                    هل تبحث عن توفر دواء أو مستحضر محدد دون رفع وصفة كاملة؟
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    يمكنك إرسال اسم الدواء أو صورة علبته وسيقوم المستشار الصحي بالتحقق الفوري والرد عليك.
                  </p>
                </div>
              </div>

              <Link href="/inquiry">
                <button
                  type="button"
                  className="bg-brand-deep hover:bg-brand-teal text-white font-black text-xs px-4 py-2.5 rounded-full transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs active:scale-95"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-brand-lime" />
                  <span>الاستفسار عن توفر دواء</span>
                </button>
              </Link>
            </div>
          </div>

          {/* 2. بطاقة معلومات المقر المعتمد */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="font-black text-brand-deep text-sm sm:text-base block">
                    {PHARMACY_LOCATION.name}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    الإحداثيات: {PHARMACY_LOCATION.lat}, {PHARMACY_LOCATION.lng}
                  </span>
                </div>
              </div>

              <a
                href={PHARMACY_LOCATION.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer shadow-2xs"
              >
                <span>فتح في Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* شروط المسافة المعتمدة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-bold">
                  ✓
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    النطاق المتاح لإرسال الوصفة:
                  </span>
                  <span className="text-slate-500">
                    من 50 متراً حتى 5 كيلومتر أو أقل من موقعنا.
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                  !
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">
                    أقل من 50 متراً:
                  </span>
                  <span className="text-slate-500">
                    أنت بجوار المقر؛ تفضل بالدخول مباشرة دون إرسال.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. صندوق الفحص الجغرافي للمسافة (Distance Verification Box) */}
          <div className="bg-white rounded-3xl border border-teal-100/80 shadow-md p-6 space-y-5 text-right">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-brand-deep flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-brand-teal" />
                  الخطوة الأولى: التحقق من المسافة وموقعك الحالي
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  تأكد من أنك في محيط الاستلام الشخصي (5 كم) لتفعيل نموذج رفع
                  الوصفة.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTestMode(true);
                    setDistanceStatus("eligible");
                    setCalculatedDistance(1200);
                  }}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-amber-700" />
                  <span>تخطي الفحص مؤقتاً للتجربة ⚡</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckLocation}
                  disabled={distanceStatus === "checking"}
                  className="bg-brand-teal hover:bg-brand-deep text-white font-extrabold text-xs px-5 py-2.5 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Navigation
                    className={`w-4 h-4 ${distanceStatus === "checking" ? "animate-spin" : ""}`}
                  />
                  <span>
                    {distanceStatus === "checking"
                      ? "جاري فحص المسافة..."
                      : "فحص موقعي ومسافتي الآن"}
                  </span>
                </button>
              </div>
            </div>

            {/* حالة جاري الفحص مع مؤشر انتظار احترافي ومراحل واضحة */}
            {distanceStatus === "checking" && (
              <div className="bg-linear-to-r from-teal-50/90 via-emerald-50/70 to-teal-50/90 border-2 border-brand-teal/30 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-sm">
                {/* رادار متحرك وأيقونة ملاحة */}
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-brand-teal/20 animate-ping" />
                  <div className="absolute -inset-2 rounded-full border border-brand-teal/30 animate-spin duration-3000" />
                  <div className="w-14 h-14 rounded-2xl bg-brand-teal text-white flex items-center justify-center shadow-lg relative z-10">
                    <Navigation className="w-7 h-7 animate-spin" />
                  </div>
                </div>

                {/* نص الحالة الرئيسي */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-black text-brand-deep">
                    جاري فحص وتحديد موقعك بدقة...
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    يرجى النقر على <strong>"سماح" (Allow)</strong> في نافذة إذن
                    الموقع التي يظهرها المتصفح لحساب المسافة تلقائياً.
                  </p>
                </div>

                {/* شريط التقدم التفاعلي والمراحل */}
                <div className="max-w-md mx-auto space-y-2">
                  <div className="w-full bg-teal-100/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-teal h-2 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width:
                          checkingPhase === 1
                            ? "35%"
                            : checkingPhase === 2
                              ? "70%"
                              : "95%",
                      }}
                    />
                  </div>

                  {/* المراحل الثلاث التوضيحية */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 font-bold">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${checkingPhase >= 1 ? "bg-teal-100/80 text-brand-deep" : "text-slate-400"}`}
                    >
                      1. طلب الإذن
                    </div>
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${checkingPhase >= 2 ? "bg-teal-100/80 text-brand-deep" : "text-slate-400"}`}
                    >
                      2. التقاط الإحداثيات
                    </div>
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${checkingPhase >= 3 ? "bg-teal-100/80 text-brand-deep" : "text-slate-400"}`}
                    >
                      3. قياس النطاق (5 كم)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* رسائل الخطأ في الجيولوكيشن مع زر إعادة المحاولة */}
            {distanceStatus === "error" && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckLocation}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* الحالة 1: أقرب من 50 متر (أو 50 متراً أو أقل) */}
            {distanceStatus === "too_close" && calculatedDistance !== null && (
              <div className="bg-linear-to-r from-amber-50 via-orange-50 to-amber-50/50 border-2 border-amber-300 rounded-3xl p-6 text-right space-y-4 shadow-sm animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Footprints className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-amber-200/80 text-amber-900 px-3 py-0.5 rounded-full text-[11px] font-black">
                      المسافة المقدرة:{" "}
                      {formatDistanceDisplay(calculatedDistance)}
                    </div>
                    <h3 className="text-lg font-black text-amber-950">
                      أنت على بعد خطوات من مقرنا! 🚶‍♂️
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                      أهلاً بك! نظراً لأنك متواجد بجوار مقرنا مباشرة (أقل من
                      50 متراً)،{" "}
                      <strong>
                        لا داعي لإرسال الوصفة عبر الموقع أو الانتظار
                      </strong>
                      ؛ يمكنك التفضل بالدخول مباشرة وسيسعد فريق العمل باستقبالك
                      وصرف طلبك فوراً وتزويدك بالإرشادات الصحية وجهاً لوجه.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={PHARMACY_LOCATION.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-3 rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>عرض مدخل المقر على الخريطة</span>
                  </a>
                  <a
                    href="tel:0541790205"
                    className="border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs px-5 py-3 rounded-full transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-amber-700" />
                    <span>الاتصال المباشر بفريق الدعم</span>
                  </a>
                </div>
              </div>
            )}

            {/* الحالة 3: أبعد من 5 كيلومتر */}
            {distanceStatus === "too_far" && calculatedDistance !== null && (
              <div className="bg-linear-to-r from-slate-50 to-rose-50/50 border border-slate-200 rounded-3xl p-6 text-right space-y-4 shadow-sm animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 px-3 py-0.5 rounded-full text-[11px] font-black">
                      المسافة المقدرة:{" "}
                      {formatDistanceDisplay(calculatedDistance)}
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      نعتذر، أنت خارج النطاق المعتمد للتحضير المسبق (أكثر من 5
                      كم) 📍
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      خدمة تحضير الوصفات مخصصة حصرياً للمقيمين أو المتواجدين في
                      محيط <strong>5 كيلومترات</strong> من موقع بودشيش
                      لضمان إمكانية الحضور والاستلام الشخصي دون تأخير، حيث{" "}
                      <strong>
                        لا يتوفر أي توصيل للأدوية وفقاً للقانون الصحي
                      </strong>
                      .
                    </p>
                    <p className="text-xs text-teal-800 font-bold pt-1">
                      💡 ملاحظة: إذا كنت ترغب في طلب مستحضرات العناية بالبشرة،
                      المكملات الغذائية، أو الأجهزة الطبية، فخدمة التوصيل السريع
                      متاحة لكافة الـ 69 ولاية!
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTestMode(true);
                      setDistanceStatus("eligible");
                      setCalculatedDistance(1200);
                    }}
                    className="bg-brand-deep hover:bg-brand-teal text-white font-black text-xs px-5 py-3 rounded-full transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Check className="w-4 h-4 text-brand-lime" />
                    <span>تجاوز شرط المسافة مؤقتاً وتجربة رفع الوصفة الآن ⚡</span>
                  </button>

                  <Link href="/category/skincare">
                    <button className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs px-4 py-3 rounded-full transition-colors flex items-center gap-2 cursor-pointer">
                      <ShoppingBag className="w-4 h-4 text-brand-teal" />
                      <span>تسوق منتجات العناية (توصيل لـ 69 ولاية)</span>
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={handleCheckLocation}
                    className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs px-4 py-3 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>إعادة فحص الموقع</span>
                  </button>
                </div>
              </div>
            )}

            {/* الحالة 2: المسافة مؤهلة (من 50 م حتى 5 كم) */}
            {distanceStatus === "eligible" && calculatedDistance !== null && (
              <div className="bg-emerald-50/70 border-2 border-brand-green/60 rounded-3xl p-5 text-right space-y-2 animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-2 flex-wrap">
                        <span>
                          موقعك مؤهل لإرسال الوصفة (أنت على بعد{" "}
                          {formatDistanceDisplay(calculatedDistance)} من المقر) ✅
                        </span>
                        {testMode && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-black px-2.5 py-0.5 rounded-full">
                            ⚡ وضع التجربة نشط
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        {testMode
                          ? "تم إيقاف شرط المسافة مؤقتاً لتتمكن من ملء نموذج الوصفة ورفع الصورة وتجربة الإرسال بحرية."
                          : "يمكنك الآن رفع صورة الوصفة وسيقوم الأخصائي بتجهيزها مسبقاً لتجدها بانتظارك فور وصولك لتفادي الانتظار."}
                      </p>
                    </div>
                  </div>

                  {testMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setTestMode(false);
                        handleCheckLocation();
                      }}
                      className="text-xs text-slate-500 hover:text-rose-600 underline font-bold cursor-pointer"
                    >
                      إعادة تفعيل الفحص الفعلي الصارم
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. نموذج رفع الوصفة الطبية (يفتح فقط عندما يكون الزبون مؤهلاً: eligible) */}
          {distanceStatus === "eligible" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-6 text-right animate-fade-in">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-brand-deep flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-green" />
                  الخطوة الثانية: رفع صورة الوصفة وبيانات الاستلام
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  املأ البيانات وأرفق صورة واضحة للوصفة الطبية ليتولى الأخصائي
                  تجهيزها فوراً.
                </p>
              </div>

              {submitted ? (
                /* بطاقة نجاح الإرسال */
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-950">
                    تم استلام طلب تحضير وصفتك بنجاح!
                  </h3>
                  <div className="inline-block bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-brand-deep shadow-2xs border border-emerald-100">
                    رقم الطلب: #RX-{Math.floor(10000 + Math.random() * 90000)}
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                    شكراً لك يا <strong>{patientName}</strong>. الأخصائي يراجع
                    وصفتك حالياً وسيتم تجهيز الأدوية لتجدها معبأة بانتظارك.
                    سنرسل لك رسالة تأكيد على الرقم{" "}
                    <strong>{patientPhone}</strong> بمجرد اكتمال التجهيز.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={PHARMACY_LOCATION.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-deep text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-brand-teal transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-brand-lime" />
                      <span>موقعنا على Google Maps</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* نموذج الإدخال والرفع */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* منطقة رفع صورة الوصفة */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800">
                      صورة الوصفة الطبية (Ordonnance){" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    {imagePreview ? (
                      <div className="relative border-2 border-brand-teal/40 rounded-2xl p-4 bg-teal-50/20 text-center space-y-3">
                        <img
                          src={imagePreview}
                          alt="معاينة الوصفة"
                          className="max-h-64 mx-auto rounded-xl shadow-xs object-contain"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs font-bold text-brand-deep">
                            {imageName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageName("");
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="حذف الصورة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-teal-200 hover:border-brand-teal rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/50 hover:bg-teal-50/30 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 group-hover:bg-brand-teal group-hover:text-white text-brand-teal flex items-center justify-center transition-colors">
                          <UploadCloud className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-sm text-brand-deep block">
                            انقر لاختيار صورة الوصفة أو التقطها بكاميرا الهاتف
                          </span>
                          <span className="text-xs text-slate-400 mt-1 block">
                            صيغ JPG, PNG أو PDF واضحة وتظهر أسماء الأدوية وختم
                            الطبيب
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleImageChange}
                          required
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* بيانات المريض والتواصل */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800">
                        اسم المريض أو المستلم{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="الاسم واللقب الكامل"
                        required
                        className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all text-right"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800">
                        رقم هاتف للتأكيد{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="05 / 06 / 07 XX XX XX XX"
                        required
                        className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all text-right"
                      />
                    </div>
                  </div>

                  {/* بطاقة الشفاء ووقت الاستلام المتوقع */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800">
                        هل لديك بطاقة الشفاء وتريد تعويض الضمان الاجتماعي؟
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setChifaCard("yes")}
                          className={`p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            chifaCard === "yes"
                              ? "bg-brand-deep text-white shadow-2xs"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}
                        >
                          نعم، سأحضر بطاقة الشفاء
                        </button>
                        <button
                          type="button"
                          onClick={() => setChifaCard("no")}
                          className={`p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            chifaCard === "no"
                              ? "bg-brand-deep text-white shadow-2xs"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}
                        >
                          لا (دفع عادي)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800">
                        الوقت التقريبي لحضورك للاستلام
                      </label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none bg-white transition-all text-right cursor-pointer"
                      >
                        <option value="30_min">خلال 30 دقيقة</option>
                        <option value="1_hour">خلال ساعة واحدة</option>
                        <option value="2_hours">خلال ساعتين</option>
                        <option value="evening">هذا المساء قبل الإغلاق</option>
                      </select>
                    </div>
                  </div>

                  {/* ملاحظات إضافية */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-800">
                      ملاحظات أو أسئلة للأخصائي (اختياري)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: يرجى إخباري بسعر الأدوية مسبقاً، أو هل البديل الجنيس متوفر..."
                      rows={3}
                      className="w-full text-xs p-3.5 rounded-xl border border-slate-200 focus:border-brand-teal focus:ring-1 focus:ring-brand-teal outline-none transition-all text-right"
                    />
                  </div>

                  {/* زر الإرسال النهائي */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-green hover:bg-[#00B048] text-white font-black text-sm py-4 rounded-2xl shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>جاري إرسال الوصفة للأخصائي...</span>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        <span>
                          إرسال الوصفة للتحضير المسبق (جاهزة عند وصولي)
                        </span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-slate-400 text-center font-normal">
                    * حضورك الشخصي مصحوباً بالوصفة الورقية الأصلية إلزامي لإتمام
                    الصرف وفق التشريع الصحي الجزائري.
                  </div>
                </form>
              )}
            </div>
          )}

          {/* في حالة لم يتم التحقق بعد من المسافة */}
          {distanceStatus === "idle" && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3">
              <Info className="w-8 h-8 text-brand-teal mx-auto" />
              <div className="text-sm font-bold text-brand-deep">
                يرجى النقر على زر فحص المسافة أعلاه للتحقق من تواجدك في نطاق 5
                كم
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                وفقاً للقوانين الصحية، خدمة تجهيز الوصفات مسبقاً مخصصة للاستلام
                المباشر من المقر دون توصيل للمنازل.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
