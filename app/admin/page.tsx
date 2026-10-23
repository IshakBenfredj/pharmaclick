"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Truck,
  Layers,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Users,
  Eye,
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/data/mockData";
import { TOTAL_ALGERIA_WILAYAS } from "@/lib/constants/wilayas";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 485200,
    totalOrders: 64,
    pendingOrders: 8,
    deliveredOrders: 52,
    totalProducts: MOCK_PRODUCTS.length,
    lowStockCount: MOCK_PRODUCTS.filter((p) => p.stockQuantity < 10).length,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: "ORD-2026-948123",
      customer: "أحمد بن علي",
      phone: "0550123456",
      wilaya: "الجزائر (16)",
      totalAmount: 12400,
      deliveryType: "لباب المنزل",
      status: "pending",
      date: "اليوم، 11:20 ص",
    },
    {
      id: "ORD-2026-948122",
      customer: "فاطمة الزهراء قاسمي",
      phone: "0661987654",
      wilaya: "وهران (31)",
      totalAmount: 7600,
      deliveryType: "Stop Desk",
      status: "processing",
      date: "اليوم، 09:45 ص",
    },
    {
      id: "ORD-2026-948121",
      customer: "محمد لمين بوزيد",
      phone: "0772345678",
      wilaya: "قسنطينة (25)",
      totalAmount: 18200,
      deliveryType: "لباب المنزل",
      status: "shipped",
      date: "أمس",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/admin/orders"),
          fetch("/api/admin/products"),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (ordersData.success && Array.isArray(ordersData.orders)) {
            const list = ordersData.orders;
            const totalSales = list.reduce(
              (sum: number, o: any) => sum + (o.totalAmount || 0),
              0,
            );
            const pendingOrders = list.filter(
              (o: any) => o.status === "pending",
            ).length;
            const deliveredOrders = list.filter(
              (o: any) => o.status === "delivered",
            ).length;

            setStats((prev) => ({
              ...prev,
              totalSales: totalSales > 0 ? totalSales : prev.totalSales,
              totalOrders: list.length,
              pendingOrders,
              deliveredOrders,
            }));

            if (list.length > 0) {
              setRecentOrders(
                list.slice(0, 5).map((o: any) => ({
                  id: o.orderNumber || o.id,
                  customer: o.customerName,
                  phone: o.phone,
                  wilaya: `${o.wilaya} (${o.wilayaCode})`,
                  totalAmount: o.totalAmount,
                  deliveryType:
                    o.deliveryType === "home" ? "لباب المنزل" : "Stop Desk",
                  status: o.status,
                  date: o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("ar-DZ")
                    : "اليوم",
                })),
              );
            }
          }
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.success && Array.isArray(productsData.products)) {
            const plist = productsData.products;
            const lowStockCount = plist.filter(
              (p: any) => (p.stockQuantity ?? 10) < 10,
            ).length;
            setStats((prev) => ({
              ...prev,
              totalProducts: plist.length,
              lowStockCount,
            }));
          }
        }
      } catch (err) {
        console.warn("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            جديد قيد التأكيد
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 w-fit">
            <Package className="w-3 h-3" />
            قيد التجهيز
          </span>
        );
      case "shipped":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1 w-fit">
            <Truck className="w-3 h-3" />
            في طريق الشحن
          </span>
        );
      case "delivered":
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            تم التسليم بنجاح
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Top Welcome & Fast Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-extrabold text-brand-teal uppercase tracking-wider block mb-1">
            مرحباً بك في لوحة القيادة
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            نظرة عامة على نشاط المتجر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة حية للمبيعات، تجهيز الطلبيات لكافة الـ{" "}
            {TOTAL_ALGERIA_WILAYAS} ولاية، وإدارة المخزون.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-linear-to-r from-brand-deep to-brand-teal text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Link>

          <Link
            href="/admin/shipping"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-2 shadow-xs"
          >
            <Truck className="w-4 h-4 text-brand-teal" />
            <span>إعدادات الشحن</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              إجمالي المبيعات
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalSales.toLocaleString("ar-DZ")}{" "}
              <span className="text-sm font-bold text-slate-500">دج</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% مقارنة بالشهر السابق</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              إجمالي الطلبات
            </span>
            <div className="w-10 h-10 rounded-2xl bg-brand-deep/10 text-brand-deep flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalOrders}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              منها{" "}
              <strong className="text-amber-600 font-bold">
                {stats.pendingOrders} طلبات جديدة
              </strong>{" "}
              بحاجة للتأكيد
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              المستحضرات المعروضة
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-brand-teal flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.totalProducts}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              موزعة عبر {MOCK_CATEGORIES.length} أقسام وتصنيفات رئيسية
            </p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              تنبيهات المخزون
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-rose-600">
              {stats.lowStockCount}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              منتجات أوشكت على النفاد (أقل من 10 قطع)
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Quick Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-deep" />
                أحدث الطلبيات الواردة
              </h2>
              <p className="text-xs text-slate-500">
                قائمة الطلبات الأخيرة المستلمة من الزبائن عبر المتجر
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-deep hover:text-brand-teal transition-colors inline-flex items-center gap-1"
            >
              <span>عرض كافة الطلبات</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-3">رقم الطلب</th>
                  <th className="py-3 px-3">الزبون</th>
                  <th className="py-3 px-3">الولاية والتوصيل</th>
                  <th className="py-3 px-3">المبلغ الصافي</th>
                  <th className="py-3 px-3">الحالة</th>
                  <th className="py-3 px-3 text-left">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-3 font-extrabold text-brand-deep">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">
                        {order.customer}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {order.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">
                        {order.wilaya}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.deliveryType}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-black text-slate-900">
                      {order.totalAmount.toLocaleString("ar-DZ")} دج
                    </td>
                    <td className="py-3.5 px-3">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3.5 px-3 text-left text-slate-400 font-medium">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System & Catalog Status (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fast Navigation Shortcut Cards */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              إجراءات سريعة
            </h3>
            <div className="space-y-2.5">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-brand-teal/40 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-deep/10 text-brand-deep flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span>إضافة مستحضر جديد للمتجر</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/shipping"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-brand-teal/40 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>ضبط سياسة الشحن والمجاني</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/banners"
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-brand-teal/40 hover:bg-slate-50 transition-all text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>إدارة لافتات العروض الترويجية</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* National Coverage Status Box */}
          <div className="bg-linear-to-br from-brand-deep to-brand-teal text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-turquoise bg-white/10 px-2.5 py-1 rounded-full">
                المعيار الإداري المعتمد
              </span>
              <Truck className="w-5 h-5 text-brand-turquoise" />
            </div>
            <div className="space-y-1">
              <h4 className="font-black text-xl">
                تغطية الـ {TOTAL_ALGERIA_WILAYAS} ولاية
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                النظام مهيأ للتوصيل المنزلي ومكاتب التوزيع Stop Desk لكافة
                ولايات الجزائر الـ 69 مع تفعيل الدفع عند الاستلام.
              </p>
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold">
              <span>حالة خادم الطلبات:</span>
              <span className="text-brand-green flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                نشط ويعمل
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
