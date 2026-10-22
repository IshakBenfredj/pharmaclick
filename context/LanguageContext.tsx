'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'ar' | 'fr' | 'en';

export interface LanguageContextType {
  language: SupportedLanguage;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  getLocalized: (
    item: any,
    field: string,
    fallbackField?: string
  ) => string;
}

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  ar: {
    deliveryBadge: 'توصيل سريع وموثوق إلى 69 ولاية في الجزائر 🇩🇿',
    customerService: 'خدمة الزبائن',
    searchPlaceholder: 'ابحث عن مستحضرات عناية، فيتامينات، واقيات شمس، ماركات...',
    searchButton: 'بحث',
    trackOrder: 'تتبع طلبيتي',
    trackOrderSub: 'تابع طلبك',
    cart: 'السلة',
    home: 'الرئيسية',
    allProducts: 'كل المنتجات',
    allCategories: 'كافة التصنيفات',
    certifiedBrands: 'الماركات المعتمدة',
    offersAndDiscounts: 'العروض والتخفيضات',
    contactUs: 'تواصل معنا',
    quickSuggestions: 'عمليات البحث الأكثر شيوعاً:',
    liveSearchResults: 'نتائج البحث الفوري',
    productUnit: 'مستحضر',
    viewAllResults: 'عرض كافة النتائج لـ',
    noResults: 'لم نجد مستحضرات تطابق',
    currency: 'دج',
    discoverNow: 'اكتشف الآن',
    shopNow: 'تسوق الآن',
    inStock: 'متوفر بالمخزون',
    outOfStock: 'غير متوفر حالياً',
    addToCart: 'أضف للسلة',
    viewProduct: 'عرض التفاصيل',
    bestSellers: 'الأكثر طلباً',
    shopByCategory: 'تسوق حسب الفئة',
    trust100Original: 'منتجات أصلية 100%',
    trust69Wilayas: 'توصيل لـ 69 ولاية',
    trustCod: 'دفع عند الاستلام',
    trustSupport: 'استشارة متخصصة',
    usageTab: 'طريقة وإرشادات الاستخدام',
    warningsTab: 'التحذيرات وموانع الاستعمال',
    detailsTab: 'المواصفات والتركيبة',
  },
  fr: {
    deliveryBadge: 'Livraison rapide et fiable vers 69 wilayas en Algérie 🇩🇿',
    customerService: 'Service Client',
    searchPlaceholder: 'Rechercher soins, vitamines, protections solaires, marques...',
    searchButton: 'Rechercher',
    trackOrder: 'Suivi de commande',
    trackOrderSub: 'Suivre mon colis',
    cart: 'Panier',
    home: 'Accueil',
    allProducts: 'Tous les produits',
    allCategories: 'Toutes les catégories',
    certifiedBrands: 'Marques certifiées',
    offersAndDiscounts: 'Offres & Promos',
    contactUs: 'Contactez-nous',
    quickSuggestions: 'Recherches fréquentes :',
    liveSearchResults: 'Résultats de recherche',
    productUnit: 'produit(s)',
    viewAllResults: 'Voir tous les résultats pour',
    noResults: 'Aucun produit ne correspond à',
    currency: 'DA',
    discoverNow: 'Découvrir',
    shopNow: 'Acheter maintenant',
    inStock: 'En stock',
    outOfStock: 'Rupture de stock',
    addToCart: 'Ajouter au panier',
    viewProduct: 'Voir le produit',
    bestSellers: 'Meilleures Ventes',
    shopByCategory: 'Acheter par catégorie',
    trust100Original: '100% Produits Authentiques',
    trust69Wilayas: 'Livraison 69 Wilayas',
    trustCod: 'Paiement à la livraison',
    trustSupport: 'Conseils experts 7j/7',
    usageTab: "Conseils d'utilisation",
    warningsTab: 'Précautions & Avertissements',
    detailsTab: 'Composition & Caractéristiques',
  },
  en: {
    deliveryBadge: 'Fast and reliable delivery across 69 wilayas in Algeria 🇩🇿',
    customerService: 'Customer Support',
    searchPlaceholder: 'Search skincare, vitamins, sun protection, brands...',
    searchButton: 'Search',
    trackOrder: 'Track Order',
    trackOrderSub: 'Follow package',
    cart: 'Cart',
    home: 'Home',
    allProducts: 'All Products',
    allCategories: 'All Categories',
    certifiedBrands: 'Certified Brands',
    offersAndDiscounts: 'Offers & Discounts',
    contactUs: 'Contact Us',
    quickSuggestions: 'Popular Searches:',
    liveSearchResults: 'Instant Search Results',
    productUnit: 'products',
    viewAllResults: 'View all results for',
    noResults: 'No products matched',
    currency: 'DZD',
    discoverNow: 'Discover Now',
    shopNow: 'Shop Now',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    addToCart: 'Add to Cart',
    viewProduct: 'View Details',
    bestSellers: 'Best Sellers',
    shopByCategory: 'Shop by Category',
    trust100Original: '100% Authentic Products',
    trust69Wilayas: 'Shipping to 69 Wilayas',
    trustCod: 'Cash on Delivery',
    trustSupport: 'Expert Advice 7/7',
    usageTab: 'Directions & Usage',
    warningsTab: 'Warnings & Precautions',
    detailsTab: 'Specifications & Composition',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  direction: 'rtl',
  setLanguage: () => {},
  t: (key) => key,
  getLocalized: () => '',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('ar');

  // Load persisted language from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('preferred_locale') as SupportedLanguage;
      if (savedLang && ['ar', 'fr', 'en'].includes(savedLang)) {
        setLanguageState(savedLang);
        applyLanguageToDocument(savedLang);
      } else {
        applyLanguageToDocument('ar');
      }
    } catch (e) {
      applyLanguageToDocument('ar');
    }
  }, []);

  const applyLanguageToDocument = (lang: SupportedLanguage) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('preferred_locale', lang);
    } catch (e) {}
    applyLanguageToDocument(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['ar']?.[key] || key;
  };

  /**
   * دالة استرجاع القيمة المترجمة مع الرجوع التلقائي للعربية في حال غياب الترجمة
   * Automatic Fallback to Arabic if English or French is missing.
   *
   * @example
   * getLocalized(product, 'name')
   * If language is 'en': checks nameEn -> nameAr -> name
   * If language is 'fr': checks nameFr -> nameAr -> name
   * If language is 'ar': checks nameAr -> name
   */
  const getLocalized = (
    item: any,
    field: string,
    fallbackField?: string
  ): string => {
    if (!item) return '';

    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

    if (language === 'en') {
      const enVal =
        item[`${field}En`] ||
        item[`${field}_en`] ||
        item[`${field}EN`] ||
        (field === 'badge' ? item.badgeTextEn : undefined);
      if (enVal && typeof enVal === 'string' && enVal.trim() !== '') {
        return enVal.trim();
      }
    } else if (language === 'fr') {
      const frVal =
        item[`${field}Fr`] ||
        item[`${field}_fr`] ||
        item[`${field}FR`] ||
        (field === 'badge' ? item.badgeTextFr : undefined);
      if (frVal && typeof frVal === 'string' && frVal.trim() !== '') {
        return frVal.trim();
      }
    }

    // Default / Fallback to Arabic or primary field
    const arVal =
      item[`${field}Ar`] ||
      item[`${field}_ar`] ||
      item[field] ||
      (field === 'badge' ? item.badgeText : undefined) ||
      (fallbackField ? item[fallbackField] : '');

    return (arVal && typeof arVal === 'string' ? arVal.trim() : '') || '';
  };

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        t,
        getLocalized,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
