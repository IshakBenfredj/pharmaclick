'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Tag, Layers, ShoppingBag } from 'lucide-react';
import { ProductCard, ProductData } from '@/components/ui/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/data/mockData';
import { useLanguage } from '@/context/LanguageContext';

interface DynamicSection {
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
  selectionType: 'manual' | 'dynamic';
  dynamicCriteria?: string;
  limit?: number;
  backgroundColor?: string;
  productIds: string[];
  resolvedProducts?: any[];
  order: number;
  isActive: boolean;
}

export function DynamicMarketingSections() {
  const [sections, setSections] = useState<DynamicSection[]>([]);
  const [productsCatalog, setProductsCatalog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getLocalized, t, direction } = useLanguage();

  useEffect(() => {
    const fetchSectionsAndProducts = async () => {
      try {
        const [secRes, prodRes] = await Promise.all([
          fetch('/api/admin/marketing'),
          fetch('/api/admin/products'),
        ]);

        if (secRes.ok) {
          const secData = await secRes.json();
          if (secData.success && Array.isArray(secData.sections)) {
            // Sort strictly by order
            const sorted = [...secData.sections].sort((a, b) => (a.order || 0) - (b.order || 0));
            setSections(sorted.filter((s: DynamicSection) => s.isActive !== false));
          }
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.products)) {
            setProductsCatalog(prodData.products);
          } else {
            setProductsCatalog(MOCK_PRODUCTS);
          }
        } else {
          setProductsCatalog(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.warn('Dynamic marketing sections fetch error:', err);
        setProductsCatalog(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSectionsAndProducts();
  }, []);

  if (isLoading || sections.length === 0) {
    return null;
  }

  // Helper to map IDs or resolved products to UI ProductData
  const getSectionProducts = (section: DynamicSection): ProductData[] => {
    // If backend already resolved products (via getResolvedProducts), use them directly
    if (Array.isArray(section.resolvedProducts) && section.resolvedProducts.length > 0) {
      const mapped = section.resolvedProducts.map((p) => ({
        _id: p._id || p.id,
        name: p.name,
        nameAr: p.nameAr,
        nameFr: p.nameFr,
        nameEn: p.nameEn,
        brand: p.brand || 'ماركة معتمدة',
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercentage: p.discountPercentage,
        image: p.images?.[0]?.url || p.image || '/products/hyalu-b5.png',
        category: p.categorySlug || 'skincare',
        inStock: p.inStock !== false && (p.stockQuantity === undefined || p.stockQuantity > 0),
        sizeOrVolume: p.sizeOrVolume || p.shortDescription || '',
      }));

      // In manual mode, it's open (مفتوح لكافة المنتجات المحددة). In dynamic mode, enforce limit.
      if (section.selectionType === 'manual') {
        return mapped;
      }
      return mapped.slice(0, section.limit || 8);
    }

    // Fallback for manual productIds mapping
    if (Array.isArray(section.productIds) && section.productIds.length > 0) {
      const mapped = section.productIds
        .map((id) => productsCatalog.find((p) => p._id === id || p.id === id))
        .filter(Boolean)
        .map((p) => ({
          _id: p._id || p.id,
          name: p.name,
          nameAr: p.nameAr,
          nameFr: p.nameFr,
          nameEn: p.nameEn,
          brand: p.brand || 'ماركة معتمدة',
          price: p.price,
          originalPrice: p.originalPrice,
          discountPercentage: p.discountPercentage,
          image: p.images?.[0]?.url || p.image || '/products/hyalu-b5.png',
          category: p.categorySlug || 'skincare',
          inStock: p.inStock !== false && (p.stockQuantity === undefined || p.stockQuantity > 0),
          sizeOrVolume: p.sizeOrVolume || p.shortDescription || '',
        }));

      // Manual is open!
      return mapped;
    }

    return [];
  };

  return (
    <div className="space-y-12">
      {sections.map((section) => {
        const sectionProducts = getSectionProducts(section);
        if (sectionProducts.length === 0) return null;

        const hasCustomBg = Boolean(section.backgroundColor);
        const sectionTitle = getLocalized(section, 'title') || section.title;
        const sectionSubtitle = getLocalized(section, 'subtitle') || section.subtitle;
        const sectionBadge = getLocalized(section, 'badgeText') || getLocalized(section, 'badge') || section.badge;

        return (
          <section
            key={section.id}
            className={`max-w-7xl mx-auto px-4 transition-all ${
              hasCustomBg
                ? `${section.backgroundColor} py-8 sm:py-10 rounded-3xl border border-slate-200/60 shadow-xs`
                : ''
            }`}
          >
            {/* Header: Title, Emoji, Badge, Subtitle & Link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2.5">
                  {section.emoji ? (
                    <span className="text-2xl sm:text-3xl drop-shadow-xs">{section.emoji}</span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
                  )}
                  <h2 className="text-xl sm:text-2xl font-black text-brand-deep">
                    {sectionTitle}
                  </h2>
                  {sectionBadge && (
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                      {sectionBadge}
                    </span>
                  )}
                </div>
                {sectionSubtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {sectionSubtitle}
                  </p>
                )}
              </div>

              <Link
                href="/products"
                className="text-xs sm:text-sm font-bold text-brand-teal hover:text-brand-deep transition-colors flex items-center gap-1 group self-start sm:self-auto shrink-0"
              >
                <span>{t('viewAll') || 'عرض الكل'}</span>
                {direction === 'rtl' ? (
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {sectionProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
