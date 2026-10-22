'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Plus,
  Link2,
  CheckCircle2,
  Eye,
  Trash2,
  RefreshCw,
  Power,
  Layers,
  ArrowUpDown,
  Tag,
  AlertCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { FormLabelWithHelp } from '@/components/ui';
import { R2ImageUploader } from '@/components/admin/R2ImageUploader';

interface AdminBanner {
  _id: string;
  title: string;
  titleFr?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleFr?: string;
  subtitleEn?: string;
  badgeText?: string;
  badgeTextFr?: string;
  badgeTextEn?: string;
  imageUrlDesktop: string;
  imageUrlMobile?: string;
  linkUrl: string;
  buttonText?: string;
  buttonTextFr?: string;
  buttonTextEn?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New banner form state
  const [title, setTitle] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleFr, setSubtitleFr] = useState('');
  const [subtitleEn, setSubtitleEn] = useState('');
  const [badgeText, setBadgeText] = useState('عرض حصري');
  const [badgeTextFr, setBadgeTextFr] = useState('');
  const [badgeTextEn, setBadgeTextEn] = useState('');
  const [imageUrlDesktop, setImageUrlDesktop] = useState(
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=85'
  );
  const [imageUrlMobile, setImageUrlMobile] = useState('');
  const [linkUrl, setLinkUrl] = useState('/category/skincare');
  const [buttonText, setButtonText] = useState('اكتشف الآن');
  const [buttonTextFr, setButtonTextFr] = useState('');
  const [buttonTextEn, setButtonTextEn] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [isActive, setIsActive] = useState(true);
  const [showOptionalLangs, setShowOptionalLangs] = useState(false);

  // Fetch banners from database
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      } else {
        throw new Error(data.message || 'فشل في جلب اللافتات');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'تعذر الاتصال بالخادم لجلب اللافتات' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Handle Add Banner
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrlDesktop.trim() || !linkUrl.trim()) {
      setFeedback({ type: 'error', message: 'يرجى ملء جميع الحقول الإلزامية بالعربية' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          titleFr: titleFr.trim(),
          titleEn: titleEn.trim(),
          subtitle: subtitle.trim(),
          subtitleFr: subtitleFr.trim(),
          subtitleEn: subtitleEn.trim(),
          badgeText: badgeText.trim(),
          badgeTextFr: badgeTextFr.trim(),
          badgeTextEn: badgeTextEn.trim(),
          imageUrlDesktop: imageUrlDesktop.trim(),
          imageUrlMobile: imageUrlMobile.trim() || imageUrlDesktop.trim(),
          linkUrl: linkUrl.trim(),
          buttonText: buttonText.trim(),
          buttonTextFr: buttonTextFr.trim(),
          buttonTextEn: buttonTextEn.trim(),
          sortOrder: Number(sortOrder) || 1,
          isActive,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'تم حفظ ونشر اللافتة بنجاح، تظهر الآن في واجهة المتجر!' });
        setIsAddModalOpen(false);
        // Reset form
        setTitle('');
        setTitleFr('');
        setTitleEn('');
        setSubtitle('');
        setSubtitleFr('');
        setSubtitleEn('');
        setBadgeText('عرض حصري');
        setBadgeTextFr('');
        setBadgeTextEn('');
        setImageUrlDesktop('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=85');
        setImageUrlMobile('');
        setLinkUrl('/category/skincare');
        setButtonText('اكتشف الآن');
        setButtonTextFr('');
        setButtonTextEn('');
        setSortOrder(banners.length + 1);
        setShowOptionalLangs(false);
        fetchBanners();
      } else {
        throw new Error(data.message || 'فشل في حفظ اللافتة');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'حدث خطأ أثناء حفظ اللافتة' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Active
  const handleToggleActive = async (banner: AdminBanner) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner._id, action: 'toggle-active' }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) =>
          prev.map((b) => (b._id === banner._id ? { ...b, isActive: !b.isActive } : b))
        );
        setFeedback({
          type: 'success',
          message: !banner.isActive ? 'تم تفعيل اللافتة للظهور في الصفحة الأولى' : 'تم إخفاء اللافتة من واجهة المتجر',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل تغيير حالة اللافتة' });
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string, bannerTitle: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف لافتة: "${bannerTitle}"؟`)) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        setFeedback({ type: 'success', message: 'تم حذف اللافتة بنجاح' });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'فشل في حذف اللافتة' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold shadow-md transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            إغلاق
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
            <span className="text-slate-800 font-semibold">إدارة اللافتات الإعلانية (Hero Banners)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-brand-deep" />
            شريط اللافتات الإعلانية ({banners.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة الصور المنزلقة الرئيسية (Hero Carousel) في الصفحة الأولى للمتجر، مع ربط مباشر بقاعدة البيانات.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={fetchBanners}
            disabled={isLoading}
            className="p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-teal' : ''}`} />
          </button>

          <button
            onClick={() => {
              setSortOrder(banners.length + 1);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة لافتة جديدة</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && banners.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <RefreshCw className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">جارٍ جلب اللافتات من قاعدة البيانات...</p>
        </div>
      )}

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((ban) => (
          <div
            key={ban._id}
            className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
              ban.isActive ? 'border-slate-200/80' : 'border-slate-200/40 opacity-70 bg-slate-50/50'
            }`}
          >
            {/* Banner Thumbnail & Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              {/* Thumbnail with Order Badge */}
              <div className="relative w-full sm:w-48 h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shrink-0 group">
                <img
                  src={ban.imageUrlDesktop}
                  alt={ban.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[11px] font-black px-2 py-0.5 rounded-lg border border-white/20">
                  ترتيب #{ban.sortOrder}
                </div>
                {ban.imageUrlMobile && (
                  <div className="absolute bottom-2 left-2 bg-brand-deep/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-brand-lime" />
                    <span>موبايل مخصص</span>
                  </div>
                )}
              </div>

              {/* Title & Details */}
              <div className="space-y-1.5 flex-1 text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-teal-50 text-brand-teal border border-teal-200/60 inline-flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{ban.badgeText || 'عرض حصري'}</span>
                  </span>

                  <h3 className="font-black text-base text-slate-900">{ban.title}</h3>

                  {ban.isActive ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      نشطة وظاهرة
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      معطلة ومخفية
                    </span>
                  )}
                </div>

                {ban.subtitle && <p className="text-xs text-slate-500 line-clamp-2">{ban.subtitle}</p>}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                    <Link2 className="w-3 h-3 text-brand-teal" />
                    <span>{ban.linkUrl}</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    زر الإجراء: <span className="text-slate-800 font-black">"{ban.buttonText || 'اكتشف الآن'}"</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 self-end lg:self-center pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
              <Link
                href={ban.linkUrl}
                target="_blank"
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 inline-flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>معاينة الرابط</span>
              </Link>

              <button
                type="button"
                onClick={() => handleToggleActive(ban)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  ban.isActive
                    ? 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{ban.isActive ? 'إخفاء' : 'تفعيل'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteBanner(ban._id, ban.title)}
                className="p-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                title="حذف اللافتة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Banner Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-teal" />
                <span>إضافة لافتة إعلانية جديدة للسلايدر</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto pl-1 pr-1 space-y-4">
              <div>
                <FormLabelWithHelp
                  label="عنوان اللافتة الرئيسي (Headline)"
                  htmlFor="bannerTitleInput"
                  required
                  helpText="النص الكبير والبارز الذي يظهر في مقدمة الشريحة لجذب انتباه المتسوقين."
                />
                <input
                  id="bannerTitleInput"
                  type="text"
                  required
                  placeholder="مثال: عناية متكاملة وترطيب عميق مع أرقى الماركات"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="النص الفرعي / الوصف التشويقي"
                  htmlFor="bannerSubtitleInput"
                  helpText="نص تفصيلي تحت العنوان يوضح نسبة التخفيض، المزايا، أو أسماء المنتجات المشمولة."
                />
                <textarea
                  id="bannerSubtitleInput"
                  rows={2}
                  placeholder="مثال: خصم حتى 30% على منتجات حماية البشرة مع توصيل سريع لكافة الـ 69 ولاية"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="نص الشارة العلوية (Badge)"
                    htmlFor="bannerBadgeInput"
                    helpText="الكلمة الترويجية التي تظهر داخل الكبسولة اللامعة أعلى العنوان (مثال: تخفيضات موسمية حصرية أو الأكثر مبيعاً)."
                  />
                  <input
                    id="bannerBadgeInput"
                    type="text"
                    placeholder="عرض حصري"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="نص زر الإجراء (Button CTA)"
                    htmlFor="bannerButtonTextInput"
                    helpText="النص المكتوب على زر التحويل (مثال: اكتشف الآن أو تسوق العروض)."
                  />
                  <input
                    id="bannerButtonTextInput"
                    type="text"
                    placeholder="اكتشف الآن"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>
              </div>

              {/* Optional Multilingual Translations Section */}
              <div className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/60 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowOptionalLangs(!showOptionalLangs)}
                  className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-brand-deep cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>🌐</span>
                    <span>الترجمات الاختيارية (فرنسية / إنجليزية)</span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium">اختياري</span>
                  </span>
                  <span className="text-brand-teal text-xs font-bold">{showOptionalLangs ? 'إخفاء' : 'عرض وإدخال'}</span>
                </button>

                {showOptionalLangs && (
                  <div className="pt-3 border-t border-slate-200/70 space-y-4">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      💡 ملاحظة: العربية فقط هي الإجبارية. في حال ترك أي حقل فرنسي أو إنجليزي فارغاً، فسيتم تلقائياً اعتماد النص العربي المقابل عند تغيير لغة المتجر.
                    </p>

                    {/* French Fields */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-3">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <span>🇫🇷</span>
                        <span>النسخة الفرنسية (Optionnel en Français)</span>
                      </span>
                      <div>
                        <FormLabelWithHelp
                          label="العنوان بالفرنسية (Titre)"
                          htmlFor="bannerTitleFr"
                          badge="اختياري"
                          helpText="إذا تُرك فارغاً فسيتم إظهار العنوان العربي عند اختيار اللغة الفرنسية."
                        />
                        <input
                          id="bannerTitleFr"
                          type="text"
                          dir="ltr"
                          placeholder="Ex: Soins Complets et Hydratation..."
                          value={titleFr}
                          onChange={(e) => setTitleFr(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <FormLabelWithHelp
                          label="الوصف بالفرنسية (Sous-titre)"
                          htmlFor="bannerSubtitleFr"
                          badge="اختياري"
                          helpText="نص تفصيلي تحت العنوان باللغة الفرنسية."
                        />
                        <input
                          id="bannerSubtitleFr"
                          type="text"
                          dir="ltr"
                          placeholder="Ex: Jusqu'à 30% de remise sur les soins solaires..."
                          value={subtitleFr}
                          onChange={(e) => setSubtitleFr(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormLabelWithHelp
                            label="الشارة (Badge FR)"
                            htmlFor="bannerBadgeFr"
                            badge="اختياري"
                            helpText="نص الشارة العلوية بالفرنسية."
                          />
                          <input
                            id="bannerBadgeFr"
                            type="text"
                            dir="ltr"
                            placeholder="Offre Exclusive"
                            value={badgeTextFr}
                            onChange={(e) => setBadgeTextFr(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <FormLabelWithHelp
                            label="زر الإجراء (Bouton FR)"
                            htmlFor="bannerButtonFr"
                            badge="اختياري"
                            helpText="نص زر الإجراء بالفرنسية."
                          />
                          <input
                            id="bannerButtonFr"
                            type="text"
                            dir="ltr"
                            placeholder="Découvrir"
                            value={buttonTextFr}
                            onChange={(e) => setButtonTextFr(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* English Fields */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/60 space-y-3">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <span>🇬🇧</span>
                        <span>النسخة الإنجليزية (Optional in English)</span>
                      </span>
                      <div>
                        <FormLabelWithHelp
                          label="العنوان بالإنجليزية (Title)"
                          htmlFor="bannerTitleEn"
                          badge="اختياري"
                          helpText="إذا تُرك فارغاً فسيتم إظهار العنوان العربي عند اختيار اللغة الإنجليزية."
                        />
                        <input
                          id="bannerTitleEn"
                          type="text"
                          dir="ltr"
                          placeholder="Ex: Complete Care and Deep Hydration..."
                          value={titleEn}
                          onChange={(e) => setTitleEn(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <FormLabelWithHelp
                          label="الوصف بالإنجليزية (Subtitle)"
                          htmlFor="bannerSubtitleEn"
                          badge="اختياري"
                          helpText="نص تفصيلي تحت العنوان باللغة الإنجليزية."
                        />
                        <input
                          id="bannerSubtitleEn"
                          type="text"
                          dir="ltr"
                          placeholder="Ex: Up to 30% off on premium skincare..."
                          value={subtitleEn}
                          onChange={(e) => setSubtitleEn(e.target.value)}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <FormLabelWithHelp
                            label="الشارة (Badge EN)"
                            htmlFor="bannerBadgeEn"
                            badge="اختياري"
                            helpText="نص الشارة العلوية بالإنجليزية."
                          />
                          <input
                            id="bannerBadgeEn"
                            type="text"
                            dir="ltr"
                            placeholder="Exclusive Offer"
                            value={badgeTextEn}
                            onChange={(e) => setBadgeTextEn(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs"
                          />
                        </div>
                        <div>
                          <FormLabelWithHelp
                            label="زر الإجراء (Button EN)"
                            htmlFor="bannerButtonEn"
                            badge="اختياري"
                            helpText="نص زر الإجراء بالإنجليزية."
                          />
                          <input
                            id="bannerButtonEn"
                            type="text"
                            dir="ltr"
                            placeholder="Discover Now"
                            value={buttonTextEn}
                            onChange={(e) => setButtonTextEn(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <FormLabelWithHelp
                  label="صورة شاشات الحواسيب وسطح المكتب (Desktop Banner)"
                  required
                  badge="R2 Pre-signed"
                  helpText="صورة عريضة عالية الجودة (يفضل أبعاد 1920x600 بكسل أو 1600x600 بكسل) تظهر للمتصفحين من الحاسوب والتابلت."
                />
                <R2ImageUploader
                  currentImageUrl={imageUrlDesktop}
                  onUploaded={(url) => setImageUrlDesktop(url)}
                  folder="banners"
                  label={title || 'صورة الديسكتوب'}
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="صورة مخصصة للهواتف (Mobile Banner - اختياري)"
                  helpText="إذا تركت هذا الحقل فارغاً فسيتم تلقائياً استخدام صورة سطح المكتب."
                />
                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://... رابط صورة متناسبة مع شاشات الهواتف الرأسية"
                  value={imageUrlMobile}
                  onChange={(e) => setImageUrlMobile(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="رابط التوجيه (Target Link)"
                    htmlFor="bannerLinkInput"
                    required
                    helpText="المسار الذي ينتقل إليه المتسوق فور الضغط على اللافتة (مثال: /category/skincare أو /products أو /offers)."
                  />
                  <input
                    id="bannerLinkInput"
                    type="text"
                    required
                    dir="ltr"
                    placeholder="/category/skincare"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="ترتيب العرض بالسلايدر (Sort Order)"
                    htmlFor="bannerOrderInput"
                    required
                    helpText="رقم ترتيب الشريحة في السلايدر (1 يظهر أولاً، 2 ثانياً، وهكذا)."
                  />
                  <input
                    id="bannerOrderInput"
                    type="number"
                    min={1}
                    required
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>
              </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep to-brand-teal text-white font-bold text-xs shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'جارٍ النشر...' : 'حفظ ونشر اللافتة في الموقع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
