"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  MapPin,
  Tag,
  Star,
  Flame,
  Sun,
  ShieldCheck,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Heart,
  Baby,
  Pill,
  Droplets,
  Stethoscope,
  Smile,
  Truck,
  RefreshCw,
  Clock,
  Headphones,
  CheckCircle2,
  Scissors,
  Smartphone,
  Check,
  HeartPulse,
  Activity,
  Send,
  Download,
  ShoppingBag,
  Copy,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductData } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { BannerCarousel } from "@/components/home/BannerCarousel";

// منتجات تجريبية واقعية للسوق الجزائري
const BEST_SELLERS: ProductData[] = [
  {
    _id: "1",
    name: "سيروم حمض الهيالورونيك المرطب المركز B5 للبشرة الحساسة",
    brand: "La Roche-Posay",
    price: 3800,
    originalPrice: 4500,
    discountPercentage: 15,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
    category: "skincare",
    inStock: true,
    sizeOrVolume: "30 مل",
  },
  {
    _id: "2",
    name: "واقي شمس سائل حماية قصوى Oil Control SPF50+ خالي من اللمعان",
    brand: "Eucerin",
    price: 2950,
    originalPrice: 3500,
    discountPercentage: 16,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80",
    category: "sunscreen",
    inStock: true,
    sizeOrVolume: "50 مل",
  },
  {
    _id: "3",
    name: "جل منظف رغوي منقي للبشرة العادية إلى الدهنية مع السيراميد",
    brand: "CeraVe",
    price: 2600,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    category: "skincare",
    inStock: true,
    sizeOrVolume: "236 مل",
  },
  {
    _id: "4",
    name: "جهاز قياس نسبة السكر في الدم الفوري مع 50 شريط اختبار",
    brand: "Accu-Chek Active",
    price: 4900,
    originalPrice: 5800,
    discountPercentage: 15,
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80",
    category: "devices",
    inStock: true,
    sizeOrVolume: "طقم متكامل",
  },
  {
    _id: "5",
    name: "كبسولات أوميغا 3 عالية التركيز 1000 ملغ لصحة القلب والدماغ",
    brand: "PharmAlliance",
    price: 2200,
    originalPrice: 2650,
    discountPercentage: 17,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    category: "vitamins",
    inStock: true,
    sizeOrVolume: "60 كبسولة",
  },
  {
    _id: "6",
    name: "شامبو مقوي مضاد لتساقط الشعر بالبيوتين وأمينيكسيل",
    brand: "Vichy Dercos",
    price: 3200,
    image:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
    category: "haircare",
    inStock: true,
    sizeOrVolume: "200 مل",
  },
];

