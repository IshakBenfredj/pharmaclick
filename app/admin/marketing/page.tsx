'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sliders,
  Plus,
  Tag,
  CheckCircle2,
  Package,
  Layers,
  Search,
  X,
  Edit,
  Trash2,
  Check,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  Flame,
  Zap,
  Palette,
  Eye,
  Settings,
} from 'lucide-react';
import { FormLabelWithHelp } from '@/components/ui';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MockProduct } from '@/lib/data/mockData';

export type SelectionType = 'manual' | 'dynamic';
export type DynamicCriteria = 'on_sale' | 'featured' | 'best_sellers' | 'most_viewed' | 'by_category';

export interface MarketingSectionItem {
  id: string;
  title: string;
  titleFr?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleFr?: string;
  subtitleEn?: string;
  emoji?: string;
  badge: string;
  badgeTextFr?: string;
  badgeTextEn?: string;
  selectionType: SelectionType;
  dynamicCriteria?: DynamicCriteria;
  targetCategory?: string | null;
  limit?: number;
  backgroundColor?: string;
  productIds: string[];
  resolvedProducts?: any[];
  order: number;
  isActive: boolean;
}

const EMOJI_OPTIONS = ['🏷️', '💎', '🔥', '🌿', '💧', '🧴', '🌸', '⭐', '🎯', '👑', '🧼'];

const DYNAMIC_CRITERIA_OPTIONS: { id: DynamicCriteria; label: string; desc: string }[] = [
  { id: 'on_sale', label: 'تخفيضات كبرى وعروض حصرية', desc: 'استعلام تلقائي للمستحضرات التي تحتوي على نسبة خصم (Discount > 0%)' },
  { id: 'best_sellers', label: 'الأكثر مبيعاً وطلباً', desc: 'استعلام تلقائي للمستحضرات الأكثر شراءً وطلباً في المتجر' },
  { id: 'featured', label: 'مستحضرات مميزة وموصى بها', desc: 'استعلام تلقائي للمستحضرات التي تم تعيينها كـ Featured' },
  { id: 'most_viewed', label: 'الأكثر تصفحاً ومشاهدة', desc: 'استعلام تلقائي للمستحضرات الأعلى زيارة ومشاهدة' },
  { id: 'by_category', label: 'حسب تصنيف وقسم محدد', desc: 'استعلام تلقائي لكافة مستحضرات قسم معين تختاره أدناه' },
];

const BACKGROUND_OPTIONS = [
  { id: '', label: 'أبيض كلاسيكي نقي', preview: 'bg-white border-slate-200' },
  { id: 'bg-gradient-to-r from-teal-50 via-emerald-50/40 to-white', label: 'تدرج تركوازي وزمردي هادئ', preview: 'bg-gradient-to-r from-teal-50 to-emerald-50 border-teal-200' },
  { id: 'bg-gradient-to-r from-slate-50 to-slate-100', label: 'رمادي عصري ناعم', preview: 'bg-slate-100 border-slate-300' },
  { id: 'bg-gradient-to-r from-brand-deep/5 via-brand-teal/5 to-transparent', label: 'هوية المتجر الخضراء الفاخرة', preview: 'bg-brand-deep/10 border-brand-teal/30' },
];

