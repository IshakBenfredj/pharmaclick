"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  category: "shipping" | "payment" | "quality" | "orders" | "support";
  questionAr: string;
  questionFr: string;
  questionEn: string;
  answerAr: string;
  answerFr: string;
  answerEn: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "shipping",
    questionAr: "ما هي الولايات التي يشملها التوصيل في متجر PharmaClick؟",
    questionFr:
      "Quelles sont les wilayas couvertes par la livraison sur PharmaClick ?",
    questionEn: "Which wilayas are covered by delivery on PharmaClick?",
    answerAr:
      "نوفر خدمة التوصيل السريع والموثوق لكافة ولايات الجزائر الـ 69 ولاية دون استثناء. يتم توصيل الطلبيات مباشرة حتى باب منزلك أو إلى أقرب مكتب توزيع رسمي، مع إشعارك برقم تتبع لمتابعة مسار شحنتك خطوة بخطوة.",
    answerFr:
      "Nous assurons une livraison rapide et fiable vers l'ensemble des 69 wilayas d'Algérie sans exception. Vos commandes arrivent directement à votre domicile ou au point relais de distribution le plus proche, avec suivi en temps réel de votre colis.",
    answerEn:
      "We provide fast and dependable shipping across all 69 Algerian wilayas without exception. Orders are delivered directly to your doorstep or your nearest official pickup station, accompanied by real-time tracking.",
  },
  {
    category: "shipping",
    questionAr: "كم تستغرق مدة شحن وتوصيل الطلبية؟",
    questionFr:
      "Combien de temps prend l’expédition et la livraison d’une commande ?",
    questionEn: "How long does shipping and order delivery take?",
    answerAr:
      "يتم تجهيز وشحن الطلبيات في غضون 24 ساعة. يستغرق التوصيل عادةً بين 24 إلى 48 ساعة للولايات الشمالية والوسطى، ومن 3 إلى 5 أيام لولايات الهضاب والجنوب الكبير وفق جداول شركات التوصيل المعتمدة.",
    answerFr:
      "Les commandes sont préparées et expédiées sous 24h. Le délai de livraison varie généralement de 24 à 48h pour le Nord et le Centre, et de 3 à 5 jours pour les Hauts-Plateaux et le Grand Sud selon nos partenaires de transport agréés.",
    answerEn:
      "Orders are prepared and dispatched within 24 hours. Delivery typically takes 24 to 48 hours for northern and central wilayas, and 3 to 5 days for highlands and southern wilayas via certified logistics partners.",
  },
  {
    category: "shipping",
    questionAr: "كيف يمكنني تتبع حالة طلبيتي؟",
    questionFr: "Comment puis-je suivre l’état de ma commande ?",
    questionEn: "How can I track my order status?",
    answerAr:
      "بمجرد تأكيد طلبك، يمكنك زيارة صفحة 'تتبع طلبيتي' عبر الرابط الموجود في أعلى الموقع وإدخال رقم الطلب أو رقم هاتفك لمعرفة الحالة اللحظية للشحنة وموعد وصولها المتوقع.",
    answerFr:
      "Dès confirmation de votre commande, rendez-vous sur la page 'Suivi de commande' via le menu supérieur et entrez votre numéro de commande et téléphone pour consulter l'avancement en temps réel.",
    answerEn:
      "Once your order is confirmed, visit the 'Track Order' page from the top navigation and enter your order number and phone to view real-time status and estimated delivery time.",
  },
  {
    category: "payment",
    questionAr: "ما هي طرق الدفع المتاحة في المتجر؟",
    questionFr:
      "Quels sont les modes de paiement disponibles sur la boutique ?",
    questionEn: "What payment methods are available in the store?",
    answerAr:
      "طريقة الدفع الأساسية والمعتمدة لجميع ولايات الوطن هي الدفع نقداً عند الاستلام (Cash on Delivery - COD). تدفع ثمن طلبيتك فقط بعد استلام الطرد بين يديك والتحقق من سلامته.",
    answerFr:
      "Le mode de paiement principal et sécurisé pour l'ensemble du territoire est le paiement en espèces à la livraison (Cash on Delivery - COD). Vous ne réglez qu'après inspection de votre colis.",
    answerEn:
      "Our primary and trusted payment option across Algeria is Cash on Delivery (COD). You pay cash only upon receiving and inspecting your package.",
  },
  {
    category: "payment",
    questionAr: "هل الأسعار المعروضة في المتجر نهائية وشاملة؟",
    questionFr: "Les prix affichés sur le site sont-ils définitifs ?",
    questionEn: "Are the prices displayed on the store final?",
    answerAr:
      "نعم، جميع أسعار المستحضرات المعروضة بالدينار الجزائري (دج) نهائية ومطابقة للأسعار الرسمية المعتمدة، وتضاف فقط تكلفة الشحن الرمزية حسب ولايتك عند إتمام الطلب.",
    answerFr:
      "Oui, tous nos prix en Dinars Algériens (DA) sont définitifs et conformes aux tarifs officiels. Seuls les frais de livraison s'ajoutent selon votre wilaya lors de la commande.",
    answerEn:
      "Yes, all product prices in Algerian Dinars (DZD) are final and adhere to certified standards. Only nominal delivery fees are added according to your wilaya during checkout.",
  },
  {
    category: "quality",
    questionAr: "هل جميع المنتجات والمستحضرات أصلية ومضمونة؟",
    questionFr: "Tous les produits sont-ils 100% authentiques et garantis ?",
    questionEn: "Are all products 100% authentic and guaranteed?",
    answerAr:
      "نعم، 100% من المنتجات المعروضة في متجر PharmaClick أصلية ومستوردة مباشرة من الوكلاء الحصريين والمخابر المعتمدة رسمياً في الجزائر. تخضع جميع المستحضرات لرقابة صارمة وظروف تخزين قياسية تضمن فعاليتها وسلامتها.",
    answerFr:
      "Absolument, 100% des références sur PharmaClick sont garanties authentiques, issues directement des laboratoires et importateurs officiels en Algérie, conservées selon des protocoles stricts.",
    answerEn:
      "Absolutely. 100% of products featured on PharmaClick are genuine and sourced directly from official laboratories and certified distributors in Algeria under rigorous storage conditions.",
  },
  {
    category: "quality",
    questionAr: "كيف تتأكدون من سلامة تواريخ الصلاحية والتخزين؟",
    questionFr:
      "Comment assurez-vous le contrôle des dates de péremption et le stockage ?",
    questionEn: "How do you ensure proper storage and expiration date safety?",
    answerAr:
      "نلتزم بأعلى معايير مراقبة المخزون، حيث يتم فحص تواريخ الصلاحية دورياً وضمان تخزين المستحضرات ومستحضرات الوقاية في درجات حرارة ورطوبة مضبوطة ومثالية.",
    answerFr:
      "Nous appliquons une politique rigoureuse de contrôle de stock avec vérification continue des dates de péremption et maintien d'une température et d'une hygrométrie contrôlées en continu.",
    answerEn:
      "We adhere to strict inventory management standards: continuous shelf-life inspections and climate-controlled warehouse storage with optimal humidity and temperature.",
  },
  {
    category: "orders",
    questionAr: "كيف يمكنني تعديل طلبي أو إلغاؤه؟",
    questionFr: "Comment puis-je modifier ou annuler ma commande ?",
    questionEn: "How can I edit or cancel my order?",
    answerAr:
      "يمكنك تعديل طلبك أو إلغاؤه قبل شحنه عبر التواصل المباشر مع خدمة الزبائن هاتفياً أو عبر واتساب على الرقم 0541790205 وتزويدنا برقم الطلب لتعديل البيانات فوراً دون أي رسوم إضافية.",
    answerFr:
      "Vous pouvez modifier ou annuler votre commande avant expédition en contactant directement notre support client par téléphone ou WhatsApp au 0541790205 sans frais supplémentaires.",
    answerEn:
      "You can modify or cancel your order prior to dispatch by contacting customer support by phone or WhatsApp at 0541790205, referencing your order ID with no extra fees.",
  },
  {
    category: "orders",
    questionAr: "ما هي سياسة الاستبدال أو الإرجاع في حال وجود تلف؟",
    questionFr:
      "Quelle est votre politique d'échange ou de retour en cas de dommage ?",
    questionEn:
      "What is your return and exchange policy if an item is damaged?",
    answerAr:
      "إذا وصلك مستحضر متضرر أو غير مطابق لما طلبته، نرجو إبلاغنا في غضون 48 ساعة من الاستلام عبر الواتساب مع صورة المنتج، وسنقوم باستبداله فوراً أو استرجاع قيمته دون أي تكاليف شحن عليك.",
    answerFr:
      "Si un article arrive endommagé ou non conforme, signalez-le nous sous 48h avec une photo via WhatsApp. Nous procéderons à un remplacement immédiat ou un remboursement sans frais de retour.",
    answerEn:
      "If you receive a damaged or non-conforming item, notify us within 48 hours via WhatsApp with photos. We will process an immediate exchange or full refund with zero additional return costs.",
  },
  {
    category: "support",
    questionAr:
      "كيف يمكنني الحصول على استشارة لمساعدتي في اختيار المنتج المناسب؟",
    questionFr:
      "Comment puis-je obtenir un conseil personnalisé pour choisir mon soin ?",
    questionEn:
      "How can I get expert advice to choose the right skincare routine?",
    answerAr:
      "يمكنك مراسلتنا في أي وقت عبر الواتساب على الرقم 0541790205، وسيسعد مستشارو العناية لدينا بتقديم نصائح مخصصة لنوع بشرتك واحتياجاتك اليومية.",
    answerFr:
      "Écrivez-nous à tout moment sur WhatsApp au 0541790205. Nos conseillers bien-être et beauté se feront un plaisir de vous orienter vers la routine adaptée à votre type de peau.",
    answerEn:
      "Feel free to message us anytime on WhatsApp at 0541790205. Our wellness advisors will gladly guide you to the ideal routine tailored to your skin needs.",
  },
];

