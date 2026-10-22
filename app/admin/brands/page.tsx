'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Plus,
  Search,
  Globe,
  Tag,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MOCK_BRANDS, MockBrand } from '@/lib/data/mockData';
import { FormLabelWithHelp } from '@/components/ui';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<MockBrand[]>(MOCK_BRANDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New brand form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('فرنسا (France)');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.countryOfOrigin.includes(searchTerm) ||
      b.slug.includes(searchTerm)
  );

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newBrand: MockBrand = {
      _id: `brand_${Date.now()}`,
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      logoUrl: '/brands/laroche.png',
      description,
      countryOfOrigin,
      isFeatured,
    };

    setBrands([...brands, newBrand]);
    setName('');
    setSlug('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-brand-deep transition-colors">
              لوحة التحكم
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">إدارة العلامات التجارية والمخابر</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Award className="w-7 h-7 text-brand-deep" />
            العلامات التجارية المعتمدة ({brands.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة الماركات، بلدان المنشأ، وشعارات المخابر المعتمدة المعروضة في المتجر.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة علامة تجارية</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث باسم الماركة أو بلد المنشأ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-brand-deep text-lg border border-slate-200">
                {b.name.slice(0, 2).toUpperCase()}
              </div>
              {b.isFeatured && (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-brand-deep/10 text-brand-deep border border-brand-deep/20">
                  علامة مميزة
                </span>
              )}
            </div>

            <div>
              <h3 className="font-black text-base text-slate-900">{b.name}</h3>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-brand-teal" />
                <span>{b.countryOfOrigin}</span>
              </p>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">/{b.slug}</span>
            </div>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {b.description || 'مخبر معتمد يقدم حلولاً متطورة للعناية والصحة.'}
            </p>
          </div>
        ))}
      </div>

      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-teal" />
              إضافة علامة تجارية جديدة
            </h3>

            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <FormLabelWithHelp
                  label="اسم العلامة التجارية (الماركة)"
                  htmlFor="newBrandName"
                  required
                  helpText="الاسم الرسمي المعتمد للماركة أو المخبر المصنع (مثال: La Roche-Posay أو CeraVe)."
                />
                <input
                  id="newBrandName"
                  type="text"
                  required
                  placeholder="مثال: Bioderma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="الرابط الدائم (Slug)"
                  htmlFor="newBrandSlug"
                  badge="إنجليزي"
                  helpText="المعرف الإنجليزي الفريد في رابط صفحة العلامة التجارية (مثال: bioderma)."
                />
                <input
                  id="newBrandSlug"
                  type="text"
                  dir="ltr"
                  placeholder="bioderma"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="بلد المنشأ والمقر"
                  htmlFor="newBrandCountry"
                  required
                  helpText="الدولة المصنعة أو مقر المخبر الأصلي (مثال: فرنسا، إسبانيا، ألمانيا، الجزائر)."
                />
                <input
                  id="newBrandCountry"
                  type="text"
                  required
                  placeholder="مثال: فرنسا (France)"
                  value={countryOfOrigin}
                  onChange={(e) => setCountryOfOrigin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="نبذة عن العلامة التجارية"
                  htmlFor="newBrandDesc"
                  helpText="فقرة توضيحية عن تاريخ الماركة وفلسفتها الطبية والصحية المعروضة في صفحة العلامة."
                />
                <textarea
                  id="newBrandDesc"
                  rows={2}
                  placeholder="مخبر متخصص في إنتاج مستحضرات العناية بالبشرة الحساسة..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  إضافة العلامة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
