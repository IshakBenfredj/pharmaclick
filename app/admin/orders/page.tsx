'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
  Phone,
  User,
  MapPin,
  FileText,
  Printer,
  ChevronDown,
  Eye,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { TOTAL_ALGERIA_WILAYAS } from '@/lib/constants/wilayas';

interface AdminOrder {
  id: string;
  orderNumber?: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  wilaya: string;
  wilayaCode: number;
  commune: string;
  streetAddress?: string;
  deliveryType: 'home' | 'desk';
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  notes?: string;
  items: Array<{
    name: string;
    variant?: string;
    quantity: number;
    price: number;
  }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch orders from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const updateOrderStatus = async (orderId: string, newStatus: AdminOrder['status']) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setFeedback({
          type: 'success',
          message: 'تم تحديث حالة الطلبية وحفظها في قاعدة البيانات بنجاح!',
        });
      } else {
        throw new Error(data.message || 'فشل في تحديث حالة الطلب');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر تحديث حالة الطلبية',
      });
    }
  };

  const getStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            جديد
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1">
            <Package className="w-3 h-3" />
            قيد التجهيز
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 inline-flex items-center gap-1">
            <Truck className="w-3 h-3" />
            في طريق الشحن
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            تم التسليم
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            ملغى
          </span>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5 font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>

          <button
            onClick={() => setFeedback(null)}
            className="p-1 rounded-lg hover:bg-black/5 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-brand-deep transition-colors">
              لوحة التحكم
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">إدارة الطلبات والمبيعات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-brand-deep" />
            إدارة طلبيات الزبائن ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تأكيد الطلبات، معالجة الدفع عند الاستلام (COD)، ومتابعة الشحن لكافة الـ {TOTAL_ALGERIA_WILAYAS} ولاية.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          توصيل لكافة الولايات الـ {TOTAL_ALGERIA_WILAYAS} بنظام COD
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          {[
            { id: 'all', label: 'كافة الطلبات' },
            { id: 'pending', label: 'طلبات جديدة', count: orders.filter((o) => o.status === 'pending').length },
            { id: 'processing', label: 'قيد التجهيز', count: orders.filter((o) => o.status === 'processing').length },
            { id: 'shipped', label: 'في طريق الشحن', count: orders.filter((o) => o.status === 'shipped').length },
            { id: 'delivered', label: 'تم التسليم' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    statusFilter === tab.id ? 'bg-white text-brand-deep' : 'bg-brand-deep text-white'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث برقم الطلب (ORD-...)، اسم الزبون، رقم الهاتف، أو الولاية..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">جاري تحميل الطلبيات من قاعدة البيانات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-700">لا توجد طلبيات مطابقة للبحث</h3>
            <p className="text-xs text-slate-400">ستظهر الطلبيات الجديدة فور قيام الزبائن بالشراء من المتجر.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">رقم الطلب</th>
                  <th className="py-3.5 px-4">الزبون والهاتف</th>
                  <th className="py-3.5 px-4">عنوان التوصيل</th>
                  <th className="py-3.5 px-4">نوع الشحن</th>
                  <th className="py-3.5 px-4">المبلغ الصافي</th>
                  <th className="py-3.5 px-4">الحالة</th>
                  <th className="py-3.5 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-brand-deep block">{order.orderNumber || order.id}</span>
                      <span className="text-[11px] text-slate-400 block">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-DZ') : ''}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono" dir="ltr">
                        {order.phone}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {order.wilaya} ({order.wilayaCode})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                        {order.commune}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          order.deliveryType === 'home'
                            ? 'bg-brand-deep/10 text-brand-deep'
                            : 'bg-emerald-50 text-brand-green'
                        }`}
                      >
                        {order.deliveryType === 'home' ? 'لباب المنزل' : 'Stop Desk'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-slate-900 block">
                        {order.totalAmount.toLocaleString('ar-DZ')} دج
                      </span>
                      <span className="text-[10px] text-slate-400 block">الدفع عند الاستلام</span>
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-deep hover:text-white text-slate-700 font-bold transition-all inline-flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>تفاصيل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">تفاصيل الطلبية</span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>{selectedOrder.orderNumber || selectedOrder.id}</span>
                  {getStatusBadge(selectedOrder.status)}
                </h3>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Delivery Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-teal" />
                  <span>الزبون:</span>
                  <strong className="text-slate-900">{selectedOrder.customerName}</strong>
                </span>

                <span className="font-bold text-slate-700 flex items-center gap-1.5" dir="ltr">
                  <Phone className="w-4 h-4 text-brand-green" />
                  <span>{selectedOrder.phone}</span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-4 h-4 text-brand-deep shrink-0" />
                <span>
                  <strong>{selectedOrder.wilaya} ({selectedOrder.wilayaCode})</strong> - بلدية {selectedOrder.commune}
                  {selectedOrder.streetAddress && ` - ${selectedOrder.streetAddress}`}
                </span>
              </div>

              {selectedOrder.notes && (
                <div className="pt-2 border-t border-slate-200/60 text-slate-600">
                  <strong>ملاحظة الزبون:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            {/* Items Ordered */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">محتويات الطلبية</h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      {item.variant && (
                        <span className="text-[11px] text-brand-teal block">{item.variant}</span>
                      )}
                    </div>
                    <div className="text-left font-bold text-slate-800">
                      <span>{item.quantity} × {item.price.toLocaleString('ar-DZ')} دج</span>
                      <strong className="block text-brand-deep">
                        {(item.quantity * item.price).toLocaleString('ar-DZ')} دج
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Costs Breakdown */}
            <div className="p-4 rounded-2xl bg-brand-turquoise/5 border border-brand-turquoise/20 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>المجموع الفرعي للمنتجات:</span>
                <span className="font-bold">{selectedOrder.subtotal.toLocaleString('ar-DZ')} دج</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>تكلفة الشحن ({selectedOrder.deliveryType === 'home' ? 'توصيل منزلي' : 'Stop Desk'}):</span>
                <span className="font-bold">
                  {selectedOrder.shippingFee === 0 ? 'مجاني' : `${selectedOrder.shippingFee.toLocaleString('ar-DZ')} دج`}
                </span>
              </div>
              <div className="pt-2 border-t border-brand-teal/20 flex items-center justify-between text-sm font-black text-brand-deep">
                <span>المبلغ الإجمالي للتحصيل (COD):</span>
                <span className="text-base text-brand-green">
                  {selectedOrder.totalAmount.toLocaleString('ar-DZ')} دج
                </span>
              </div>
            </div>

            {/* Change Status & Actions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block">تحديث حالة الطلب في قاعدة البيانات:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  تأكيد وقيد التجهيز
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  تسليم لشركة الشحن
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  تم التسليم للزبون
                </button>
                <button
                  type="button"
                  onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  إلغاء الطلب
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
