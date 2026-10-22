"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  Award,
  Sliders,
  Image as ImageIcon,
  ShoppingBag,
  Truck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";
import { TOTAL_ALGERIA_WILAYAS } from "@/lib/constants/wilayas";

interface AdminNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: AdminNavItem[] = [
  {
    title: "نظرة عامة والإحصائيات",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "الأقسام والتصنيفات",
    href: "/admin/categories",
    icon: Layers,
  },
  {
    title: "العلامات التجارية",
    href: "/admin/brands",
    icon: Award,
  },
  {
    title: "المحرك الترويجي",
    href: "/admin/marketing",
    icon: Sliders,
  },
  {
    title: "اللافتات الإعلانية",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    title: "إدارة الطلبات",
    href: "/admin/orders",
    icon: ShoppingBag,
    badge: "جديد",
  },
  {
    title: "إعدادات الشحن والتوصيل",
    href: "/admin/shipping",
    icon: Truck,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If login page, don't show the dashboard shell (sidebar, mobile header, etc.)
  const isLoginPage =
    pathname === '/admin/login' ||
    pathname === '/login' ||
    Boolean(pathname && pathname.includes('login'));

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch (e) {
      console.error("Logout error:", e);
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-brand-deep to-brand-teal flex items-center justify-center shadow-md">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white">PharmaClick Admin</h1>
            <p className="text-[10px] text-slate-400">لوحة التحكم المركزية</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="تبديل القائمة"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-slate-900 text-slate-200 flex flex-col border-l border-slate-800/80 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-brand-deep via-brand-teal to-brand-green flex items-center justify-center text-white shadow-lg shadow-brand-deep/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-base text-white tracking-wide block">
                PharmaClick
              </span>
              <span className="text-[11px] font-bold text-brand-turquoise block">
                لوحة التحكم الإدارية
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store National Coverage Badge */}
        <div className="px-5 py-3 bg-brand-deep/20 border-b border-brand-teal/20 text-xs flex items-center justify-between">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-teal" />
            <span>تغطية وطنية شاملة</span>
          </span>
          <span className="font-extrabold text-[11px] px-2 py-0.5 rounded bg-brand-teal/20 text-brand-turquoise border border-brand-teal/30">
            {TOTAL_ALGERIA_WILAYAS} ولاية
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3.5 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-linear-to-r from-brand-deep to-brand-teal text-white shadow-md shadow-brand-deep/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.title}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-green/20 text-brand-green border border-brand-green/30 font-extrabold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick View Public Store */}
        <div className="p-3 border-t border-slate-800/80">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700/60"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-teal" />
              <span>معاينة واجهة المتجر</span>
            </div>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
          </Link>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/20 text-brand-teal font-extrabold flex items-center justify-center shrink-0 border border-brand-teal/30">
              AD
            </div>
            <div className="min-w-0">
              <span className="font-bold text-xs text-white block truncate">
                المدير العام
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                admin@pharmaclick.dz
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