const CATEGORIES = [
  {
    id: "medicines",
    name: "الأدوية والاستفسارات",
    count: "+250 صنف",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "skincare",
    name: "العناية بالبشرة",
    count: "+180 منتج",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "vitamins",
    name: "الفيتامينات والمكملات",
    count: "+95 صنف",
    image:
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "haircare",
    name: "العناية بالشعر",
    count: "+110 منتج",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "baby",
    name: "الأم والرضيع",
    count: "+75 منتج",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "devices",
    name: "الأجهزة والمستلزمات",
    count: "+40 جهاز",
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=350&auto=format&fit=crop&q=80",
  },
  {
    id: "daily",
    name: "العناية اليومية والشخصية",
    count: "+130 منتج",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=350&auto=format&fit=crop&q=80",
  },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f8fafc]"
      suppressHydrationWarning
    >
      {/* 1. رأس الصفحة المتطور */}
      <Header />

      <main className="flex-1 space-y-10 pb-16">
        {/* 2. القسم الترحيبي العصري (Hero Section مستوحى حرفياً من تصميم المرجع بألوان PharmaClick) */}
        <section className="relative overflow-hidden pt-6 sm:pt-10 pb-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* العمود الأيمن (النصوص والإثبات الاجتماعي والـ CTAs) */}
              <div className="lg:col-span-7 space-y-5 text-right">
                {/* شارة التميز */}
                <div className="inline-flex items-center gap-2 bg-teal-50 text-brand-teal border border-brand-teal/20 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  <span>صحتك أولويتنا • Your Health, Our Priority</span>
                </div>

                {/* العنوان الرئيسي */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-brand-deep leading-[1.15] tracking-tight">
                  صحتك وعافيتك،{" "}
                  <span className="text-gradient-pharma inline-block">
                    تصلك حتى باب بيتك.
                  </span>
                </h1>

                {/* النص التوضيحي */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
                  مستحضرات عناية ومنتجات صحية أصلية 100%، ماركات عالمية موثوقة
                  ورعاية متخصصة تصلك أينما كنت في الجزائر مع إمكانية تحضير
                  الوصفات مسبقاً.
                </p>

                {/* 4 نقاط ثقة سريعة (Trust Badges مثل المرجع) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                    <span>منتجات أصلية 100%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                    <Truck className="w-4 h-4 text-brand-teal shrink-0" />
                    <span>توصيل لـ 69 ولاية</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                    <span>دفع عند الاستلام</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                    <Headphones className="w-4 h-4 text-brand-deep shrink-0" />
                    <span>استشارة متخصصة</span>
                  </div>
                </div>

                {/* أزرار الإجراء المزدوجة (Dual CTAs) */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <Link href="/category/skincare">
                    <button className="bg-brand-green hover:bg-[#00B048] text-white font-extrabold text-sm px-6 py-3.5 rounded-full shadow-md shadow-brand-green/20 hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 group active:scale-95">
                      <span>تسوق المنتجات الآن</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  </Link>

                  <Link href="/prescription">
                    <button className="border-2 border-brand-teal text-brand-deep hover:bg-brand-teal/5 font-extrabold text-sm px-6 py-3 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95">
                      <FileText className="w-4 h-4 text-brand-teal" />
                      <span>حضّر وصفتك مسبقاً (استلام مباشر)</span>
                    </button>
                  </Link>

                  <Link href="/inquiry">
                    <button className="bg-teal-50 hover:bg-teal-100 text-brand-deep border border-brand-teal/40 font-extrabold text-sm px-5 py-3 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-95 shadow-2xs">
                      <HelpCircle className="w-4 h-4 text-brand-teal" />
                      <span>استفسر عن دواء</span>
                    </button>
                  </Link>
                </div>

                {/* الإثبات الاجتماعي (Social Proof كما في المرجع) */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex -space-x-2 space-x-reverse">
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="زبون راضٍ"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                      alt="زبون راضٍ"
                    />
                    <img
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                      alt="زبون راضٍ"
                    />
                  </div>
                  <div className="text-xs text-slate-600 leading-tight">
                    <span className="font-bold text-brand-deep block">
                      أكثر من 10,000+ زبون يثق بنا
                    </span>
                    <span className="text-amber-500 font-bold">4.8 ★★★★★</span>{" "}
                    <span className="text-slate-400 font-normal">
                      (+2,500 تقييم حقيقي)
                    </span>
                  </div>
                </div>
              </div>

              {/* العمود الأيسر (العرض البصري الرسمي مع الصورة والفئات والخدمات العائمة) */}
              <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
                {/* الهالة الضوئية الخضراء خلف الصورة */}
                <div className="absolute w-80 sm:w-96 h-80 sm:h-96 rounded-full hero-glow-pharma pointer-events-none opacity-80" />

                <div className="relative w-full max-w-md sm:max-w-lg">
                  {/* بطاقة خدمة عائمة 1: تحضير الوصفة مسبقاً (Click & Collect) بارزة على الزاوية العلوية */}
                  <Link
                    href="/prescription"
                    className="absolute -top-5 sm:-top-6 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-teal-100 shadow-xl flex items-center gap-3 hover:scale-103 hover:border-brand-teal transition-all duration-300 cursor-pointer max-w-60 z-20 group/float"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-50 group-hover/float:bg-brand-teal group-hover/float:text-white text-brand-teal flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 font-black text-brand-deep text-xs">
                        <span>تحضير مسبق للوصفة</span>
                        <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        استلام مباشر • نطاق 5 كم
                      </span>
                    </div>
                  </Link>

                  {/* حاوية الصورة الرسمية الرئيسية */}
                  <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-2xl bg-white group">
                    {/* الصورة المعبرة الرسمية */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                      <img
                        src="/images/pharmacy-hero.jpg"
                        alt="بودشيش • استشارة ورعاية صحية معتمدة"
                        className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-700"
                      />
                      {/* تدرج لوني لطيف لدمج النصوص والتفاصيل */}
                      <div className="absolute inset-0 bg-linear-to-t from-brand-deep/80 via-transparent to-black/20 pointer-events-none" />

                      {/* شارة التعريف الرسمية العائمة أعلى اليسار */}
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-brand-deep px-3 py-1.5 rounded-full border border-white/40 text-xs font-black flex items-center gap-1.5 shadow-lg">
                        <ShieldCheck className="w-4 h-4 text-brand-green" />
                        <span>أصلية ومفحوصة 100%</span>
                      </div>

                      {/* شريط سفلي داخل الصورة: عنوان المركز والثقة */}
                      <div className="absolute bottom-3.5 right-4 left-4 text-right text-white space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                          <span className="text-[11px] font-bold text-teal-200">
                            مركز بودشيش • PharmaClick المعتمد
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black leading-tight drop-shadow-xs">
                          خدمة متخصصة ومستحضرات موثوقة
                        </h4>
                      </div>
                    </div>

                    {/* شريط الفئات العائمة السريعة أسفل الصورة مباشرة */}
                    <div className="p-3 bg-white/95 backdrop-blur-md border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <Link
                        href="/category/skincare"
                        className="p-2.5 rounded-xl bg-teal-50/70 hover:bg-brand-teal hover:text-white text-brand-teal font-extrabold transition-all flex flex-col items-center gap-1 border border-teal-100/70 shadow-2xs group/btn"
                      >
                        <Droplets className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[11px]">العناية بالبشرة</span>
                      </Link>

                      <Link
                        href="/prescription"
                        className="p-2.5 rounded-xl bg-emerald-50/70 hover:bg-brand-green hover:text-white text-brand-green font-extrabold transition-all flex flex-col items-center gap-1 border border-emerald-100/70 shadow-2xs group/btn"
                      >
                        <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[11px]">تحضير وصفة</span>
                      </Link>

                      <Link
                        href="/category/vitamins"
                        className="p-2.5 rounded-xl bg-sky-50/70 hover:bg-brand-deep hover:text-white text-brand-deep font-extrabold transition-all flex flex-col items-center gap-1 border border-sky-100/70 shadow-2xs group/btn"
                      >
                        <HeartPulse className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span className="text-[11px]">الفيتامينات</span>
                      </Link>
                    </div>
                  </div>

                  {/* بطاقة خدمة عائمة 2: شحن لكافة الـ 69 ولاية في الزاوية السفلية */}
                  <div className="absolute bottom-20 sm:bottom-32 -left-2 sm:-left-16 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-emerald-100 shadow-xl flex items-center gap-3 hover:scale-103 hover:border-brand-green transition-all duration-300 max-w-65 z-20 group/float">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover/float:bg-brand-green group-hover/float:text-white text-brand-green flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <span className="font-black text-brand-deep text-xs block">
                        توصيل سريع لـ 69 ولاية
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium block">
                        مستحضرات العناية والمنتجات المعتمدة
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. شريط المزايا الأربعة العائم (Floating Value Proposition Bar كما في الصورة تماماً) */}
        <section className="max-w-7xl mx-auto px-4 -mt-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">
            {/* 1. التوصيل السريع */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  توصيل سريع ومضمون
                </h3>
                <p className="text-xs text-slate-500">
                  في الموعد لكافة الولايات الـ 69
                </p>
              </div>
            </div>

            {/* 2. الدفع الآمن */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pr-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  دفع آمن عند الاستلام
                </h3>
                <p className="text-xs text-slate-500">
                  100% راحة وموثوقية في الدفع
                </p>
              </div>
            </div>

            {/* 3. الإرجاع السهل */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:pr-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  إرجاع واستبدال مرن
                </h3>
                <p className="text-xs text-slate-500">
                  ضمان سلامة وجودة كل منتج
                </p>
              </div>
            </div>

            {/* 4. الدعم المتواصل */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:pr-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-brand-deep flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  دعم متخصص 7/7
                </h3>
                <p className="text-xs text-slate-500">
                  نحن في خدمتكم دائماً للإجابة
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* شريط اللافتات الإعلانية المنزلق (Banner Carousel) */}
        <section className="max-w-7xl mx-auto px-4">
          <BannerCarousel />
        </section>

        {/* 4. تسوق حسب الفئة (Shop by Category - شبكة الكبسولات الأنيقة المطابقة للصورة) */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-deep">
                تسوق حسب الفئة
              </h2>
              <p className="text-xs text-slate-500">
                اكتشف منتجاتنا المصنفة بعناية لتلبية كافة احتياجاتك
              </p>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-bold text-brand-teal hover:text-brand-deep transition-colors flex items-center gap-1 group"
            >
              <span>عرض جميع الأقسام</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="bg-white rounded-2xl border border-slate-100 hover:border-brand-teal/40 p-3 flex flex-col items-center text-center gap-2.5 card-hover-effect group cursor-pointer shadow-2xs hover:shadow-lg transition-all duration-300"
              >
                {/* حاوية الصورة الواقعية عالية الدقة للقسم */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-2xs group-hover:shadow-md transition-shadow">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-0.5 w-full">
                  <span className="text-xs font-black text-slate-800 group-hover:text-brand-deep transition-colors line-clamp-1 block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-brand-teal font-bold block">
                    {cat.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. الأكثر طلباً (Best Sellers - شبكة المنتجات الاحترافية مع زر السلة الدائري) */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                <h2 className="text-xl sm:text-2xl font-black text-brand-deep">
                  الأكثر طلباً (Best Sellers)
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                المنتجات الأكثر مبيعاً وثقة من قبل زبائننا في الجزائر
              </p>
            </div>
            <Link
              href="/promotions"
              className="text-xs sm:text-sm font-bold text-brand-teal hover:text-brand-deep transition-colors flex items-center gap-1 group"
            >
              <span>عرض الكل</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {BEST_SELLERS.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. لافتة رفع الوصفة الطبية الكبرى (Upload Prescription Banner المطابقة حرفياً للمرجع) */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg bg-linear-to-r from-brand-deep via-brand-teal to-brand-turquoise p-6 sm:p-10 text-white">
            {/* عناصر خلفية تزيينية */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-white blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-80 h-80 rounded-full bg-brand-lime blur-3xl" />
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* النص والإجراء */}
              <div className="md:col-span-8 space-y-3.5 text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-emerald-200">
                    <FileText className="w-3.5 h-3.5 text-brand-lime" />
                    خدمة التحضير المسبق (Click & Collect)
                  </span>
                  <span className="inline-flex items-center gap-1 bg-brand-deep/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-teal-100 border border-white/10">
                    <MapPin className="w-3 h-3 text-brand-lime" />
                    متاحة في محيط 5 كم فقط
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                  حضّر وصفتك مسبقاً واستلمها جاهزة دون انتظار
                </h3>

                <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed">
                  التقط صورة لروشتتك الطبية وسيقوم الأخصائي بمراجعتها وتجهيزها
                  مسبقاً لتجدها معبأة بانتظارك فور وصولك لتفادي طابور الانتظار
                  (استلام مباشر من المقر - لا يوجد توصيل للأدوية وفقاً للقانون).
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/prescription">
                    <button className="bg-white hover:bg-slate-100 text-brand-deep font-black text-sm px-6 py-3.5 rounded-full shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-2 group active:scale-95">
                      <FileText className="w-4 h-4 text-brand-green" />
                      <span>فحص المسافة وتحضير الوصفة</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>
                  </Link>

                  <Link href="/pharmacy-location">
                    <button className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer">
                      <MapPin className="w-3.5 h-3.5 text-brand-lime" />
                      <span>موقعنا وفروعنا على الخريطة</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* بطاقة توضيحية ثلاثية الأبعاد للوصفة الطبية */}
              <div className="md:col-span-4 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center space-y-3 max-w-xs w-full shadow-inner">
                  <div className="w-16 h-16 rounded-2xl bg-white text-brand-teal flex items-center justify-center mx-auto shadow-md">
                    <ShieldCheck className="w-9 h-9 text-brand-green" />
                  </div>
                  <div className="font-black text-base">
                    سرية وأمان طبي 100%
                  </div>
                  <p className="text-[11px] text-slate-200">
                    يتم التحقق من الوصفات حصرياً من طرف أخصائي مرخص ومعتمد وفق
                    القانون الجزائري
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. قسم الخدمات الصحية والرعاية (Healthcare Services كما في المرجع) */}
        <section id="services" className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-deep">
                خدمات الرعاية والصحة
              </h2>
              <p className="text-xs text-slate-500">
                حلول صحية متكاملة لراحتك وسلامة عائلتك
              </p>
            </div>
            <Link
              href="/pharmacy-location"
              className="text-xs sm:text-sm font-bold text-brand-teal hover:text-brand-deep transition-colors flex items-center gap-1"
            >
              <span>موقعنا وفروعنا على الخريطة</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. استشارة متخصصة */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand-teal/40 card-hover-effect space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-deep text-sm">
                استشارة متخصصة مباشرة
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                تحدث مع المستشار الصحي عبر واتساب أو الهاتف للاستفسار حول
                الجرعات والإرشادات السليمة.
              </p>
              <a
                href="https://wa.me/213541790205"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-teal hover:text-brand-deep flex items-center gap-1 pt-1"
              >
                <span>تحدث معنا الآن</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2. استفسار عن دواء */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand-teal/40 card-hover-effect space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-deep text-sm">
                استفسار عن توفر دواء
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                هل تبحث عن دواء نادر أو غير متوفر؟ أرسل اسمه وسنبحث عنه ونوفره
                لك بأسرع وقت.
              </p>
              <Link
                href="/drug-inquiry"
                className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 pt-1"
              >
                <span>استعلم الآن</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. تحضير الوصفة مسبقاً (Click & Collect) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand-teal/40 card-hover-effect space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-deep text-sm">
                تحضير الوصفة مسبقاً (Click & Collect)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                وفر وقتك وأرسل وصفتك لتجد أدويتك جاهزة ومعبأة فور حضورك دون
                انتظار (نطاق 5 كم).
              </p>
              <Link
                href="/prescription"
                className="text-xs font-bold text-brand-teal hover:text-brand-deep flex items-center gap-1 pt-1"
              >
                <span>حضّر وصفتك الآن</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. إرشادات الاستخدام الآمن */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-brand-teal/40 card-hover-effect space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-brand-deep text-sm">
                إرشادات الاستخدام الآمن
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                نصائح طبية موثوقة لحفظ الأدوية وطريقة استخدام مستحضرات العناية
                بالبشرة.
              </p>
              <Link
                href="/promotions"
                className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 pt-1"
              >
                <span>اكتشف النصائح</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* شريط الأمان والترخيص السفلي */}
          <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200/70 p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
              <span>مقر معتمد ومرخص رسمياً في الجزائر</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
              <span>تغطية توصيل لـ 69 ولاية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
              <span>100% منتجات مخبرية أصلية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-deep shrink-0" />
              <span>خيارات دفع متعددة وآمنة</span>
            </div>
          </div>
        </section>

        {/* 8. النشرة البريدية وتطبيق PWA (Footer Action Bar المطابق للمرجع) */}
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* النشرة البريدية */}
            <div className="md:col-span-6 space-y-2">
              <h3 className="text-lg font-black text-brand-deep">
                اشترك في نشرتنا الطبية والعروض
              </h3>
              <p className="text-xs text-slate-500">
                احصل على تخفيضات حصرية ونصائح صحية أسبوعية من فريقنا مباشرة في
                بريدك.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني..."
                  required
                  className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs flex-1 focus:outline-none focus:border-brand-teal text-slate-800"
                />
                <button
                  type="submit"
                  className="bg-brand-green hover:bg-[#00B048] text-white font-bold text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  {subscribed ? "تم الاشتراك ✓" : "اشتراك"}
                </button>
              </form>
            </div>

            {/* تطبيق الويب التقدمي PWA */}
            <div className="md:col-span-6 border-t md:border-t-0 md:border-r border-slate-100 md:pr-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-brand-green text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <Smartphone className="w-3.5 h-3.5" />
                <span>تطبيق PWA قابل للتثبيت</span>
              </div>
              <h3 className="text-lg font-black text-brand-deep">
                ثبّت متجر PharmaClick على هاتفك
              </h3>
              <p className="text-xs text-slate-500">
                تصفح بسرعة فائقة وبدون حاجة للتحميل من Google Play أو App Store،
                واطلب أدويتك بنقرة واحدة.
              </p>
              <div className="pt-1">
                <button
                  onClick={() =>
                    alert(
                      "يمكنك تثبيت التطبيق مباشرة عبر قائمة المتصفح (إضافة إلى الشاشة الرئيسية)",
                    )
                  }
                  className="bg-brand-deep hover:bg-brand-teal text-white text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تثبيت التطبيق على الشاشة الرئيسية</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. التذييل */}
      <Footer />
    </div>
  );
}
