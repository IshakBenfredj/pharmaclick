'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Tag,
  DollarSign,
  Layers,
  Award,
  Image as ImageIcon,
  FileText,
  ShieldAlert,
  Hash,
} from 'lucide-react';
import { FormLabelWithHelp } from '@/components/ui';
import { R2ImageUploader } from '@/components/admin/R2ImageUploader';
import { MOCK_CATEGORIES, MOCK_BRANDS } from '@/lib/data/mockData';

export default function AdminNewProductPage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(MOCK_CATEGORIES[0]?.nameAr || 'العناية بالبشرة');
  const [categorySlug, setCategorySlug] = useState(MOCK_CATEGORIES[0]?.slug || 'skincare');
  const [brand, setBrand] = useState(MOCK_BRANDS[0]?.name || 'La Roche-Posay');
  const [price, setPrice] = useState<number>(3800);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(25);
  const [sizeOrVolume, setSizeOrVolume] = useState('30 مل');
  const [imageUrl, setImageUrl] = useState('/products/hyalu-b5.png');
  const [summary, setSummary] = useState('');
  const [shortDescriptionFr, setShortDescriptionFr] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionFr, setDescriptionFr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [usageInstructions, setUsageInstructions] = useState(
    'يوضع من 3 إلى 4 قطرات صباحاً ومساءً على بشرة نظيفة وجافة للوجه والرقبة مع التدليك اللطيف.'
  );
  const [usageInstructionsFr, setUsageInstructionsFr] = useState('');
  const [usageInstructionsEn, setUsageInstructionsEn] = useState('');
  const [healthWarnings, setHealthWarnings] = useState('للاستعمال الخارجي فقط. تجنب ملامسة محيط العينين.');
  const [healthWarningsFr, setHealthWarningsFr] = useState('');
  const [healthWarningsEn, setHealthWarningsEn] = useState('');
  const [inStock, setInStock] = useState(true);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Auto-generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      const generated = val
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      if (generated) setSlug(generated);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    const catObj = MOCK_CATEGORIES.find((c) => c.slug === selectedSlug);
    if (catObj) {
      setCategorySlug(catObj.slug);
      setCategory(catObj.nameAr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Basic validation
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'يرجى إدخال اسم المستحضر التجاري' });
      setIsSubmitting(false);
      return;
    }

    if (!price || price <= 0) {
      setFeedback({ type: 'error', message: 'يرجى إدخال سعر صالح أكبر من الصفر' });
      setIsSubmitting(false);
      return;
    }

    try {
      // POST to backend API
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          nameAr: name.trim(),
          nameFr: nameFr.trim() || undefined,
          nameEn: nameEn.trim() || undefined,
          slug: slug.trim(),
          category,
          categorySlug,
          brand,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          stockQuantity: Number(stockQuantity) || 0,
          sizeOrVolume: sizeOrVolume.trim(),
          imageUrl: imageUrl.trim() || '/products/hyalu-b5.png',
          summary: summary.trim(),
          shortDescriptionFr: shortDescriptionFr.trim() || undefined,
          shortDescriptionEn: shortDescriptionEn.trim() || undefined,
          description: description.trim(),
          descriptionFr: descriptionFr.trim() || undefined,
          descriptionEn: descriptionEn.trim() || undefined,
          usageInstructions: usageInstructions.trim() || undefined,
          usageInstructionsFr: usageInstructionsFr.trim() || undefined,
          usageInstructionsEn: usageInstructionsEn.trim() || undefined,
          healthWarnings: healthWarnings.trim() || undefined,
          healthWarningsFr: healthWarningsFr.trim() || undefined,
          healthWarningsEn: healthWarningsEn.trim() || undefined,
          inStock: Boolean(inStock),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'فشل في حفظ المستحضر في قاعدة البيانات');
      }

      setFeedback({
        type: 'success',
        message: 'تم إضافة المستحضر وتثبيته بنجاح في قاعدة بيانات المتجر!',
      });

      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'حدث خطأ أثناء حفظ المستحضر',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin" className="hover:text-brand-deep transition-colors">
              لوحة التحكم
            </Link>
            <span>/</span>
            <Link href="/admin/products" className="hover:text-brand-deep transition-colors">
              المستحضرات والمنتجات
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">إضافة مستحضر جديد</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-deep text-white flex items-center justify-center shadow-md shadow-brand-deep/20">
              <Package className="w-5 h-5" />
            </div>
            إضافة مستحضر جديد للمتجر
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            املأ بيانات ومواصفات المستحضر مع إمكانية رفع الصور مباشرة عبر Cloudflare R2 Pre-signed URLs.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للقائمة</span>
        </Link>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 font-medium">{feedback.message}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Basic Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-teal" />
            المعلومات الأساسية والهوية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field 1: Product Name (Arabic - Mandatory) */}
            <div>
              <FormLabelWithHelp
                label="اسم المستحضر التجاري (بالعربية)"
                htmlFor="productNameInput"
                required
                badge="إجباري"
                helpText="الاسم التجاري الكامل المعتمد للمستحضر بدقة كما هو مدون على العبوة الأصلية بالعربية. هو الحقل الأساسي والإجباري دائماً."
              />
              <input
                id="productNameInput"
                type="text"
                required
                placeholder="مثال: سيروم فيتامين سي النقي C10"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              />
            </div>

            {/* Field 1-B: Product Name (French - Optional) */}
            <div>
              <FormLabelWithHelp
                label="اسم المستحضر بالفرنسية (Nom)"
                htmlFor="productNameFrInput"
                badge="اختياري - FR"
                helpText="اسم المستحضر باللغة الفرنسية (اختياري). إذا تركته فارغاً سيتم اعتماد الاسم العربي تلقائياً عند تصفح المتجر باللغة الفرنسية."
              />
              <input
                id="productNameFrInput"
                type="text"
                dir="ltr"
                placeholder="Ex: Sérum Pur Vitamine C10"
                value={nameFr}
                onChange={(e) => setNameFr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              />
            </div>

            {/* Field 1-C: Product Name (English - Optional) */}
            <div>
              <FormLabelWithHelp
                label="اسم المستحضر بالإنجليزية (Name)"
                htmlFor="productNameEnInput"
                badge="اختياري - EN"
                helpText="اسم المستحضر باللغة الإنجليزية (اختياري). إذا تركته فارغاً سيتم اعتماد الاسم العربي تلقائياً عند تصفح المتجر باللغة الإنجليزية."
              />
              <input
                id="productNameEnInput"
                type="text"
                dir="ltr"
                placeholder="Ex: Pure Vitamin C10 Serum"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              />
            </div>

            {/* Field 2: Slug */}
            <div>
              <FormLabelWithHelp
                label="الرابط الدائم للمنتج (Slug)"
                htmlFor="productSlugInput"
                required
                badge="إنجليزي"
                helpText="المعرف الإنجليزي الفريد في رابط صفحة المستحضر (مثال: pure-vitamin-c-serum). يستخدم لروابط SEO والمشاركة."
              />
              <div className="relative">
                <input
                  id="productSlugInput"
                  type="text"
                  required
                  dir="ltr"
                  placeholder="pure-vitamin-c-serum"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-mono"
                />
              </div>
            </div>

            {/* Field 3: Category */}
            <div>
              <FormLabelWithHelp
                label="القسم والتصنيف الرئيسي"
                htmlFor="productCategorySelect"
                required
                helpText="التصنيف الأساسي للمستحضر داخل المتجر، مما يسهل على الزبائن استكشافه والفلترة عبر الأقسام."
              />
              <select
                id="productCategorySelect"
                value={categorySlug}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              >
                {MOCK_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nameAr} ({c.nameFr})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Brand */}
            <div>
              <FormLabelWithHelp
                label="العلامة التجارية / الماركة"
                htmlFor="productBrandSelect"
                required
                helpText="الماركة أو المخبر المصنع للمستحضر لربطه بصفحة العلامة التجارية وشعارها وبلد المنشأ."
              />
              <select
                id="productBrandSelect"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              >
                {MOCK_BRANDS.map((b) => (
                  <option key={b.slug} value={b.name}>
                    {b.name} - {b.countryOfOrigin}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Pricing & Inventory */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-green" />
            التسعير، التخفيض، والمخزون
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Field 5: Price */}
            <div>
              <FormLabelWithHelp
                label="السعر الأساسي المعتمد"
                htmlFor="productPriceInput"
                required
                helpText="سعر البيع الفعلي المعتمد بالدينار الجزائري (دج) الذي يدفعه الزبون قبل أي خصم أو تخفيض."
              />
              <div className="relative">
                <input
                  id="productPriceInput"
                  type="number"
                  required
                  min={100}
                  step={50}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-extrabold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  دج
                </span>
              </div>
            </div>

            {/* Field 6: Original Price (Discount) */}
            <div>
              <FormLabelWithHelp
                label="السعر قبل الخصم (اختياري)"
                htmlFor="productOriginalPriceInput"
                badge="تخفيض"
                helpText="إذا كان المستحضر في فترة عرض ترويجي، أدخل السعر القديم هنا ليظهر مشطوباً وتُحسب نسبة الخصم تلقائياً."
              />
              <div className="relative">
                <input
                  id="productOriginalPriceInput"
                  type="number"
                  min={price}
                  placeholder="مثال: 4500"
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  className="w-full px-4 py-2.5 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-extrabold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                  دج
                </span>
              </div>
            </div>

            {/* Field 7: Stock Quantity */}
            <div>
              <FormLabelWithHelp
                label="الكمية المتوفرة بالمخزون"
                htmlFor="productStockInput"
                required
                helpText="العدد الفعلي المتاح حالياً من المستحضر. عند وصول الكمية إلى 0 يُقفل زر الطلب تلقائياً لحماية المبيعات."
              />
              <input
                id="productStockInput"
                type="number"
                min={0}
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-extrabold"
              />
            </div>

            {/* Field 8: Size or Volume */}
            <div>
              <FormLabelWithHelp
                label="السعة أو الحجم"
                htmlFor="productSizeInput"
                helpText="حجم العبوة أو وزنها (مثال: 30 مل، 50 جم، 60 كبسولة) لتوضيح المواصفات بدقة للزبون في بطاقة العرض."
              />
              <input
                id="productSizeInput"
                type="text"
                placeholder="مثال: 50 مل"
                value={sizeOrVolume}
                onChange={(e) => setSizeOrVolume(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Cloudflare R2 Media & Descriptions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            الصورة والشروحات والمواصفات (Cloudflare R2 Presigned URLs)
          </h2>

          <div className="space-y-5">
            {/* Field 9: Cloudflare R2 Image Uploader */}
            <div>
              <FormLabelWithHelp
                label="الصورة الرئيسية للمستحضر (Cloudflare R2)"
                required
                badge="R2 Pre-signed"
                helpText="ارفع صورة المنتج مباشرة إلى Cloudflare R2 عبر روابط الرفع المسبقة الآمنة (Presigned URLs)، أو أدخل رابطاً مباشراً."
              />
              <R2ImageUploader
                currentImageUrl={imageUrl}
                onUploaded={(url) => setImageUrl(url)}
                folder="products"
                label={name || 'صورة المستحضر'}
              />
            </div>

            {/* Field 10: Summary (Arabic - Mandatory) */}
            <div>
              <FormLabelWithHelp
                label="الوصف التسويقي المختصر (بالعربية)"
                htmlFor="productSummaryInput"
                badge="عربي"
                helpText="نبذة سريعة وجذابة من سطرين تلخص أهم فوائد المستحضر بالعربية وتظهر أسفل الاسم مباشرة في بطاقة المنتج."
              />
              <textarea
                id="productSummaryInput"
                rows={2}
                placeholder="سيروم مركز مخصص لإعادة الامتلاء وترطيب البشرة بعمق وتقليل التجاعيد الدقيقة..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
              />
            </div>

            {/* Optional Summaries in FR and EN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabelWithHelp
                  label="الوصف المختصر بالفرنسية (Résumé)"
                  htmlFor="productSummaryFrInput"
                  badge="اختياري - FR"
                  helpText="ملخص قصير بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                />
                <textarea
                  id="productSummaryFrInput"
                  rows={2}
                  dir="ltr"
                  placeholder="Ex: Sérum rénovateur d'éclat hautement concentré..."
                  value={shortDescriptionFr}
                  onChange={(e) => setShortDescriptionFr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div>
                <FormLabelWithHelp
                  label="الوصف المختصر بالإنجليزية (Summary)"
                  htmlFor="productSummaryEnInput"
                  badge="اختياري - EN"
                  helpText="ملخص قصير بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                />
                <textarea
                  id="productSummaryEnInput"
                  rows={2}
                  dir="ltr"
                  placeholder="Ex: Concentrated serum formulated to enhance skin radiance..."
                  value={shortDescriptionEn}
                  onChange={(e) => setShortDescriptionEn(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>
            </div>

            {/* Tab 3: Detailed Specifications & Composition */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-500/10 text-brand-teal flex items-center justify-center font-black text-xs">
                  3
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    تبويب: المواصفات والتركيبة (Specifications & Composition)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    الشرح التفصيلي للتركيبة والمواد الفعالة للمستحضر.
                  </p>
                </div>
              </div>

              <div>
                <FormLabelWithHelp
                  label="المواصفات والتركيبة (بالعربية)"
                  htmlFor="productDescriptionInput"
                  required
                  badge="إجباري"
                  helpText="شرح شامل ومفصل لتركيبة المستحضر، طريقة عمل مواده الفعالة، والنتائج السريرية المتوقعة منه بالعربية."
                />
                <textarea
                  id="productDescriptionInput"
                  rows={4}
                  required
                  placeholder="يجمع هذا المستحضر بين حمض الهيالورونيك النقي ثنائي الجزيئات مع فيتامين B5 لترميم حاجز البشرة الواقي..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="المواصفات والتركيبة بالفرنسية (Composition)"
                    htmlFor="productDescriptionFrInput"
                    badge="اختياري - FR"
                    helpText="شرح التركيبة بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productDescriptionFrInput"
                    rows={3}
                    dir="ltr"
                    placeholder="Ex: Formule dermatologique enrichie en acide hyaluronique pur..."
                    value={descriptionFr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="المواصفات والتركيبة بالإنجليزية (Composition)"
                    htmlFor="productDescriptionEnInput"
                    badge="اختياري - EN"
                    helpText="شرح التركيبة بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productDescriptionEnInput"
                    rows={3}
                    dir="ltr"
                    placeholder="Ex: Advanced dermatological formula enriched with pure hyaluronic acid..."
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Tab 1: Usage Instructions */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-brand-green flex items-center justify-center font-black text-xs">
                  1
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    تبويب: طريقة وإرشادات الاستخدام (Usage Instructions)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    كيفية وتوقيت تطبيق المستحضر للحصول على أفضل نتيجة صحية وجمالية.
                  </p>
                </div>
              </div>

              <div>
                <FormLabelWithHelp
                  label="طريقة وإرشادات الاستخدام (بالعربية)"
                  htmlFor="productUsageInstructionsInput"
                  required
                  badge="إجباري"
                  helpText="تعليمات الاستعمال الآمن بالتفصيل (مثل: عدد القطرات، الوقت المناسب صباحاً أو مساءً، طريقة التدليك)."
                />
                <textarea
                  id="productUsageInstructionsInput"
                  rows={3}
                  required
                  placeholder="يوضع من 3 إلى 4 قطرات صباحاً ومساءً على بشرة نظيفة وجافة للوجه والرقبة مع التدليك اللطيف..."
                  value={usageInstructions}
                  onChange={(e) => setUsageInstructions(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="طريقة الاستخدام بالفرنسية (Conseils d'utilisation)"
                    htmlFor="productUsageFrInput"
                    badge="اختياري - FR"
                    helpText="تعليمات الاستخدام بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productUsageFrInput"
                    rows={2}
                    dir="ltr"
                    placeholder="Ex: Appliquer 3 à 4 gouttes matin et soir sur le visage et le cou..."
                    value={usageInstructionsFr}
                    onChange={(e) => setUsageInstructionsFr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="طريقة الاستخدام بالإنجليزية (Usage Directions)"
                    htmlFor="productUsageEnInput"
                    badge="اختياري - EN"
                    helpText="تعليمات الاستخدام بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productUsageEnInput"
                    rows={2}
                    dir="ltr"
                    placeholder="Ex: Apply 3 to 4 drops morning and evening on clean and dry face and neck..."
                    value={usageInstructionsEn}
                    onChange={(e) => setUsageInstructionsEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Tab 2: Health Warnings & Contraindications */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-xs">
                  2
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    تبويب: التحذيرات وموانع الاستعمال (Warnings & Precautions)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    التحذيرات الطبية والصحية (للاستعمال الخارجي فقط، تجنب العينين، الحفظ بعيداً عن الأطفال).
                  </p>
                </div>
              </div>

              <div>
                <FormLabelWithHelp
                  label="التحذيرات وموانع الاستعمال (بالعربية)"
                  htmlFor="productWarningsInput"
                  required
                  badge="إجباري"
                  helpText="التنبيهات الصحية الهامة التي تظهر داخل المربع الأصفر التحذيري بصفحة المنتج (مثال: للاستعمال الخارجي فقط. في حال حدوث تهيج يرجى التوقف عن الاستخدام)."
                />
                <textarea
                  id="productWarningsInput"
                  rows={2}
                  required
                  placeholder="للاستعمال الخارجي فقط. تجنب ملامسة محيط العينين. يحفظ بعيداً عن متناول الأطفال."
                  value={healthWarnings}
                  onChange={(e) => setHealthWarnings(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="التحذيرات بالفرنسية (Précautions & Avertissements)"
                    htmlFor="productWarningsFrInput"
                    badge="اختياري - FR"
                    helpText="التحذيرات بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productWarningsFrInput"
                    rows={2}
                    dir="ltr"
                    placeholder="Ex: Usage externe uniquement. Éviter le contact direct avec les yeux."
                    value={healthWarningsFr}
                    onChange={(e) => setHealthWarningsFr(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="التحذيرات بالإنجليزية (Warnings & Precautions)"
                    htmlFor="productWarningsEnInput"
                    badge="اختياري - EN"
                    helpText="التحذيرات بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <textarea
                    id="productWarningsEnInput"
                    rows={2}
                    dir="ltr"
                    placeholder="Ex: For external use only. Avoid contact with eyes. Keep out of reach of children."
                    value={healthWarningsEn}
                    onChange={(e) => setHealthWarningsEn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Publication Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <FormLabelWithHelp
              label="إتاحة المستحضر للبيع أونلاين"
              helpText="عند التفعيل، يظهر المستحضر في متجر PharmaClick فوراً ويكون قابلاً للطلب والشحن لكافة الـ 69 ولاية جزائرية."
              badge={inStock ? 'نشط' : 'معطل'}
            />
            <p className="text-xs text-slate-500">
              يمكنك تعطيل المستحضر مؤقتاً في حال رغبت بإيقاف بيعه دون حذفه من قاعدة البيانات.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setInStock(!inStock)}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-teal ${
              inStock ? 'bg-brand-green' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={inStock}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                inStock ? '-translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            إلغاء
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-lg shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>جاري الحفظ في قاعدة البيانات...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ ونشر المستحضر في المتجر</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
