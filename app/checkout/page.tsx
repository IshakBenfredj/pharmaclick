"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  ALGERIA_WILAYAS,
  calculateShippingFee,
  getWilayaByCode,
  TOTAL_ALGERIA_WILAYAS,
} from "@/lib/constants/wilayas";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    totalItemsCount,
    clearCart,
    hasHydrated,
    isFreeShippingEnabled,
    freeShippingThreshold,
  } = useCart();

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [alternativePhone, setAlternativePhone] = useState("");
  const [email, setEmail] = useState("");
  const [wilayaCode, setWilayaCode] = useState<number>(16); // Alger
  const [commune, setCommune] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [customerNotes, setCustomerNotes] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedWilaya = getWilayaByCode(wilayaCode) || ALGERIA_WILAYAS[0];
  const shippingFee = calculateShippingFee(wilayaCode, deliveryType, subtotal, {
    isEnabled: isFreeShippingEnabled,
    threshold: freeShippingThreshold,
  });
  const totalAmount = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage("يرجى إدخال الاسم واللقب بشكل صحيح (على الأقل 3 أحرف)");
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, "");
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMessage(
        "يرجى إدخال رقم هاتف جزائري صحيح مكون من 10 أرقام (يبدأ بـ 05 أو 06 أو 07)",
      );
      return;
    }

    if (alternativePhone.trim()) {
      const cleanAlt = alternativePhone.trim().replace(/\s+/g, "");
      if (!phoneRegex.test(cleanAlt)) {
        setErrorMessage(
          "رقم الهاتف الاحتياطي غير صالح. يرجى التأكد منه أو تركه فارغاً.",
        );
        return;
      }
    }

    if (!commune.trim()) {
      setErrorMessage("يرجى إدخال اسم البلدية");
      return;
    }

    if (
      deliveryType === "home" &&
      (!streetAddress.trim() || streetAddress.trim().length < 3)
    ) {
      setErrorMessage("يرجى إدخال تفاصيل العنوان أو الحي للتوصيل المنزلي");
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        "سلة مشترياتك فارغة! يرجى إضافة مستحضرات قبل إتمام الطلب.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: fullName.trim(),
            phone: cleanPhone,
            alternativePhone: alternativePhone.trim() || undefined,
            email: email.trim() || undefined,
          },
          shippingAddress: {
            wilayaCode: selectedWilaya.code,
            wilayaName: selectedWilaya.nameAr,
            commune: commune.trim(),
            streetAddress: streetAddress.trim() || "مكتب التوزيع",
            deliveryType,
          },
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            selectedVariant: item.selectedVariant,
            quantity: item.quantity,
          })),
          customerNotes: customerNotes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "فشل في إرسال الطلب، يرجى المحاولة مرة أخرى",
        );
      }

      // Success: Clear cart & navigate to success page
      clearCart();
      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(data.orderNumber)}&total=${encodeURIComponent(
          data.totalAmount,
        )}&wilaya=${encodeURIComponent(selectedWilaya.nameAr)}&days=${encodeURIComponent(
          selectedWilaya.estimatedDays,
        )}`,
      );
    } catch (err: any) {
      setErrorMessage(
        err.message || "حدث خطأ في الاتصال، يرجى المحاولة مجدداً",
      );
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-xl mx-auto px-4 text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            لا توجد مستحضرات لإتمام الطلب
          </h2>
          <p className="text-sm text-slate-500">
            سلتك فارغة حالياً. يرجى تصفح المتجر وإضافة المنتجات التي ترغب في
            طلبها.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-deep text-white font-bold text-sm hover:opacity-95 transition-all shadow-md"
          >
            <span>تصفح المستحضرات</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-brand-deep transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link
              href="/cart"
              className="hover:text-brand-deep transition-colors"
            >
              السلة
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">
              إتمام الطلب والشحن
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Lock className="w-7 h-7 text-brand-green" />
            إتمام الطلب والدفع عند الاستلام
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            شحن وتوصيل سريع لكافة الـ {TOTAL_ALGERIA_WILAYAS} ولاية جزائرية مع
            الدفع نقداً عند استلام الطرد
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Fields Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-brand-deep/10 text-brand-deep flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-brand-deep" />
                      معلومات الزبون الشخصية
                    </h2>
                    <p className="text-xs text-slate-500">
                      سنستخدم هذه البيانات للتواصل معك وتأكيد الطلب هاتفياً
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الاسم واللقب الكامل{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: ياسمين بلقاسم"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم الهاتف (للتأكيد والشحن){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="0550123456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-bold tracking-wider text-right"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      10 أرقام تبدأ بـ 05، 06، أو 07
                    </span>
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      رقم هاتف احتياطي (اختياري)
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="0661987654"
                      value={alternativePhone}
                      onChange={(e) => setAlternativePhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium text-right"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      في حال تعذر الوصول للرقم الأول
                    </span>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      البريد الإلكتروني (اختياري - لاستلام الفاتورة وتتبع
                      الشحنة)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-brand-deep/10 text-brand-deep flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-teal" />
                      عنوان الشحن والتوصيل ({TOTAL_ALGERIA_WILAYAS} ولاية)
                    </h2>
                    <p className="text-xs text-slate-500">
                      اختر ولايتك ونوع التوصيل المفضل لديك
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Wilaya Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      الولاية (قائمة الـ {TOTAL_ALGERIA_WILAYAS} ولاية جزائرية
                      كاملة) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={wilayaCode}
                      onChange={(e) => setWilayaCode(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.nameAr} ({w.nameFr})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Type Option */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      نوع التوصيل المطلوب{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Home Delivery */}
                      <label
                        onClick={() => setDeliveryType("home")}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          deliveryType === "home"
                            ? "border-brand-deep bg-brand-deep/5 ring-2 ring-brand-deep/20 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryType === "home"}
                          onChange={() => setDeliveryType("home")}
                          className="mt-1 text-brand-deep focus:ring-brand-deep"
                        />
                        <div className="space-y-1">
                          <span className="font-bold text-sm text-slate-900 block">
                            التوصيل لباب المنزل
                          </span>
                          <span className="text-xs text-slate-500 block">
                            يسلم الطرد مباشرة إلى عنوانك الشخصي
                          </span>
                          <span className="text-xs font-extrabold text-brand-deep block pt-1">
                            {isFreeShippingEnabled &&
                            freeShippingThreshold > 0 &&
                            subtotal >= freeShippingThreshold ? (
                              <span className="text-brand-green font-bold">
                                مجاني
                              </span>
                            ) : (
                              `${selectedWilaya.defaultHomeFee.toLocaleString("ar-DZ")} دج`
                            )}
                          </span>
                        </div>
                      </label>

                      {/* Desk Delivery */}
                      <label
                        onClick={() => setDeliveryType("desk")}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          deliveryType === "desk"
                            ? "border-brand-deep bg-brand-deep/5 ring-2 ring-brand-deep/20 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={deliveryType === "desk"}
                          onChange={() => setDeliveryType("desk")}
                          className="mt-1 text-brand-deep focus:ring-brand-deep"
                        />
                        <div className="space-y-1">
                          <span className="font-bold text-sm text-slate-900 block">
                            مكتب التوزيع (Stop Desk)
                          </span>
                          <span className="text-xs text-slate-500 block">
                            الاستلام من مكتب شركة الشحن في ولايتك
                          </span>
                          <span className="text-xs font-extrabold text-brand-green block pt-1">
                            {isFreeShippingEnabled &&
                            freeShippingThreshold > 0 &&
                            subtotal >= freeShippingThreshold ? (
                              <span className="text-brand-green font-bold">
                                مجاني
                              </span>
                            ) : (
                              `${selectedWilaya.defaultDeskFee.toLocaleString("ar-DZ")} دج (سعر مخفض)`
                            )}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Commune */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      البلدية <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: دالي إبراهيم / وهران وسط / بومرداس"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium"
                    />
                  </div>

                  {/* Street Address */}
                  {deliveryType === "home" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        العنوان التفصيلي / الحي / رقم العمارة{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={deliveryType === "home"}
                        placeholder="مثال: حي 500 مسكن، عمارة ب، شقة 14"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium"
                      />
                    </div>
                  )}

                  {/* Delivery timeframe note */}
                  <div className="p-3.5 rounded-2xl bg-brand-turquoise/5 border border-brand-turquoise/20 flex items-center justify-between text-xs text-slate-700">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-brand-teal" />
                      <span>
                        المدة التقديرية للتسليم إلى{" "}
                        <strong>{selectedWilaya.nameAr}</strong>:
                      </span>
                    </span>
                    <strong className="text-brand-deep font-bold">
                      {selectedWilaya.estimatedDays}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-brand-deep/10 text-brand-deep flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-brand-green" />
                      طريقة الدفع المعتمدة
                    </h2>
                    <p className="text-xs text-slate-500">
                      الدفع آمن ومريح لكافة الزبائن
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl border-2 border-brand-green/30 bg-brand-green/5 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900">
                      الدفع نقدًا عند الاستلام (Cash on Delivery - COD)
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      لا يلزمك أي دفع مسبق أو بطاقة بنكية. ستدفع المبلغ الإجمالي
                      نقدًا لعون التوصيل فقط عند استلام طردك بيدك بعد تفقد سلامة
                      المحتويات.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Notes */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  ملاحظات إضافية حول التوصيل (اختياري):
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: يرجى الاتصال قبل الوصول بنصف ساعة، أو التسليم بعد العصر..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50/50 text-slate-800 text-sm font-medium"
                />
              </div>
            </div>

            {/* Order Review Sidebar */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Package className="w-4 h-4 text-brand-deep" />
                    مراجعة الطلبية ({totalItemsCount} مستحضرات)
                  </h3>
                  <Link
                    href="/cart"
                    className="text-xs text-brand-teal hover:text-brand-deep font-semibold"
                  >
                    تعديل السلة
                  </Link>
                </div>

                {/* Items Thumbnails List */}
                <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-slate-50">
                  {items.map((item) => (
                    <div key={item.id} className="pt-2 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 relative shrink-0 border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-300" />
                        )}
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-deep text-white text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">
                          {item.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-[10px] text-brand-teal">
                            {item.selectedVariant}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          {(item.price * item.quantity).toLocaleString("ar-DZ")}{" "}
                          دج
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Breakdown Costs */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>مجموع المنتجات:</span>
                    <span className="font-bold text-slate-900">
                      {subtotal.toLocaleString("ar-DZ")} دج
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      تكلفة التوصيل ({selectedWilaya.nameAr} -{" "}
                      {deliveryType === "home" ? "للمنزل" : "Stop Desk"}):
                    </span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? (
                        <span className="text-brand-green font-bold">
                          مجاني
                        </span>
                      ) : (
                        `${shippingFee.toLocaleString("ar-DZ")} دج`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-base">
                    <span className="font-extrabold text-slate-900">
                      المبلغ الصافي للدفع:
                    </span>
                    <div className="text-left">
                      <span className="font-black text-2xl text-brand-deep">
                        {totalAmount.toLocaleString("ar-DZ")} دج
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        تدفع نقداً فور وصول الطرد
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-extrabold text-base flex items-center justify-center gap-2 hover:opacity-95 shadow-xl shadow-brand-deep/20 hover:shadow-2xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري تأكيد وتسجيل طلبك...</span>
                    </>
                  ) : (
                    <>
                      <span>تأكيد الطلب والدفع عند الاستلام</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Guarantees */}
                <div className="pt-2 space-y-2 text-[11px] text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-green shrink-0" />
                    <span>تأكيد فوري عبر مكالمة هاتفية قبل خروج الشحنة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-teal shrink-0" />
                    <span>
                      توصيل سريع وآمن لجميع الـ {TOTAL_ALGERIA_WILAYAS} ولاية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