export default function AdminMarketingPage() {
  const [sections, setSections] = useState<MarketingSectionItem[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<MockProduct[]>(MOCK_PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<any[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Modal 1: Add New Section Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTitleFr, setNewTitleFr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newSubtitleFr, setNewSubtitleFr] = useState('');
  const [newSubtitleEn, setNewSubtitleEn] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏷️');
  const [newBadge, setNewBadge] = useState('جديد');
  const [newBadgeFr, setNewBadgeFr] = useState('');
  const [newBadgeEn, setNewBadgeEn] = useState('');
  const [newSelectionType, setNewSelectionType] = useState<SelectionType>('manual');
  const [newDynamicCriteria, setNewDynamicCriteria] = useState<DynamicCriteria>('on_sale');
  const [newTargetCategory, setNewTargetCategory] = useState<string>('all');
  const [newLimit, setNewLimit] = useState<number>(8);
  const [newBackgroundColor, setNewBackgroundColor] = useState<string>('');
  const [newOrder, setNewOrder] = useState<number>(1);
  const [newSelectedProductIds, setNewSelectedProductIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Modal 2: Edit Section Settings
  const [editingSection, setEditingSection] = useState<MarketingSectionItem | null>(null);

  // Modal 3: Product Picker Modal (Search & Multi-select)
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'new_section' | 'editing_section'>('editing_section');
  const [pickerSelectedIds, setPickerSelectedIds] = useState<string[]>([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  // Helper to resolve product objects from array of IDs
  const getProductsByIds = (ids: string[]) => {
    if (!Array.isArray(ids)) return [];
    return ids
      .map((id) => catalogProducts.find((p: any) => p._id === id || p.id === id))
      .filter(Boolean);
  };

  // Helper to resolve readable category name from ID or slug
  const getCategoryName = (catIdOrSlug?: string | null) => {
    if (!catIdOrSlug || catIdOrSlug === 'all') return 'كافة الأقسام';
    for (const c of categoriesList) {
      if (c._id === catIdOrSlug || c.slug === catIdOrSlug || c.id === catIdOrSlug) {
        return c.nameAr || c.name || catIdOrSlug;
      }
      if (Array.isArray(c.subCategories)) {
        for (const sub of c.subCategories) {
          if (sub._id === catIdOrSlug || sub.slug === catIdOrSlug || sub.id === catIdOrSlug) {
            return `${c.nameAr || c.name} > ${sub.nameAr || sub.name}`;
          }
        }
      }
    }
    return catIdOrSlug;
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load sections, products, and categories from backend APIs
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [secRes, prodRes, catRes] = await Promise.all([
        fetch('/api/admin/marketing'),
        fetch('/api/admin/products'),
        fetch('/api/categories?limit=50'),
      ]);

      if (secRes.ok) {
        const secData = await secRes.json();
        if (secData.success && Array.isArray(secData.sections)) {
          setSections(secData.sections);
          setNewOrder(secData.sections.length + 1);
        }
      }

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
          setCatalogProducts(prodData.products);
        }
      }

      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
          setCategoriesList(catData.categories);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load marketing data from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products in picker
  const filteredProducts = catalogProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(pickerSearch.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(pickerSearch.toLowerCase()));

    const matchesCat = pickerCategory === 'all' || p.categorySlug === pickerCategory;
    return matchesSearch && matchesCat;
  });

  // Reordering function: Move Up
  const handleMoveUp = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;

    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;

    const reordered = newSections.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));

    setSections(reordered);
    await persistReorder(reordered);
  };

  // Reordering function: Move Down
  const handleMoveDown = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === sections.length - 1) return;

    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;

    const reordered = newSections.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));

    setSections(reordered);
    await persistReorder(reordered);
  };

  // Persist reorder to backend API
  const persistReorder = async (reorderedSections: MarketingSectionItem[]) => {
    setIsSavingOrder(true);
    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reorder: reorderedSections.map((s, idx) => ({
            id: s.id,
            sortOrder: idx + 1,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: 'تم حفظ ترتيب الأقسام الترويجية بنجاح!',
        });
      } else {
        throw new Error(data.message || 'فشل في حفظ الترتيب');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر حفظ الترتيب الجديد في الخادم',
      });
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Delete Section
  const handleDeleteSection = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذا القسم الترويجي نهائياً؟')) return;

    try {
      const res = await fetch(`/api/admin/marketing?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const remaining = sections.filter((s) => s.id !== id);
        const reordered = remaining.map((s, idx) => ({
          ...s,
          order: idx + 1,
        }));
        setSections(reordered);
        if (editingSection?.id === id) {
          setEditingSection(null);
        }
        setFeedback({
          type: 'success',
          message: 'تم حذف القسم الترويجي بنجاح!',
        });
        await persistReorder(reordered);
      } else {
        throw new Error(data.message || 'فشل في حذف القسم');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر حذف القسم الترويجي',
      });
    }
  };

  // Open Product Picker
  const openProductPicker = (target: 'new_section' | 'editing_section') => {
    setPickerTarget(target);
    if (target === 'new_section') {
      setPickerSelectedIds([...newSelectedProductIds]);
    } else if (editingSection) {
      setPickerSelectedIds([...editingSection.productIds]);
    }
    setPickerSearch('');
    setPickerCategory('all');
    setIsProductPickerOpen(true);
  };

  // Toggle single product selection
  const toggleProductSelection = (productId: string) => {
    setPickerSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Confirm product selection from picker
  const confirmProductSelection = async () => {
    if (pickerTarget === 'new_section') {
      setNewSelectedProductIds(pickerSelectedIds);
      setIsProductPickerOpen(false);
    } else if (editingSection) {
      const updatedSection = { ...editingSection, productIds: pickerSelectedIds };
      setEditingSection(updatedSection);
      setSections((prev) =>
        prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
      );
      setIsProductPickerOpen(false);

      // Persist to backend
      try {
        const res = await fetch('/api/admin/marketing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: updatedSection.id,
            productIds: pickerSelectedIds,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setFeedback({
            type: 'success',
            message: 'تم حفظ وتحديث منتجات القسم بنجاح في قاعدة البيانات!',
          });
        }
      } catch (err) {
        console.warn('Backend update error:', err);
      }
    }
  };

  // Quick remove product from editing section
  const removeProductFromSection = async (productId: string) => {
    if (!editingSection) return;
    const updatedIds = editingSection.productIds.filter((id) => id !== productId);
    const updatedSection = { ...editingSection, productIds: updatedIds };
    setEditingSection(updatedSection);
    setSections((prev) =>
      prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    );

    // Persist to backend
    try {
      await fetch('/api/admin/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: updatedSection.id,
          productIds: updatedIds,
        }),
      });
      setFeedback({
        type: 'info',
        message: 'تم إزالة المنتج من القسم وحفظ التغيير',
      });
    } catch (err) {
      console.warn('Backend remove product error:', err);
    }
  };

  // Add new section submit to backend
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          titleFr: newTitleFr.trim() || undefined,
          titleEn: newTitleEn.trim() || undefined,
          subtitle: newSubtitle.trim(),
          subtitleFr: newSubtitleFr.trim() || undefined,
          subtitleEn: newSubtitleEn.trim() || undefined,
          emoji: newEmoji.trim() || '🏷️',
          badge: newBadge.trim() || 'جديد',
          badgeTextFr: newBadgeFr.trim() || undefined,
          badgeTextEn: newBadgeEn.trim() || undefined,
          selectionType: newSelectionType,
          dynamicCriteria: newDynamicCriteria,
          targetCategory: newSelectionType === 'dynamic' ? (newTargetCategory === 'all' ? null : newTargetCategory) : null,
          limit: newSelectionType === 'dynamic' ? (Number(newLimit) || 8) : 0,
          backgroundColor: newBackgroundColor,
          order: newOrder,
          productIds: newSelectionType === 'manual' ? newSelectedProductIds : [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.section) {
        setSections([...sections, data.section]);
        setNewTitle('');
        setNewTitleFr('');
        setNewTitleEn('');
        setNewSubtitle('');
        setNewSubtitleFr('');
        setNewSubtitleEn('');
        setNewBadge('جديد');
        setNewBadgeFr('');
        setNewBadgeEn('');
        setNewSelectedProductIds([]);
        setIsAddModalOpen(false);
        setFeedback({
          type: 'success',
          message: 'تم إنشاء القسم الترويجي بنجاح وفق مواصفات النموذج المعتمد!',
        });
      } else {
        throw new Error(data.message || 'فشل في حفظ القسم');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر إضافة القسم الترويجي',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Save updated editing section settings
  const handleSaveEditingSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      const res = await fetch('/api/admin/marketing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSection.id,
          title: editingSection.title,
          titleFr: editingSection.titleFr || undefined,
          titleEn: editingSection.titleEn || undefined,
          subtitle: editingSection.subtitle,
          subtitleFr: editingSection.subtitleFr || undefined,
          subtitleEn: editingSection.subtitleEn || undefined,
          emoji: editingSection.emoji,
          badge: editingSection.badge,
          badgeTextFr: editingSection.badgeTextFr || undefined,
          badgeTextEn: editingSection.badgeTextEn || undefined,
          selectionType: editingSection.selectionType,
          dynamicCriteria: editingSection.dynamicCriteria,
          targetCategory: editingSection.selectionType === 'dynamic' ? (editingSection.targetCategory === 'all' ? null : editingSection.targetCategory) : null,
          limit: editingSection.selectionType === 'dynamic' ? (Number(editingSection.limit) || 8) : 0,
          backgroundColor: editingSection.backgroundColor,
          isActive: editingSection.isActive,
          productIds: editingSection.selectionType === 'manual' ? editingSection.productIds : [],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSections((prev) =>
          prev.map((s) => (s.id === editingSection.id ? editingSection : s))
        );
        setEditingSection(null);
        setFeedback({
          type: 'success',
          message: 'تم حفظ وتحديث إعدادات القسم الترويجي بالكامل في قاعدة البيانات!',
        });
      } else {
        throw new Error(data.message || 'فشل في حفظ التعديلات');
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'تعذر حفظ إعدادات القسم',
      });
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
              : feedback.type === 'info'
              ? 'bg-teal-50 border-teal-200 text-brand-deep'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5 font-bold">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : feedback.type === 'info' ? (
              <Sliders className="w-5 h-5 text-brand-teal shrink-0" />
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
            <span className="text-slate-800 font-semibold">محرك الأقسام الترويجية المتقدم (Marketing CMS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
            <Sliders className="w-7 h-7 text-brand-deep" />
            أقسام الصفحة الرئيسية الترويجية ({sections.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة متكاملة وفق نموذج MarketingSection: ترتيب بالأسهم (⬆️/⬇️)، استعلام ديناميكي ذكي (تخفيضات، الأكثر مبيعاً)، أو انتقاء يدوي مخصص.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isSavingOrder && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 text-brand-teal text-xs font-bold border border-teal-200">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري حفظ الترتيب...</span>
            </div>
          )}

          <button
            onClick={() => {
              setNewTitle('');
              setNewSubtitle('');
              setNewEmoji('🏷️');
              setNewBadge('جديد');
              setNewSelectionType('manual');
              setNewDynamicCriteria('on_sale');
              setNewTargetCategory('all');
              setNewLimit(8);
              setNewSelectedProductIds([]);
              setNewOrder(sections.length + 1);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-sm shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>إنشاء قسم ترويجي جديد</span>
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50/50 to-white p-4 sm:p-5 rounded-3xl border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-brand-deep font-bold">
          <ArrowUpDown className="w-5 h-5 text-brand-teal shrink-0" />
          <span>
            <strong>الترتيب والذكاء:</strong> تدعم الأقسام نوعين: <strong>يدوي (Manual)</strong> لاختيار منتجات معينة، أو <strong>ديناميكي (Dynamic)</strong> لجلب العروض والأكثر مبيعاً تلقائياً، مع ترتيب تسلسلي محفوظ فورياً.
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium">
          متوافق 100% مع نموذج قاعدة البيانات
        </span>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">جاري تحميل الأقسام الترويجية من قاعدة البيانات...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-base text-slate-700">لا توجد أقسام ترويجية حتى الآن</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            قم بإنشاء قسمك الترويجي الأول لعرض العروض المميزة، التخفيضات، أو المستحضرات الأكثر طلباً في الرئيسية.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-deep text-white font-bold text-xs"
          >
            إنشاء قسم الآن
          </button>
        </div>
      ) : (
        /* Sections Cards Grid with Full Model Fields */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec, index) => {
            const isManual = sec.selectionType === 'manual';
            const assignedProducts = isManual ? getProductsByIds(sec.productIds) : (sec.resolvedProducts || []);
            const isFirst = index === 0;
            const isLast = index === sections.length - 1;

            const criteriaLabel = DYNAMIC_CRITERIA_OPTIONS.find((c) => c.id === sec.dynamicCriteria)?.label || 'تلقائي';

            return (
              <div
                key={sec.id}
                onClick={() => setEditingSection(sec)}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-brand-teal/40 transition-all cursor-pointer flex flex-col justify-between group space-y-4 relative"
              >
                <div className="space-y-3">
                  {/* Top Bar: Order, Reorder buttons, Badge, Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Order rank pill */}
                      <div className="w-9 h-9 rounded-2xl bg-brand-deep text-white flex items-center justify-center font-black text-xs shadow-xs">
                        #{sec.order || index + 1}
                      </div>

                      {/* Reordering Up/Down action buttons */}
                      <div
                        className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleMoveUp(index, e)}
                          disabled={isFirst}
                          title={isFirst ? 'القسم في أعلى موضع بالفعل' : 'تحريك القسم للأعلى'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFirst
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-600 hover:text-brand-deep hover:bg-white shadow-2xs cursor-pointer'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleMoveDown(index, e)}
                          disabled={isLast}
                          title={isLast ? 'القسم في أسفل موضع بالفعل' : 'تحريك القسم للأسفل'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLast
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-600 hover:text-brand-deep hover:bg-white shadow-2xs cursor-pointer'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section Badge */}
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                        {sec.badge}
                      </span>
                    </div>

                    {/* Actions: Edit icon + Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSection(sec);
                        }}
                        title="تعديل إعدادات القسم"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-brand-deep hover:bg-slate-100 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSection(sec.id, e)}
                        title="حذف هذا القسم"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Emoji & Subtitle */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sec.emoji || '🏷️'}</span>
                      <h3 className="font-black text-lg text-slate-900 group-hover:text-brand-deep transition-colors">
                        {sec.title}
                      </h3>
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Mode Pill: Manual vs Dynamic */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    {isManual ? (
                      <>
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Package className="w-3 h-3 text-brand-teal" />
                          تحديد يدوي: <strong>{sec.productIds.length}</strong> مستحضر
                        </span>
                        <span className="inline-flex items-center gap-1 font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                          <Layers className="w-3 h-3 text-brand-teal" />
                          العرض: مفتوح
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="inline-flex items-center gap-1 font-bold text-brand-deep bg-brand-turquoise/10 px-2.5 py-1 rounded-lg border border-brand-turquoise/20">
                          <Zap className="w-3 h-3 text-brand-green" />
                          استعلام ذكي: <strong>{criteriaLabel}</strong>
                        </span>
                        <span className="font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          الحد الأقصى: <strong>{sec.limit || 8}</strong>
                        </span>
                        {sec.targetCategory && sec.targetCategory !== 'all' && (
                          <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                            القسم: {getCategoryName(sec.targetCategory)}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Thumbnails Preview Strip */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      {isManual ? 'معاينة المستحضرات المحددة:' : 'معاينة المنتجات المستعلم عنها تلقائياً:'}
                    </span>
                    {assignedProducts.length > 0 ? (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {assignedProducts.slice(0, 5).map((p: any) => (
                          <div
                            key={p._id || p.id}
                            className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 relative shrink-0 overflow-hidden flex items-center justify-center p-1"
                            title={p.name}
                          >
                            {p.images?.[0]?.url || p.image ? (
                              <Image
                                src={p.images?.[0]?.url || p.image}
                                alt={p.name}
                                fill
                                unoptimized
                                sizes="48px"
                                className="object-contain p-0.5"
                              />
                            ) : (
                              <Package className="w-4 h-4 text-slate-300" />
                            )}
                          </div>
                        ))}
                        {assignedProducts.length > 5 && (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            +{assignedProducts.length - 5}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        {isManual ? 'لم يتم تعيين منتجات بعد. اضغط هنا للإضافة.' : 'سيتم جلب المنتجات تلقائياً بحسب شروط الاستعلام.'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom action banner */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-deep group-hover:text-brand-teal transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-4 h-4" />
                    <span>{isManual ? 'إدارة المنتجات وإعدادات القسم' : 'تعديل شروط الاستعلام التلقائي'}</span>
                  </span>
                  <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Full Section Editor (Title, Subtitle, Emoji, Selection Type, Dynamic Criteria, Limit, Background) */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">تعديل مواصفات وإعدادات القسم</span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>{editingSection.emoji}</span>
                  <span>{editingSection.title}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal font-extrabold border border-brand-teal/20">
                    {editingSection.badge}
                  </span>
                </h3>
              </div>

              <button
                onClick={() => setEditingSection(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditingSection} className="space-y-5">
              {/* Row 1: Title & Badge (Arabic - Mandatory) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormLabelWithHelp
                    label="عنوان القسم الرئيسي (بالعربية)"
                    required
                    badge="إجباري"
                    helpText="العنوان الذي يظهر أعلى شريط المستحضرات في الصفحة الأولى للمتجر بالعربية وهو الحقل الأساسي."
                  />
                  <input
                    type="text"
                    required
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الشارة (Badge)"
                    required
                    badge="إجباري"
                    helpText="نص الشارة الصغيرة الملونة المرافقة للعنوان (مثال: عروض كبرى، الأكثر طلباً)."
                  />
                  <input
                    type="text"
                    required
                    value={editingSection.badge}
                    onChange={(e) => setEditingSection({ ...editingSection, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>
              </div>

              {/* Optional Translations for Title & Badge in FR and EN */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-700 block">
                  الترجمات الإضافية للعنوان والشارة (اختياري / Optional)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabelWithHelp
                      label="العنوان بالفرنسية (Titre en français)"
                      badge="اختياري - FR"
                      helpText="عنوان القسم بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد العنوان العربي تلقائياً."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Soins Rénovateurs et Hydratation"
                      value={editingSection.titleFr || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, titleFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="العنوان بالإنجليزية (Title in English)"
                      badge="اختياري - EN"
                      helpText="عنوان القسم بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد العنوان العربي تلقائياً."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Skin Renewal and Hydration"
                      value={editingSection.titleEn || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, titleEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="الشارة بالفرنسية (Badge FR)"
                      badge="اختياري - FR"
                      helpText="شارة القسم بالفرنسية (اختياري)."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Nouveautés"
                      value={editingSection.badgeTextFr || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, badgeTextFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="الشارة بالإنجليزية (Badge EN)"
                      badge="اختياري - EN"
                      helpText="شارة القسم بالإنجليزية (اختياري)."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Featured"
                      value={editingSection.badgeTextEn || ''}
                      onChange={(e) => setEditingSection({ ...editingSection, badgeTextEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Subtitle & Emoji */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <FormLabelWithHelp
                    label="العنوان الفرعي / الوصف التوضيحي (Subtitle)"
                    badge="عربي"
                    helpText="سطر توضيحي يظهر أسفل العنوان يشرح طبيعة المنتجات أو العرض الترويجي."
                  />
                  <input
                    type="text"
                    placeholder="مثال: خصومات تصل حتى 30% على أشهر المستحضرات المعتمدة"
                    value={editingSection.subtitle || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الرمز التعبيري (Emoji)"
                    helpText="أيقونة أو إيموجي مصاحب للعنوان لزيادة الجاذبية البصرية."
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingSection.emoji || '🏷️'}
                      onChange={(e) => setEditingSection({ ...editingSection, emoji: e.target.value })}
                      className="w-14 px-2 py-2 text-center text-lg rounded-xl border border-slate-200 bg-slate-50 font-bold"
                    />
                    <div className="flex gap-1 overflow-x-auto text-base">
                      {['🏷️', '💎', '🔥', '🌿', '💧'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setEditingSection({ ...editingSection, emoji: em })}
                          className="p-1 hover:bg-slate-100 rounded-lg"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Subtitle in FR & EN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="الوصف الفرعي بالفرنسية (Sous-titre)"
                    badge="اختياري - FR"
                    helpText="الوصف الفرعي بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Ex: Jusqu'à 30% de réduction..."
                    value={editingSection.subtitleFr || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitleFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الوصف الفرعي بالإنجليزية (Subtitle)"
                    badge="اختياري - EN"
                    helpText="الوصف الفرعي بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Ex: Up to 30% off selected products..."
                    value={editingSection.subtitleEn || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitleEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Row 3: Selection Type Selector (Manual vs Dynamic) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <FormLabelWithHelp
                  label="نوع اختيار المنتجات (Selection Type)"
                  required
                  helpText="حدد ما إذا كنت تريد اختيار المنتجات واحداً تلو الآخر يدوياً، أو ترك المحرك يستعلم عنها تلقائياً."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setEditingSection({ ...editingSection, selectionType: 'manual' })}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      editingSection.selectionType === 'manual'
                        ? 'border-brand-deep bg-brand-deep/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-sm text-slate-900 mb-1">
                      <span>تحديد يدوي (Manual)</span>
                      <Package className="w-4 h-4 text-brand-teal" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      البحث في الكتالوج واختيار قائمة منتجات معينة لعرضها بالترتيب المحدد.
                    </p>
                  </div>

                  <div
                    onClick={() => setEditingSection({ ...editingSection, selectionType: 'dynamic' })}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      editingSection.selectionType === 'dynamic'
                        ? 'border-brand-deep bg-brand-deep/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-sm text-slate-900 mb-1">
                      <span>استعلام ديناميكي ذكي (Dynamic)</span>
                      <Zap className="w-4 h-4 text-brand-green" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      استعلام آلي من قاعدة البيانات بناءً على معايير (التخفيضات، الأكثر طلباً، القسم).
                    </p>
                  </div>
                </div>

                {/* Conditional Sub-settings for Dynamic */}
                {editingSection.selectionType === 'dynamic' && (
                  <div className="pt-3 border-t border-slate-200 space-y-4">
                    <div>
                      <FormLabelWithHelp
                        label="معيار الاستعلام التلقائي (Dynamic Criteria)"
                        required
                        helpText="المعيار البرمجي الذي تطبقه الدالة الذكية getResolvedProducts لجلب المنتجات (تخفيضات، الأكثر طلباً، الأحدث، إلخ)."
                      />
                      <select
                        value={editingSection.dynamicCriteria || 'on_sale'}
                        onChange={(e) => setEditingSection({ ...editingSection, dynamicCriteria: e.target.value as DynamicCriteria })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white text-slate-900 text-sm font-bold"
                      >
                        {DYNAMIC_CRITERIA_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label} — ({opt.desc})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FormLabelWithHelp
                        label="القسم أو الفئة المستهدفة (Category Scope)"
                        helpText="اختر فئة معينة لحصر الاستعلام التلقائي فيها (مثال: عروض العناية بالبشرة فقط)، أو اتركها 'كافة الأقسام' للاستعلام من عموم المتجر."
                      />
                      <select
                        value={editingSection.targetCategory || 'all'}
                        onChange={(e) => setEditingSection({ ...editingSection, targetCategory: e.target.value === 'all' ? null : e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white text-slate-900 text-sm font-bold"
                      >
                        <option value="all">🌐 كافة الأقسام (المتجر بالكامل - استعلام عام)</option>
                        {categoriesList.map((cat) => (
                          <React.Fragment key={cat._id || cat.slug}>
                            <option value={cat._id || cat.slug} className="font-bold text-slate-900">
                              📁 {cat.nameAr || cat.name}
                            </option>
                            {cat.subCategories?.map((sub: any) => (
                              <option key={sub._id || sub.slug} value={sub._id || sub.slug} className="text-slate-600">
                                &nbsp;&nbsp;&nbsp;&nbsp;↳ {sub.nameAr || sub.name}
                              </option>
                            ))}
                          </React.Fragment>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FormLabelWithHelp
                        label="الحد الأقصى للمنتجات المعروضة (Limit)"
                        required
                        helpText="اكتب العدد الأقصى للمنتجات التي يقوم المحرك باستعلامها وعرضها تلقائياً في هذا القسم (مثال: 8 أو 12 مستحضر)."
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          required
                          value={editingSection.limit || ''}
                          onChange={(e) =>
                            setEditingSection({
                              ...editingSection,
                              limit: Math.max(1, parseInt(e.target.value) || 1),
                            })
                          }
                          className="w-28 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white text-slate-900 text-sm font-black text-center"
                        />
                        <span className="text-xs font-bold text-slate-500">مستحضرات كحد أقصى</span>
                        <div className="flex items-center gap-1.5 mr-auto">
                          <span className="text-[11px] text-slate-400 font-medium">خيارات سريعة:</span>
                          {[4, 6, 8, 12, 16, 24].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setEditingSection({ ...editingSection, limit: n })}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                editingSection.limit === n
                                  ? 'bg-brand-deep text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Sub-settings for Manual (Product picker trigger) */}
                {editingSection.selectionType === 'manual' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-brand-teal flex items-center justify-center font-bold shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">سعة العرض:</span>
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-teal-600 text-white">
                              مفتوح بالكامل (بدون تقييد)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            في التحديد اليدوي، يتم عرض كافة المنتجات التي تختارها من الكتالوج (حالياً: <strong>{editingSection.productIds.length}</strong> مستحضر) بالترتيب المنسق دون اقتطاع.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openProductPicker('editing_section')}
                        className="px-4 py-2 rounded-xl bg-brand-deep text-white text-xs font-bold shadow-xs hover:bg-brand-teal transition-colors shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>اختيار المنتجات ({editingSection.productIds.length})</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Row 4: Background Color */}
              <div>
                <FormLabelWithHelp
                  label="نمط ولون الخلفية (Background Style)"
                  helpText="اختر نمط خلفية مخصص لإبراز القسم عن بقية الأقسام في الصفحة الرئيسية."
                />
                <select
                  value={editingSection.backgroundColor || ''}
                  onChange={(e) => setEditingSection({ ...editingSection, backgroundColor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                >
                  {BACKGROUND_OPTIONS.map((bg) => (
                    <option key={bg.id} value={bg.id}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-xs shadow-md shadow-brand-deep/20 hover:opacity-95"
                >
                  حفظ وتطبيق التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New Section Form */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-teal" />
              إنشاء قسم ترويجي جديد (Marketing CMS)
            </h3>

            <form onSubmit={handleAddSection} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormLabelWithHelp
                    label="عنوان القسم الترويجي (بالعربية)"
                    required
                    badge="إجباري"
                    helpText="العنوان الرئيسي الذي يظهر أعلى شريط المنتجات في الصفحة الأولى للمتجر بالعربية وهو الحقل الأساسي."
                  />
                  <input
                    type="text"
                    required
                    placeholder="مثال: روتين العناية بالنضارة والترميم"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-bold"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الشارة أو الوسم (Badge)"
                    required
                    badge="إجباري"
                    helpText="نص الشارة الصغيرة الملونة المرافقة للعنوان (مثال: مميز، الأكثر طلباً، عروض)."
                  />
                  <input
                    type="text"
                    required
                    placeholder="مثال: مميز"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Optional Translations for Add Modal in FR & EN */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-700 block">
                  الترجمات الإضافية للقسم (اختياري / Optional)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <FormLabelWithHelp
                      label="العنوان بالفرنسية (Titre)"
                      badge="اختياري - FR"
                      helpText="عنوان القسم بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد العربي تلقائياً."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Routine Soin et Réparation"
                      value={newTitleFr}
                      onChange={(e) => setNewTitleFr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="العنوان بالإنجليزية (Title)"
                      badge="اختياري - EN"
                      helpText="عنوان القسم بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد العربي تلقائياً."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Repair and Care Routine"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="الشارة بالفرنسية (Badge FR)"
                      badge="اختياري - FR"
                      helpText="شارة القسم بالفرنسية (اختياري)."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Vedette"
                      value={newBadgeFr}
                      onChange={(e) => setNewBadgeFr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <FormLabelWithHelp
                      label="الشارة بالإنجليزية (Badge EN)"
                      badge="اختياري - EN"
                      helpText="شارة القسم بالإنجليزية (اختياري)."
                    />
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="Ex: Featured"
                      value={newBadgeEn}
                      onChange={(e) => setNewBadgeEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <FormLabelWithHelp
                    label="العنوان الفرعي التوضيحي (Subtitle)"
                    badge="عربي"
                    helpText="نص إضافي يشرح العرض أو فائدة التشكيلة بالعربية."
                  />
                  <input
                    type="text"
                    placeholder="مثال: تركيبات متطورة ترمم حاجز البشرة وترطبها بعمق"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-slate-50 text-slate-900 text-sm font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الرمز (Emoji)"
                    helpText="اختر إيموجي مميز."
                  />
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base"
                  >
                    {EMOJI_OPTIONS.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Subtitles in FR & EN for Add Modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <FormLabelWithHelp
                    label="الوصف الفرعي بالفرنسية (Sous-titre FR)"
                    badge="اختياري - FR"
                    helpText="نص إضافي بالفرنسية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Ex: Soins dermatologiques avancés..."
                    value={newSubtitleFr}
                    onChange={(e) => setNewSubtitleFr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="الوصف الفرعي بالإنجليزية (Subtitle EN)"
                    badge="اختياري - EN"
                    helpText="نص إضافي بالإنجليزية (اختياري). في حال تركه فارغاً سيتم اعتماد النص العربي تلقائياً."
                  />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Ex: Advanced dermatological care..."
                    value={newSubtitleEn}
                    onChange={(e) => setNewSubtitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Selection Type & Criteria */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <FormLabelWithHelp
                  label="نوع اختيار وتغذية المنتجات"
                  required
                  helpText="اختر ما إذا كان القسم يدوي (Manual) أو ديناميكي ذكي (Dynamic)."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setNewSelectionType('manual')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      newSelectionType === 'manual'
                        ? 'border-brand-deep bg-brand-deep/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-slate-900 mb-1">
                      <span>تحديد يدوي (Manual)</span>
                      <Package className="w-3.5 h-3.5 text-brand-teal" />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      اختيار يدوي لمستحضرات محددة بالاسم والصورة.
                    </p>
                  </div>

                  <div
                    onClick={() => setNewSelectionType('dynamic')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      newSelectionType === 'dynamic'
                        ? 'border-brand-deep bg-brand-deep/5 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black text-xs text-slate-900 mb-1">
                      <span>استعلام ديناميكي ذكي (Dynamic)</span>
                      <Zap className="w-3.5 h-3.5 text-brand-green" />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      جلب تلقائي بالمعايير (خصومات، مبيعات).
                    </p>
                  </div>
                </div>

                {newSelectionType === 'dynamic' ? (
                  <div className="pt-3 border-t border-slate-200 space-y-4">
                    <div>
                      <FormLabelWithHelp
                        label="معيار الاستعلام الديناميكي"
                        required
                        helpText="نوع الشرط المطلوب لتوليد المنتجات (تخفيضات، الأكثر طلباً، الأحدث، إلخ)."
                      />
                      <select
                        value={newDynamicCriteria}
                        onChange={(e) => setNewDynamicCriteria(e.target.value as DynamicCriteria)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      >
                        {DYNAMIC_CRITERIA_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FormLabelWithHelp
                        label="القسم أو الفئة المستهدفة (Category Scope)"
                        helpText="حدد فئة معينة لحصر الاستعلام التلقائي فيها (مثال: الأكثر مبيعاً في قسم العناية بالبشرة فقط)، أو اتركها 'كافة الأقسام' للاستعلام من عموم المتجر."
                      />
                      <select
                        value={newTargetCategory}
                        onChange={(e) => setNewTargetCategory(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                      >
                        <option value="all">🌐 كافة الأقسام (المتجر بالكامل - استعلام عام)</option>
                        {categoriesList.map((cat) => (
                          <React.Fragment key={cat._id || cat.slug}>
                            <option value={cat._id || cat.slug} className="font-bold text-slate-900">
                              📁 {cat.nameAr || cat.name}
                            </option>
                            {cat.subCategories?.map((sub: any) => (
                              <option key={sub._id || sub.slug} value={sub._id || sub.slug} className="text-slate-600">
                                &nbsp;&nbsp;&nbsp;&nbsp;↳ {sub.nameAr || sub.name}
                              </option>
                            ))}
                          </React.Fragment>
                        ))}
                      </select>
                    </div>

                    <div>
                      <FormLabelWithHelp
                        label="الحد الأقصى لعدد المستحضرات المطلوبة (Limit)"
                        required
                        helpText="اكتب العدد الأقصى للمنتجات التي يقوم المحرك باستعلامها وعرضها تلقائياً للزبائن في هذا القسم (مثال: 8 أو 12 مستحضر)."
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          required
                          value={newLimit || ''}
                          onChange={(e) => setNewLimit(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-28 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white text-slate-900 text-sm font-black text-center"
                        />
                        <span className="text-xs font-bold text-slate-500">مستحضرات كحد أقصى</span>
                        <div className="flex items-center gap-1 mr-auto">
                          <span className="text-[11px] text-slate-400 font-medium">خيارات سريعة:</span>
                          {[4, 6, 8, 12, 16, 24].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setNewLimit(n)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                newLimit === n
                                  ? 'bg-brand-deep text-white shadow-2xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-brand-teal flex items-center justify-center font-bold shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900">سعة العرض:</span>
                            <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-teal-600 text-white">
                              مفتوح بالكامل (بدون تقييد)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            في التحديد اليدوي، يتم عرض كافة المنتجات التي تختارها من الكتالوج (تم اختيار {newSelectedProductIds.length} مستحضر) دون اقتطاع.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openProductPicker('new_section')}
                        className="px-4 py-2 rounded-xl bg-brand-deep text-white text-xs font-bold hover:bg-brand-teal transition-colors shrink-0 inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>اختيار المنتجات ({newSelectedProductIds.length})</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order & Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithHelp
                    label="ترتيب الظهور في الرئيسية"
                    helpText="الرقم الترتيبي الأولي (يمكن تعديله بالأسهم لاحقاً)."
                  />
                  <input
                    type="number"
                    min={1}
                    required
                    value={newOrder}
                    onChange={(e) => setNewOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  />
                </div>

                <div>
                  <FormLabelWithHelp
                    label="نمط ولون الخلفية"
                    helpText="اختر نمط خلفية مخصص لإبراز القسم."
                  />
                  <select
                    value={newBackgroundColor}
                    onChange={(e) => setNewBackgroundColor(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold"
                  >
                    {BACKGROUND_OPTIONS.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-xs shadow-md shadow-brand-deep/20 hover:opacity-95 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>إنشاء القسم وحفظه</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Product Picker Modal */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-deep" />
                  اختيار المستحضرات للقسم الترويجي
                </h3>
                <p className="text-xs text-slate-500">
                  ابحث بالاسم أو الماركة وحدد المستحضرات المطلوبة.
                </p>
              </div>

              <button
                onClick={() => setIsProductPickerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ابحث باسم المستحضر أو الماركة..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-medium"
                    autoFocus
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="sm:w-56">
                  <select
                    value={pickerCategory}
                    onChange={(e) => setPickerCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal font-bold"
                  >
                    <option value="all">كافة الأقسام</option>
                    {MOCK_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-slate-600">
                  تم تحديد{' '}
                  <strong className="text-brand-deep font-black text-sm">
                    {pickerSelectedIds.length}
                  </strong>{' '}
                  من أصل {catalogProducts.length} مستحضر
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allFilteredIds = filteredProducts.map((p) => p._id);
                      setPickerSelectedIds(Array.from(new Set([...pickerSelectedIds, ...allFilteredIds])));
                    }}
                    className="text-xs text-brand-teal hover:underline font-bold"
                  >
                    تحديد النتائج الظاهرة
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setPickerSelectedIds([])}
                    className="text-xs text-red-500 hover:underline font-bold"
                  >
                    إلغاء التحديد
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <Search className="w-8 h-8 mx-auto text-slate-300" />
                  <p>لا توجد منتجات مطابقة للبحث.</p>
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = pickerSelectedIds.includes(product._id);

                  return (
                    <div
                      key={product._id}
                      onClick={() => toggleProductSelection(product._id)}
                      className={`p-3 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-deep/5 border-2 border-brand-deep/40 shadow-xs'
                          : 'hover:bg-slate-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-brand-deep text-white shadow-xs'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 relative shrink-0 overflow-hidden flex items-center justify-center p-1">
                          {product.images?.[0]?.url ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              unoptimized
                              sizes="56px"
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-slate-300" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span className="font-semibold text-brand-teal">{product.brand}</span>
                            <span>•</span>
                            <span>{product.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="font-black text-xs sm:text-sm text-brand-deep block">
                          {product.price.toLocaleString('ar-DZ')} دج
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-400 line-through block">
                            {product.originalPrice.toLocaleString('ar-DZ')} دج
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-700">
                المجموع المحدد: <strong className="text-brand-deep">{pickerSelectedIds.length}</strong> مستحضر
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductPickerOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={confirmProductSelection}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-deep via-brand-teal to-brand-green text-white font-black text-xs shadow-md shadow-brand-deep/20 hover:opacity-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>تأكيد الإضافة ({pickerSelectedIds.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
