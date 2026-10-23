"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MockProduct,
} from "@/lib/data/mockData";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>("all");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedStockStatus !== "all")
        params.set("stock", selectedStockStatus);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          return;
        }
      }
      // Fallback
      setProducts(MOCK_PRODUCTS);
    } catch (err: any) {
      console.warn("Error fetching products from backend:", err);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedStockStatus]);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (
      !confirm(
        `هل أنت متأكد من حذف المستحضر: "${name}" من المتجر وقاعدة البيانات؟`,
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setFeedback({
          type: "success",
          message: `تم حذف "${name}" بنجاح من قاعدة البيانات`,
        });
      } else {
        throw new Error(data.message || "فشل في حذف المستحضر");
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || "حدث خطأ أثناء محاولة حذف المستحضر",
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2.5 font-bold">
            {feedback.type === "success" ? (
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

      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link
              href="/admin"
              className="hover:text-brand-deep transition-colors"
            >
              لوحة التحكم
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">
              إدارة المستحضرات والمنتجات
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Package className="w-7 h-7 text-brand-deep" />
            قائمة المستحضرات والمنتجات ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة الأسعار، الخصومات، صور المستحضرات المرفوعة، ومتابعة المخزون
            مباشرة من قاعدة البيانات.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-3 rounded-2xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة مستحضر جديد</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <input
            type="text"
            placeholder="ابحث بالاسم، الماركة، أو الرابط..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 min-w-45">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-bold"
          >
            <option value="all">كافة الأقسام والتصنيفات</option>
            {MOCK_CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nameAr}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <div className="min-w-40">
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-bold"
          >
            <option value="all">كافة حالات المخزون</option>
            <option value="in_stock">متوفر (10+ قطع)</option>
            <option value="low_stock">مخزون منخفض (أقل من 10)</option>
            <option value="out_of_stock">غير متوفر (نافد)</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">
              جاري تحميل المستحضرات...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-700">
              لم يتم العثور على أي مستحضرات
            </h3>
            <p className="text-xs text-slate-400">
              جرب تغيير كلمات البحث أو الفلاتر المختارة.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">المستحضر</th>
                  <th className="py-3.5 px-4">القسم والماركة</th>
                  <th className="py-3.5 px-4">السعر المعتمد</th>
                  <th className="py-3.5 px-4">التخفيض</th>
                  <th className="py-3.5 px-4">حالة المخزون</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Product Info & Thumb */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 relative shrink-0 overflow-hidden flex items-center justify-center">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            href={`/product/${product.slug}`}
                            target="_blank"
                            className="font-extrabold text-slate-900 hover:text-brand-deep transition-colors line-clamp-1 block"
                          >
                            {product.name}
                          </Link>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Brand */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800">
                        {product.category}
                      </div>
                      <div className="text-[11px] text-brand-teal font-semibold">
                        {product.brand}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <span className="font-black text-sm text-brand-deep block">
                        {product.price.toLocaleString("ar-DZ")} دج
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through block">
                            {product.originalPrice.toLocaleString("ar-DZ")} دج
                          </span>
                        )}
                    </td>

                    {/* Discount */}
                    <td className="py-3 px-4">
                      {product.discountPercentage ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 font-extrabold text-[11px] border border-rose-200">
                          -{product.discountPercentage}% خصم
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          لا يوجد
                        </span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3 px-4">
                      {product.stockQuantity === 0 || !product.inStock ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          نافد من المخزون
                        </span>
                      ) : product.stockQuantity < 10 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          منخفض ({product.stockQuantity} قطع)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          متوفر ({product.stockQuantity} قطعة)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-deep hover:bg-slate-100 transition-colors"
                          title="معاينة في المتجر"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteProduct(product._id, product.name)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="حذف المستحضر"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