export default function FAQPage() {
  const { t, language, direction } = useLanguage();
  const ChevronIcon = direction === "rtl" ? ChevronLeft : ChevronRight;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: "all", label: t("faqCatAll") },
    { id: "shipping", label: t("faqCatShipping") },
    { id: "payment", label: t("faqCatPayment") },
    { id: "quality", label: t("faqCatQuality") },
    { id: "orders", label: t("faqCatOrders") },
    { id: "support", label: t("faqCatSupport") },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  const getQuestion = (item: FAQItem) => {
    if (language === "fr") return item.questionFr;
    if (language === "en") return item.questionEn;
    return item.questionAr;
  };

  const getAnswer = (item: FAQItem) => {
    if (language === "fr") return item.answerFr;
    if (language === "en") return item.answerEn;
    return item.answerAr;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* مسار التنقل */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-deep transition-colors">
            {t("home")}
          </Link>
          <ChevronIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-brand-deep">{t("footerFaq")}</span>
        </div>

        {/* رأس الصفحة */}
        <div className="bg-linear-to-l from-brand-deep via-brand-teal to-brand-turquoise text-white p-6 sm:p-10 rounded-3xl mb-8 shadow-lg text-start relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-lime">
              <HelpCircle className="w-4 h-4" />
              <span>{t("faqBadge")}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">
              {t("faqHeading")}
            </h1>
            <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
              {t("faqHeroDesc")}
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
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-brand-deep transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                    <span>{getQuestion(faq)}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-teal" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 text-start">
                    {getAnswer(faq)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* بطاقة الاتصال المباشر السريعة في الأسفل */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-brand-deep">
              {t("faqNotFoundTitle")}
            </h3>
            <p className="text-xs text-slate-500">{t("faqNotFoundDesc")}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/213541790205"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-full shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t("faqWhatsappBtn")}</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-full transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{t("faqContactPageBtn")}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
