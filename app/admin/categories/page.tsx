"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  ChevronLeft,
  CheckCircle2,
  Package,
} from "lucide-react";
import { MOCK_CATEGORIES, MockCategory } from "@/lib/data/mockData";
import { FormLabelWithHelp } from "@/components/ui";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<MockCategory[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New category form state
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const filteredCategories = categories.filter(
    (c) =>
      c.nameAr.includes(searchTerm) ||
      c.nameFr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.slug.includes(searchTerm),
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;

    const newCat: MockCategory = {
      _id: `cat_${Date.now()}`,
      nameAr,
      nameFr: nameFr || nameAr,
      nameEn: nameEn || "",
      slug: slug || nameAr.toLowerCase().replace(/\s+/g, "-"),
      icon: "Package",
      image: "/categories/skincare.png",
      descriptionAr,
      descriptionFr: "",
      descriptionEn: "",
      productCount: 0,
    };

    setCategories([...categories, newCat]);
    setNameAr("");
    setNameFr("");
    setNameEn("");
    setSlug("");
    setDescriptionAr("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
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
              إدارة الأقسام والتصنيفات
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Layers className="w-7 h-7 text-brand-deep" />
            شجرة الأقسام والتصنيفات ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            تنظيم هيكل المنتجات والتصنيفات الرئيسية والفرعية لتسهيل تصفح
            الزبائن.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-linear-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن قسم بالعربية أو الفرنسية أو الرابط..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-brand-deep/10 text-brand-deep flex items-center justify-center font-bold text-lg">
                <FolderTree className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                {cat.productCount} مستحضر
              </span>
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900">
                {cat.nameAr}
              </h3>
              <p className="text-xs text-brand-teal font-semibold font-sans">
                {cat.nameFr}
              </p>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                /{cat.slug}
              </span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {cat.descriptionAr || "لا يوجد وصف مختصر لهذا القسم."}
            </p>

            {cat.subCategories && cat.subCategories.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block">
                  التصنيفات الفرعية:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subCategories.map((sub, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                    >
                      {sub.nameAr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-teal" />
              إضافة قسم رئيسي جديد
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <FormLabelWithHelp
                  label="اسم القسم بالعربية"
                  htmlFor="newCatNameAr"
                  required
                  helpText="الاسم الرسمي المعتمد للقسم باللغة العربية الذي يظهر في القائمة الرئيسية وشجرة الأقسام."
                />
                <input
                  id="newCatNameAr"
                  type="text"
                  required
                  placeholder="مثال: العناية بالشعر وفروة الرأس"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="اسم القسم بالفرنسية"
                  htmlFor="newCatNameFr"
                  badge="اختياري"
                  helpText="الاسم المعتمد للقسم باللغة الفرنسية لعرضه تحت العنوان الرئيسي أو عند التبديل للفرنسية (اختياري، في حال تركه فارغاً يُعتمد العربي)."
                />
                <input
                  id="newCatNameFr"
                  type="text"
                  dir="ltr"
                  placeholder="Soins Capillaires (اختياري)"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="اسم القسم بالإنجليزية"
                  htmlFor="newCatNameEn"
                  badge="اختياري"
                  helpText="الاسم المعتمد للقسم باللغة الإنجليزية لعرضه عند التبديل للإنجليزية (اختياري، في حال تركه فارغاً يُعتمد العربي)."
                />
                <input
                  id="newCatNameEn"
                  type="text"
                  dir="ltr"
                  placeholder="Hair Care (Optional)"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="الرابط الدائم (Slug)"
                  htmlFor="newCatSlug"
                  badge="إنجليزي"
                  helpText="المعرف الإنجليزي الفريد الذي يظهر في رابط صفحة القسم (مثال: hair-care)."
                />
                <input
                  id="newCatSlug"
                  type="text"
                  dir="ltr"
                  placeholder="hair-care"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="وصف القسم"
                  htmlFor="newCatDesc"
                  helpText="نبذة سريعة توضح ماهية المستحضرات التي تندرج تحت هذا القسم لتظهر أعلى صفحة القسم."
                />
                <textarea
                  id="newCatDesc"
                  rows={2}
                  placeholder="مجموعة متكاملة من الشامبوهات الطبية والزيوت والسيرومات..."
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-deep text-white font-bold text-xs shadow-md shadow-brand-deep/20 hover:opacity-95"
                >
                  إضافة القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
