'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  ShoppingBag,
} from 'lucide-react';
import { TOTAL_ALGERIA_WILAYAS } from '@/lib/constants/wilayas';

interface TimelineStep {
  step: number;
  key: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface OrderData {
  orderNumber: string;
  customerName?: string;
  phoneMasked?: string;
  shippingAddress: {
    wilayaCode: number;
    wilayaName: string;
    commune: string;
    streetAddress: string;
    deliveryType: 'home' | 'desk';
  };
  items: Array<{
    productName: string;
    selectedVariant?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  timeline: TimelineStep[];
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [order, setOrder] = useState<OrderData | null>(null);

  // Auto-search if orderNumber is already in URL
  useEffect(() => {
    if (initialOrderNumber && initialOrderNumber.length >= 6) {
      setOrderNumber(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOrder(null);

    const cleanOrderNumber = orderNumber.trim();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    if (!cleanOrderNumber) {
      setErrorMessage('يرجى إدخال رقم الطلب المرجعي (مثال: ORD-2026-123456)');
      return;
    }

    if (!cleanPhone) {
      setErrorMessage('يرجى إدخال رقم الهاتف المسجل لتأكيد هويتك والتحقق من الطلب');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(
          cleanOrderNumber
        )}&phone=${encodeURIComponent(cleanPhone)}`
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'لم نتمكن من العثور على هذا الطلب');
      }

      setOrder(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          text: 'قيد الانتظار والمراجعة',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'confirmed':
        return {
          text: 'تم التأكيد هاتفياً',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'processing':
        return {
          text: 'قيد التجهيز والتغليف',
          className: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'shipped':
        return {
          text: 'في طريق التوصيل',
          className: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        };
      case 'delivered':
        return {
          text: 'تم التسليم بنجاح',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'cancelled':
        return {
          text: 'تم إلغاء الطلب',
          className: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      default:
        return {
          text: status,
          className: 'bg-slate-100 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-deep/10 text-brand-deep text-xs font-bold">
          <Truck className="w-3.5 h-3.5" />
          تتبع شحنتك المباشرة للـ {TOTAL_ALGERIA_WILAYAS} ولاية
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          تتبع حالة طلبيتك بكل سهولة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          أدخل رقم الطلب المسلم إليك ورقم الهاتف لمعرفة المرحلة الحالية لطردك وموعد وصوله
        </p>
      </div>

      {/* Tracking Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-100/50 max-w-2xl mx-auto">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الطلب (Order Number) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                placeholder="ORD-2026-XXXXXX"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono font-bold text-right uppercase"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف المسجل <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="0550XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold text-right"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-deep to-brand-teal text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-md shadow-brand-deep/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري البحث عن الشحنة...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>تتبع حالة الطلب</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden divide-y divide-slate-100 animate-fadeIn">
          {/* Header Summary */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">تفاصيل الطلبية المرجعية:</span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-deep font-mono tracking-wider">
                {order.orderNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                  getStatusBadge(order.status).className
                }`}
              >
                {getStatusBadge(order.status).text}
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-sm text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-teal" />
              مسار تقدم الطلبية والشحن
            </h3>

            <div className="relative">
              <div className="space-y-6">
                {order.timeline.map((step, idx) => {
                  const isLast = idx === order.timeline.length - 1;
                  return (
                    <div key={step.step} className="flex gap-4 relative">
                      {/* Line connector */}
                      {!isLast && (
                        <div
                          className={`absolute right-4 top-8 bottom-0 w-0.5 -mr-[1px] ${
                            step.completed ? 'bg-brand-green' : 'bg-slate-200'
                          }`}
                        />
                      )}

                      {/* Icon Node */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                          step.completed
                            ? 'bg-brand-green text-white shadow-md shadow-brand-green/30'
                            : step.current
                            ? 'bg-brand-deep text-white ring-4 ring-brand-deep/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{step.step}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 pb-4">
                        <h4
                          className={`text-sm font-bold ${
                            step.completed
                              ? 'text-slate-900'
                              : step.current
                              ? 'text-brand-deep font-extrabold'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50">
            {/* Delivery destination */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-teal" />
                وجهة التوصيل
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1 text-xs">
                <p className="font-bold text-slate-900 text-sm">
                  ولاية {order.shippingAddress.wilayaName} (ولاية{' '}
                  {order.shippingAddress.wilayaCode})
                </p>
                <p className="text-slate-600">البلدية: {order.shippingAddress.commune}</p>
                <p className="text-slate-500">
                  العنوان:{' '}
                  {order.shippingAddress.deliveryType === 'home'
                    ? order.shippingAddress.streetAddress
                    : 'مكتب شركة التوصيل (Stop Desk)'}
                </p>
                <p className="text-brand-deep font-semibold pt-1">
                  نوع الاستلام:{' '}
                  {order.shippingAddress.deliveryType === 'home'
                    ? 'توصيل لباب المنزل'
                    : 'مكتب التوزيع'}
                </p>
              </div>
            </div>

            {/* Payment & Total Amount */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green" />
                الدفع والمبلغ الإجمالي
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold">{order.subtotal.toLocaleString('ar-DZ')} دج</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>رسوم التوصيل:</span>
                  <span className="font-semibold">
                    {order.shippingFee === 0 ? 'مجاناً' : `${order.shippingFee.toLocaleString('ar-DZ')} دج`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">المبلغ للدفع عند الاستلام:</span>
                  <span className="font-extrabold text-base text-brand-deep">
                    {order.totalAmount.toLocaleString('ar-DZ')} دج
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-medium pt-1">
                  ✓ الدفع نقداً عند استلام الطرد
                </p>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="p-6 sm:p-8 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-brand-deep" />
              محتويات الطرد ({order.items.length} مستحضرات)
            </h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{item.productName}</span>
                    {item.selectedVariant && (
                      <span className="text-[11px] text-brand-teal mr-2">
                        ({item.selectedVariant})
                      </span>
                    )}
                    <span className="text-slate-400 block sm:inline sm:mr-3">
                      الكمية: {item.quantity}
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    {item.totalPrice.toLocaleString('ar-DZ')} دج
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Support CTA */}
          <div className="p-6 bg-slate-50 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <p className="font-bold text-slate-800">هل تحتاج لتعديل عنوان التوصيل أو لديك استفسار؟</p>
              <p className="text-slate-500">فريق خدمة العملاء متواجد لمساعدتك يومياً</p>
            </div>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-deep font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>تواصل مع الدعم</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50/70">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
          </div>
        }
      >
        <TrackingContent />
      </Suspense>
    </div>
  );
}
