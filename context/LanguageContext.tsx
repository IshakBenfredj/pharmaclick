"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "ar" | "fr" | "en";

export interface LanguageContextType {
  language: SupportedLanguage;
  direction: "rtl" | "ltr";
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  getLocalized: (item: any, field: string, fallbackField?: string) => string;
}

const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  ar: {
    // Header & Navigation
    deliveryBadge: "توصيل سريع وموثوق إلى 69 ولاية في الجزائر 🇩🇿",
    customerService: "خدمة الزبائن",
    logoSlogan: "صحتك بنقرة واحدة",
    searchPlaceholder:
      "ابحث عن مستحضرات عناية، فيتامينات، واقيات شمس، ماركات...",
    searchButton: "بحث",
    trackOrder: "تتبع طلبيتي",
    trackOrderSub: "تابع طلبك",
    cart: "السلة",
    home: "الرئيسية",
    allProducts: "كل المنتجات",
    allCategories: "كافة التصنيفات",
    certifiedBrands: "الماركات المعتمدة",
    offersAndDiscounts: "العروض والتخفيضات",
    contactUs: "تواصل معنا",
    quickSuggestions: "عمليات البحث الأكثر شيوعاً:",
    liveSearchResults: "نتائج البحث الفوري",
    productUnit: "مستحضر",
    viewAllResults: "عرض كافة النتائج لـ",
    noResults: "لم نجد مستحضرات تطابق",
    currency: "دج",
    discoverNow: "اكتشف الآن",
    shopNow: "تسوق الآن",
    inStock: "متوفر بالمخزون",
    outOfStock: "غير متوفر حالياً",
    addToCart: "أضف للسلة",
    viewProduct: "عرض التفاصيل",
    bestSellers: "الأكثر طلباً",
    shopByCategory: "تسوق حسب الفئة",
    trust100Original: "منتجات أصلية 100%",
    trust69Wilayas: "توصيل لـ 69 ولاية",
    trustCod: "دفع عند الاستلام",
    trustSupport: "استشارة متخصصة",
    usageTab: "طريقة وإرشادات الاستخدام",
    warningsTab: "التحذيرات وموانع الاستعمال",
    detailsTab: "المواصفات والتركيبة",

    // Hero Section
    heroPriorityBadge:
      "عنايتك وصحتك أولويتنا • Your Health & Beauty, Our Priority",
    heroTitle: "راحتك وعافيتك، تصلك حتى باب بيتك.",
    heroTitlePrefix: "راحتك وعافيتك، ",
    heroTitleHighlight: "تصلك حتى باب بيتك.",
    heroDesc:
      "مستحضرات عناية ومنتجات صحية أصلية 100%، ماركات عالمية ومحلية موثوقة ورعاية متكاملة تصلك أينما كنت في الجزائر مع خدمة توصيل سريعة لكافة الـ 69 ولاية.",
    heroShopNow: "تسوق المنتجات الآن",
    heroOffers: "العروض والتخفيضات",
    heroContact: "تواصل معنا",
    heroSocialProof: "أكثر من 10,000+ زبون يثق بنا",
    heroReviewsCount: "(+2,500 تقييم حقيقي)",
    heroFloatingOriginal: "منتجات أصلية 100%",
    heroFloatingLabs: "مباشرة من كبرى المخابر المعتمدة",
    heroFloatingVerified: "أصلية ومفحوصة 100%",
    heroFloatingStore: "متجر PharmaClick المعتمد",
    heroFloatingTagline: "خدمة متخصصة ومستحضرات موثوقة",
    heroFloatingShipping: "توصيل سريع لـ 69 ولاية",
    heroFloatingShippingSub: "مستحضرات العناية والمنتجات المعتمدة",
    heroQuickSkincare: "العناية بالبشرة",
    heroQuickHaircare: "العناية بالشعر",
    heroQuickVitamins: "الفيتامينات",
    catSunProtection: "واقيات الشمس",

    // Value Proposition Bar
    propFastDelivery: "توصيل سريع ومضمون",
    propFastDeliverySub: "في الموعد لكافة الولايات الـ 69",
    propSecurePayment: "دفع آمن عند الاستلام",
    propSecurePaymentSub: "100% راحة وموثوقية في الدفع",
    propEasyReturn: "إرجاع واستبدال مرن",
    propEasyReturnSub: "ضمان سلامة وجودة كل منتج",
    propSupport77: "دعم متخصص 7/7",
    propSupport77Sub: "نحن في خدمتكم دائماً للإجابة",

    // Categories Section
    catSectionTitle: "تسوق حسب الفئة",
    catSectionSub: "اكتشف منتجاتنا المصنفة بعناية لتلبية كافة احتياجاتك",
    catViewAll: "عرض جميع الأقسام",
    catItems: "منتج",

    // Best Sellers Section
    bestSellersTitle: "الأكثر طلباً (Best Sellers)",
    bestSellersSub: "المنتجات الأكثر مبيعاً وثقة من قبل زبائننا في الجزائر",
    viewAll: "عرض الكل",

    // 69 Wilayas Delivery Banner
    banner69Title: "مستحضرات العناية والصحة الأصلية حتى باب منزلك",
    banner69Sub:
      "تصفح آلاف المستحضرات المعتمدة من كبرى الماركات العالمية والمحلية في العناية بالبشرة والشعر، الفيتامينات، ومستلزمات الأم والطفل مع إمكانية الدفع عند الاستلام.",
    banner69Badge1: "توصيل سريع ومضمون",
    banner69Badge2: "تغطية كاملة لكافة الـ 69 ولاية في الجزائر 🇩🇿",
    banner69Browse: "تصفح كافة الأقسام",
    banner69Contact: "تواصل مع فريق الدعم",
    banner69QualityBadge: "أصالة وجودة مضمونة 100%",
    banner69QualitySub:
      "كافة المنتجات أصلية ومطابقة لأعلى معايير السلامة والمواصفات المعتمدة",

    // Services Section
    servicesTitle: "خدمات العناية والتسوق المعتمد",
    servicesSub: "حلول رقمية متكاملة لراحتك وسلامة عائلتك",
    service1Title: "استشارة عناية مباشرة",
    service1Desc:
      "تحدث مع مستشار العناية عبر واتساب أو الهاتف لمساعدتك في اختيار الروتين المناسب لبشرتك.",
    service1Btn: "تحدث معنا الآن",
    service2Title: "توصيل لـ 69 ولاية",
    service2Desc:
      "شحن سريع وموثوق يصلك حتى باب منزلك أو عبر مكاتب التوزيع في جميع ولايات الوطن دون استثناء.",
    service2Btn: "تفاصيل الشحن والتوصيل",
    service3Title: "أصالة وجودة مضمونة 100%",
    service3Desc:
      "نضمن لك مستحضرات معتمدة ومفحوصة مخبرياً مستوردة مباشرة من الوكلاء والموزعين الرسميين.",
    service3Btn: "استكشف الماركات المعتمدة",
    service4Title: "دفع آمن عند الاستلام",
    service4Desc:
      "تسوق بكل راحة واطمئنان؛ ادفع نقداً بعد استلام طلبيتك ومعاينة المنتجات بكل شفافية.",
    service4Btn: "الأسئلة الشائعة",
    certStoreBadge: "متجر إلكتروني معتمد رسمياً في الجزائر",
    certCoverageBadge: "تغطية توصيل لـ 69 ولاية",
    certLabBadge: "100% منتجات مخبرية أصلية",
    certPaymentBadge: "خيارات دفع متعددة وآمنة",

    // Newsletter & PWA
    newsTitle: "اشترك في نشرتنا البريدية وتصلك أحدث العروض",
    newsSub:
      "احصل على تخفيضات حصرية ونصائح عناية أسبوعية من فريقنا مباشرة في بريدك.",
    newsPlaceholder: "أدخل بريدك الإلكتروني...",
    newsButton: "اشتراك",
    newsSubscribed: "تم الاشتراك ✓",
    pwaBadge: "تطبيق PWA قابل للتثبيت",
    pwaTitle: "ثبّت متجر PharmaClick على هاتفك",
    pwaSub:
      "تصفح بسرعة فائقة وبدون حاجة للتحميل من Google Play أو App Store، واطلب مستحضراتك بنقرة واحدة.",
    pwaInstallBtn: "تثبيت التطبيق على الشاشة الرئيسية",

    // Footer
    footerAbout:
      "منصتكم الرقمية المعتمدة في الجزائر. نجمع بين أحدث معايير التجارة الإلكترونية وخدمات الرعاية الصحية المتخصصة لتلبية احتياجاتكم الجمالية والوقائية.",
    footerQuickLinks: "روابط سريعة",
    footerCustomerService: "خدمة الزبائن والسياسات",
    footerContactCol: "خدمة العملاء والتواصل",
    footerAddress: "متجر PharmaClick الإلكتروني، الجزائر",
    footerHours: "السبت - الخميس: 08:30 إلى 20:30",
    footerFriday: "الجمعة: خدمة الدعم عبر واتساب",
    footerCopyright:
      "جميع الحقوق محفوظة © 2026 PharmaClick - وجهتك المعتمدة للصحة والعناية.",
    footerSkincare: "مستحضرات العناية بالبشرة",
    footerShippingPolicy: "سياسة الشحن والتوصيل",
    footerPrivacyPolicy: "سياسة الخصوصية وأمان البيانات",
    footerTerms: "شروط الاستخدام والبيع",
    footerFaq: "الأسئلة الشائعة",
    footerTrackOrder: "تتبع حالة الطلب",

    // Cart Page
    cartTitle: "سلة المشتريات",
    cartEmptyTitle: "سلة مشترياتك فارغة حالياً",
    cartEmptySub: "تصفح تشكيلتنا المتنوعة وأضف مستحضراتك المفضلة",
    cartContinueShopping: "متابعة التسوق",
    cartClearAll: "إفراغ السلة بالكامل",
    cartOrderSummary: "ملخص الطلبية",
    cartSubtotal: "المجموع الفرعي للمنتجات",
    cartShippingFee: "تكلفة الشحن والتوصيل",
    cartTotal: "المجموع الكلي النهائي",
    cartCheckoutBtn: "متابعة تأكيد الطلب",
    cartDeliveryLocation: "تقدير الشحن حسب الولاية",
    cartHomeDelivery: "توصيل لباب المنزل",
    cartDeskDelivery: "استلام من مكتب التوزيع",
    cartFreeShippingProgress: "أضف بقيمة",
    cartFreeShippingEarned: "مبروك! لقد حصلت على شحن مجاني!",

    // Checkout Page
    checkoutTitle: "تأكيد الطلبية والشحن",
    checkoutPersonalTitle: "1. المعلومات الشخصية والتواصل",
    checkoutFullName: "الاسم واللقب الكامل",
    checkoutPhone: "رقم الهاتف الأساسي",
    checkoutAltPhone: "رقم هاتف احتياطي (اختياري)",
    checkoutAddressTitle: "2. عنوان الشحن والتوصيل",
    checkoutWilaya: "الولاية (من بين الـ 69 ولاية)",
    checkoutCommune: "البلدية",
    checkoutStreet: "العنوان بالتفصيل / الحي / رقم المنزل",
    checkoutNotes: "ملاحظات إضافية للتوصيل (اختياري)",
    checkoutCodNotice:
      "الدفع عند الاستلام: الدفع نقداً بعد استلام ومعاينة طلبيتك.",
    checkoutConfirmBtn: "تأكيد وإرسال الطلبية الآن",
    footerDeliveryDesk: "لباب منزلك أو إلى أقرب مكتب توزيع",
    footerNationalCoverage: "تغطية وطنية شاملة مع الدفع عند الاستلام",
    footerSupportTeam: "فريق دعم صحي متخصص للإجابة عن أسئلتكم",
    discount: "خصم",
    all: "الكل",
    onlyInStock: "المتوفر فقط",
    onlyDiscounts: "العروض فقط",
    sortBy: "ترتيب:",
    sortFeatured: "المميزة",
    sortPriceAsc: "السعر: من الأقل للأعلى",
    sortPriceDesc: "السعر: من الأعلى للأقل",
    sortDiscount: "أعلى نسبة خصم",
    productsDisplayed: "المنتجات المعروضة:",
    resetFilters: "إلغاء الفلاتر",
    allProductsSub:
      "اكتشف تشكيلتنا الشاملة من مستحضرات العناية بالبشرة والشعر، الفيتامينات، والمكملات الغذائية من أشهر المخابر العالمية الأصلية 100%.",
    cartEmptyDesc:
      "لم تقم بإضافة أي مستحضرات بعد. تصفح تشكيلتنا الواسعة من منتجات العناية بالبشرة، الشعر، والمكملات الغذائية الأصلية 100%.",
    cartItemsCount: "مستحضر",
    checkoutEmailOptional: "البريد الإلكتروني (اختياري للإشعار)",
    checkoutDeliveryType: "طريقة الاستلام والتوصيل",
    checkoutOrderItems: "المنتجات في الطلبية",
    checkoutPlacingOrder: "جاري إرسال وتأكيد الطلبية...",
    checkoutSuccessTitle: "تم استلام وتأكيد طلبيتك بنجاح!",
    checkoutOrderNumber: "رقم الطلبية",
    pwaInstallAlert:
      "يمكنك تثبيت التطبيق مباشرة عبر قائمة المتصفح (إضافة إلى الشاشة الرئيسية)",
    free: "مجاناً",

    // Brands Page
    brandsTitle: "أشهر الماركات الطبية والجلدية",
    brandsSub: "الماركات والعلامات التجارية المعتمدة",
    brandsDesc:
      "نحن نوفر مستحضرات معتمدة 100% مباشرة من الوكلاء والمصنعين الرسميين، لنضمن لك أعلى معايير الجودة والأمان لبشرتك وصحتك.",
    browseProducts: "استعراض المنتجات",
    certifiedProductsCount: "مستحضر معتمد",
    partnersLabs: "شراكات ومخابر عالمية معتمدة",

    // Offers Page
    offersTitle: "عناية فائقة بأسعار أحلى",
    offersSub: "العروض والتخفيضات",
    offersBannerBadge: "تخفيضات معتمدة لفترة محدودة",
    offersBannerDesc:
      "وفر حتى 20% على أشهر المستحضرات المعتمدة من أكبر الماركات العالمية (La Roche-Posay, Eucerin, Vichy) مع توصيل مباشر لكافة ولايات الجزائر الـ 69.",
    activeDiscountsCount: "مستحضرات مخفضة متوفرة حالياً:",
    specialOffer: "عرض خاص",

    // Categories Page & Visual Filter
    categoriesCatalog: "دليل التصنيفات المعتمد",
    categoriesBrowseByCat: "تصفح مستحضراتك حسب القسم",
    categoriesHeroDesc:
      "استكشف تشكيلات متكاملة من مستحضرات العناية والجمال والمكملات الغذائية والأجهزة شبه الطبية، مع ضمان أصالة المنتجات وتوصيل سريع لكافة الـ 69 ولاية.",
    subcategories: "الفئات الفرعية:",
    exploreProductsOf: "استكشف منتجات",
    totalProductsAvailable: "إجمالي المستحضرات المتوفرة:",
    browseAndFilterVisual: "تصفح الأقسام والفلترة بالصور",
    clickToFilterInstant: "انقر على أي قسم لتصفية النتائج فوراً",
    generalProducts: "المستحضرات العامة",
    mainDepartment: "(الأساسي)",
    filterActive: "الفلتر:",
    searchByNameOrBrand: "ابحث بالاسم أو الماركة...",
    sortPopular: "الأكثر طلباً",
    sortRating: "الأعلى تقييماً",
    noProductsMatchFilter: "لا توجد مستحضرات تطابق الفلتر المحدد حالياً",
    resetFilterAll: "عرض كافة منتجات",
    clearFilter: "إلغاء الفلتر",

    // Product Details & Reviews
    shareProduct: "مشاركة رابط المستحضر",
    linkCopied: "تم نسخ الرابط!",
    officialPrice: "السعر المعتمد:",
    youSaved: "وفرت في هذا العرض",
    choose: "اختر",
    addedToCartSuccess: "✓ تمت إضافة المستحضر إلى سلة مشترياتك بنجاح!",
    officialLabs: "من المخابر المعتمدة رسمياً",
    brandLabel: "العلامة التجارية:",
    categoryLabel: "التصنيف:",
    volumeLabel: "الحجم أو العبوة:",
    stockStatus: "حالة التوفر بالمخزون:",
    inStockImmediate: "متوفر فوري",
    units: "قطعة",
    relatedProductsTitle: "مستحضرات مشابهة قد تهمك",
    viewMore: "مشاهدة المزيد",

    // Cart Page & Drawer
    itemsInYourCart: "مستحضر في سلتك",
    cartEmptyNow: "سلتك فارغة حالياً",
    closeCart: "إغلاق السلة",
    freeShippingCongrat: "تهانينا! حصلت على توصيل مجاني لكافة الـ 69 ولاية 🎉",
    browseProductsBtn: "تصفح المنتجات",
    deleteItem: "حذف",
    calculatedAtCheckout: "يحسب في صفحة الدفع",
    viewCartDetails: "عرض تفاصيل السلة",
    drawerCheckoutBtn: "متابعة إتمام الطلب (الدفع عند الاستلام)",
    perItem: "للقطعة",
    checkoutSubmitBtn: "تأكيد الطلب الآن",
    checkoutSubmitting: "جاري تسجيل وتأكيد الطلب...",

    // Checkout Success Page
    orderSuccessTitle: "تم استلام طلبك وتأكيده بنجاح! 🎉",
    orderSuccessDesc:
      "شكراً لثقتك في متجرنا. تم تسجيل طلبيتك بنجاح وجاري تحضيرها للشحن إلى ولاية",
    orderRefNumber: "رقم طلبك المرجعي:",
    copyOrderNumber: "نسخ رقم الطلب",
    copied: "تم النسخ",
    copy: "نسخ",
    totalAmountCod: "المبلغ الإجمالي للدفع عند الاستلام:",
    whatHappensNext: "ما الذي سيحدث بعد ذلك؟",
    step1PhoneTitle: "اتصال هاتفي للتأكيد:",
    step1PhoneDesc:
      "سيتواصل معك أحد ممثلي خدمة العملاء هاتفياً خلال ساعات لتأكيد عنوان التسليم بدقة.",
    step2ShippingTitle: "تجهيز الطرد والشحن:",
    step2ShippingDesc: "يتم تغليف المنتجات بعناية وتسليمها لشركة التوصيل.",
    step3CodTitle: "الدفع عند الاستلام (COD):",
    step3CodDesc: "تدفع المبلغ نقدًا لعون التوصيل فقط عند استلام طردك وتفقده.",
    trackOrderStatus: "تتبع حالة طلبيتك",
    backToShopping: "العودة للتسوق",

    // Track Page
    trackOrderTitle: "تتبع حالة طلبيتك خطوة بخطوة",
    trackOrderDesc:
      "أدخل رقم الطلب المرجعي ورقم الهاتف المسجل لمعرفة المسار اللحظي لشحنتك وتاريخ الوصول المتوقع لكافة الـ 69 ولاية.",
    trackOrderRefInput: "رقم الطلب المرجعي (مثال: ORD-2026-XXXX)",
    trackPhoneInput: "رقم الهاتف المسجل عند الطلب",
    trackSubmitBtn: "تتبع مسار الطلب",
    trackingSearching: "جاري البحث عن طلبيتك...",
    orderFound: "تفاصيل الشحنة والمسار",
    orderNotFound: "لم نتمكن من العثور على هذا الطلب",

    // FAQ Page
    faqTitle: "الأسئلة الشائعة حول متجر PharmaClick",
    faqSub:
      "جمعنا لكم أهم الأسئلة والإجابات حول الشحن لـ 69 ولاية، الدفع عند الاستلام، أصالة المنتجات، وطرق متابعة طلباتكم بكل وضوح وشفافية.",
    faqBadge: "إجابات واضحة لكل ما يهمك",
    allQuestions: "جميع الأسئلة",

    // Brands Page
    brandsAvailableToBuy: "مستحضر معتمد متاح للشراء",
    brandsNoProds: "لا توجد مستحضرات معروضة حالياً لهذه العلامة التجارية.",
    brandsBackAll: "العودة لجميع الماركات",
    brandsBreadcrumb: "الماركات",

    // Offers Page
    offersSortBy: "ترتيب حسب:",
    offersSortMaxDiscount: "الأعلى خصماً (%)",
    offersSortPriceAsc: "السعر: من الأقل للأعلى",
    offersSortPriceDesc: "السعر: من الأعلى للأقل",
    offersSortPopular: "الأكثر طلباً",

    // Search Page
    searchBreadcrumb: "البحث والفلترة",
    searchPageTitle: "البحث في المتجر والمستحضرات المعتمدة",
    searchPageSub: "ابحث بالاسم، الماركة، أو التركيبة لتصفية النتائج فوراً",
    searchPlaceholderLong:
      "اكتب اسم المستحضر، الماركة (مثل CeraVe, Eucerin)، أو نوع العلاج...",
    filterOptions: "خيارات التصفية",
    searchResetBtn: "إعادة ضبط",
    byCategory: "حسب التصنيف:",
    byBrand: "العلامة التجارية:",
    maxPrice: "الحد الأقصى للسعر:",
    onlyInStockFilter: "عرض المنتجات المتوفرة فقط",
    searchFoundCountPrefix: "تم العثور على",
    searchFoundCountSuffix: "مستحضر مطابق",
    sortFeaturedRating: "المميزة والأعلى تقييماً",
    searchNoResultsTitle: "لم تعثر على المستحضر الذي تبحث عنه؟",
    searchNoResultsDesc:
      "لا تقلق! يمكنك التواصل معنا مباشرة وسيقوم فريق الدعم بمساعدتك في العثور على ما تحتاجه وتوفيره لك بأسرع وقت.",
    searchWhatsappBtn: "تواصل معنا عبر الواتساب",
    searchShowAllBtn: "عرض جميع المستحضرات",
    searchLoadingResults: "جاري تحميل نتائج البحث...",
    exclusiveOffer: "عرض حصري",

    // Track Order Page
    trackWilayasBadge: "تتبع شحنتك المباشرة للـ 69 ولاية",
    trackOrderRequiredErr:
      "يرجى إدخال رقم الطلب المرجعي (مثال: ORD-2026-123456)",
    trackPhoneRequiredErr:
      "يرجى إدخال رقم الهاتف المسجل لتأكيد هويتك والتحقق من الطلب",
    trackRefDetails: "تفاصيل الطلبية المرجعية:",
    trackOrderDate: "تاريخ الطلب:",
    trackTimelineTitle: "مسار تقدم الطلبية والشحن",
    trackDeliveryDestination: "وجهة التوصيل",
    trackWilaya: "ولاية",
    trackCommune: "البلدية:",
    trackAddress: "العنوان:",
    trackDeliveryType: "نوع الاستلام:",
    trackHomeDelivery: "توصيل لباب المنزل",
    trackDeskDelivery: "مكتب التوزيع",
    trackStopDesk: "مكتب شركة التوصيل (Stop Desk)",
    trackPaymentSummary: "الدفع والمبلغ الإجمالي",
    trackSubtotal: "المجموع الفرعي:",
    trackShippingFee: "رسوم التوصيل:",
    trackCodAmount: "المبلغ للدفع عند الاستلام:",
    trackCodNotice: "✓ الدفع نقداً عند استلام الطرد",
    trackPackageContents: "محتويات الطرد",
    trackQuantity: "الكمية:",
    trackNeedHelpTitle: "هل تحتاج لتعديل عنوان التوصيل أو لديك استفسار؟",
    trackNeedHelpSub: "فريق خدمة العملاء متواجد لمساعدتك يومياً",
    trackContactSupport: "تواصل مع الدعم",
    statusPending: "قيد الانتظار والمراجعة",
    statusConfirmed: "تم التأكيد هاتفياً",
    statusProcessing: "قيد التجهيز والتغليف",
    statusShipped: "في طريق التوصيل",
    statusDelivered: "تم التسليم بنجاح",
    statusCancelled: "تم إلغاء الطلب",

    // FAQ Page
    faqHeading: "الأسئلة الشائعة حول متجر PharmaClick",
    faqHeroDesc:
      "جمعنا لكم أهم الأسئلة والإجابات حول الشحن لـ 69 ولاية، الدفع عند الاستلام، أصالة المنتجات، وطرق متابعة طلباتكم بكل وضوح وشفافية.",
    faqNotFoundTitle: "لم تجد الإجابة التي تبحث عنها؟",
    faqNotFoundDesc:
      "فريق دعم PharmaClick جاهز لمساعدتك مباشرة عبر واتساب أو الهاتف.",
    faqWhatsappBtn: "محادثة واتساب مباشرة",
    faqContactPageBtn: "صفحة الاتصال",
    faqCatAll: "جميع الأسئلة",
    faqCatShipping: "الشحن والتوصيل (69 ولاية)",
    faqCatPayment: "الدفع والأسعار",
    faqCatQuality: "الأصالة والجودة",
    faqCatOrders: "الطلبات والاستبدال",
    faqCatSupport: "خدمة العملاء",

    // Contact Page
    contactBreadcrumb: "اتصل بنا وخدمة العملاء",
    contactHeroTitle: "تواصل مع متجر PharmaClick",
    contactHeroDesc:
      "نسعد دائماً بالإجابة عن استفساراتكم ومساعدتكم في اختيار أفضل مستحضرات العناية والتجميل المعتمدة، مع متابعة فورية لطلبياتكم في جميع الولايات الـ 69.",
    contactSupportAlways: "فريق الدعم في خدمتكم دائماً",
    contactFormTitle: "أرسل لنا رسالة مباشرة",
    contactFormSub:
      "املأ النموذج أدناه وسيقوم فريق الدعم بالرد عليك في أقرب وقت عبر الهاتف أو البريد.",
    contactSuccessTitle: "تم إرسال رسالتك بنجاح!",
    contactSuccessDesc:
      "شكراً لتواصلك مع PharmaClick. تم استلام رسالتك وسيتواصل معك مستشار خدمة العملاء قريباً.",
    contactSendAnother: "إرسال رسالة أخرى",
    contactFullName: "الاسم الكامل",
    contactFullNamePlaceholder: "أدخل اسمك الكامل...",
    contactPhone: "رقم الهاتف",
    contactWilayaLabel: "الولاية (69 ولاية)",
    contactChooseWilaya: "اختر ولايتك...",
    contactSubject: "موضوع الاستفسار",
    contactSubjectPlaceholder: "طلب منتج، متابعة شحن، استفسار...",
    contactMessage: "الرسالة أو تفاصيل الطلب",
    contactMessagePlaceholder:
      "اكتب استفسارك أو تفاصيل المنتجات التي تبحث عنها...",
    contactSendBtn: "إرسال الرسالة الآن",
    contactSubmitting: "جاري الإرسال...",
    contactWhatsappTitle: "تواصل فوري عبر الواتساب",
    contactWhatsappDesc:
      "احصل على رد سريع ومباشر من فريق الدعم للإجابة عن أسئلتكم ومساعدتكم في الطلب فوراً.",
    contactWhatsappBtn: "محادثة واتساب مباشرة",
    contactPhoneTitle: "الهاتف وخدمة الزبائن",
    contactPhoneAvail: "متاح طوال أيام العمل الرسمية",
    contactHoursTitle: "أوقات العمل والدعم",
    contactHoursVal: "السبت - الخميس: 08:30 صباحاً إلى 20:30 مساءً",
    contactFridayVal: "الجمعة: خدمة العملاء متاحة عبر الواتساب",
    contactCoverageTitle: "نطاق التوصيل والشحن",
    contactCoverageVal: "توصيل سريع وموثوق لكافة الـ 69 ولاية",
    contactCoverageSub: "الدفع عند الاستلام نقداً (COD) حتى باب المنزل",
    contactQualityTitle: "ضمان الجودة والأصالة",
    contactQualityVal: "100% مستحضرات أصلية ومطابقة للمواصفات",
    contactQualitySub: "مستوردة ومعتمدة من الوكلاء والموزعين الرسميين",
    contactFormValidation: "يرجى ملء الاسم ورقم الهاتف ونص الرسالة.",
  },

  fr: {
    // Header & Navigation
    deliveryBadge: "Livraison rapide et fiable vers 69 wilayas en Algérie 🇩🇿",
    customerService: "Service Client",
    logoSlogan: "Votre santé en un clic",
    searchPlaceholder:
      "Rechercher soins, vitamines, protections solaires, marques...",
    searchButton: "Rechercher",
    trackOrder: "Suivi de commande",
    trackOrderSub: "Suivre mon colis",
    cart: "Panier",
    home: "Accueil",
    allProducts: "Tous les produits",
    allCategories: "Toutes les catégories",
    certifiedBrands: "Marques certifiées",
    offersAndDiscounts: "Offres & Promos",
    contactUs: "Contactez-nous",
    quickSuggestions: "Recherches fréquentes :",
    liveSearchResults: "Résultats de recherche",
    productUnit: "produit(s)",
    viewAllResults: "Voir tous les résultats pour",
    noResults: "Aucun produit ne correspond à",
    currency: "DA",
    discoverNow: "Découvrir",
    shopNow: "Acheter maintenant",
    inStock: "En stock",
    outOfStock: "Rupture de stock",
    addToCart: "Ajouter au panier",
    viewProduct: "Voir le produit",
    bestSellers: "Meilleures Ventes",
    shopByCategory: "Acheter par catégorie",
    trust100Original: "100% Produits Authentiques",
    trust69Wilayas: "Livraison 69 Wilayas",
    trustCod: "Paiement à la livraison",
    trustSupport: "Conseils experts 7j/7",
    usageTab: "Conseils d'utilisation",
    warningsTab: "Précautions & Avertissements",
    detailsTab: "Composition & Caractéristiques",

    // Hero Section
    heroPriorityBadge: "Votre santé & beauté, notre priorité • PharmaClick",
    heroTitle: "Votre bien-être et vos soins, livrés directement chez vous.",
    heroTitlePrefix: "Votre bien-être et vos soins, ",
    heroTitleHighlight: "livrés chez vous.",
    heroDesc:
      "Soins dermatologiques et produits de santé 100% authentiques, marques mondiales et locales de confiance livrées partout en Algérie avec expédition express vers les 69 wilayas.",
    heroShopNow: "Découvrir nos produits",
    heroOffers: "Offres & Promos",
    heroContact: "Nous contacter",
    heroSocialProof: "Plus de 10 000+ clients satisfaits",
    heroReviewsCount: "(+2 500 avis vérifiés)",
    heroFloatingOriginal: "100% Authentique",
    heroFloatingLabs: "Directement des laboratoires officiels",
    heroFloatingVerified: "Certifié & Contrôlé 100%",
    heroFloatingStore: "Boutique PharmaClick Agréée",
    heroFloatingTagline: "Conseils experts & produits garantis",
    heroFloatingShipping: "Livraison 69 Wilayas",
    heroFloatingShippingSub: "Soins et compléments certifiés",
    heroQuickSkincare: "Soins du Visage",
    heroQuickHaircare: "Soins Capillaires",
    heroQuickVitamins: "Vitamines",
    catSunProtection: "Protections Solaires",

    // Value Proposition Bar
    propFastDelivery: "Livraison rapide & garantie",
    propFastDeliverySub: "À temps vers les 69 wilayas",
    propSecurePayment: "Paiement à la livraison",
    propSecurePaymentSub: "100% serein et sans risque",
    propEasyReturn: "Retours faciles & flexibles",
    propEasyReturnSub: "Garantie de qualité sur chaque article",
    propSupport77: "Conseils experts 7j/7",
    propSupport77Sub: "À votre disposition par WhatsApp & téléphone",

    // Categories Section
    catSectionTitle: "Acheter par catégorie",
    catSectionSub:
      "Découvrez notre sélection organisée pour répondre à toutes vos envies",
    catViewAll: "Tous les rayons",
    catItems: "produits",

    // Best Sellers Section
    bestSellersTitle: "Meilleures Ventes (Best Sellers)",
    bestSellersSub:
      "Les articles les plus demandés et recommandés par nos clients",
    viewAll: "Voir tout",

    // 69 Wilayas Delivery Banner
    banner69Title: "Vos soins et produits authentiques livrés à votre porte",
    banner69Sub:
      "Explorez des milliers de références vérifiées auprès des plus grands laboratoires mondiaux et locaux, avec paiement facile à la réception.",
    banner69Badge1: "Livraison express assurée",
    banner69Badge2: "Couverture intégrale des 69 wilayas en Algérie 🇩🇿",
    banner69Browse: "Tous les rayons",
    banner69Contact: "Contacter notre équipe",
    banner69QualityBadge: "100% Qualité et authenticité",
    banner69QualitySub:
      "Chaque référence répond aux normes de sécurité et de conformité",

    // Services Section
    servicesTitle: "Nos Services & Accompagnement",
    servicesSub: "Des solutions numériques complètes pour votre sérénité",
    service1Title: "Conseils personnalisés en direct",
    service1Desc:
      "Échangez avec nos conseillers via WhatsApp ou téléphone pour choisir la routine idéale.",
    service1Btn: "Discuter maintenant",
    service2Title: "Livraison 69 Wilayas",
    service2Desc:
      "Expédition rapide et fiable à domicile ou en point relais dans toute l’Algérie sans exception.",
    service2Btn: "Conditions de livraison",
    service3Title: "100% Produits Authentiques",
    service3Desc:
      "Produits testés et conformes, issus directement des distributeurs et laboratoires officiels.",
    service3Btn: "Découvrir nos marques",
    service4Title: "Paiement à la livraison",
    service4Desc:
      "Commandez en toute confiance et réglez en espèces après inspection de votre colis.",
    service4Btn: "Foire aux questions",
    certStoreBadge: "Boutique en ligne officiellement agréée en Algérie",
    certCoverageBadge: "Livraison vers 69 wilayas",
    certLabBadge: "100% Produits de laboratoires certifiés",
    certPaymentBadge: "Paiement sécurisé et transparent",

    // Newsletter & PWA
    newsTitle: "Abonnez-vous à notre newsletter et profitez des promotions",
    newsSub:
      "Bénéficiez de remises exclusives et de nos conseils hebdomadaires dans votre boîte mail.",
    newsPlaceholder: "Entrez votre adresse email...",
    newsButton: "S'inscrire",
    newsSubscribed: "Inscrit ✓",
    pwaBadge: "Application PWA installable",
    pwaTitle: "Installez PharmaClick sur votre téléphone",
    pwaSub:
      "Accès ultra-rapide sans téléchargement lourd, commandez vos soins en un clic.",
    pwaInstallBtn: "Ajouter à l'écran d'accueil",

    // Footer
    footerAbout:
      "Votre plateforme de référence en Algérie. Nous combinons e-commerce moderne et expertise santé pour répondre à tous vos besoins bien-être.",
    footerQuickLinks: "Liens Rapides",
    footerCustomerService: "Service Client & Politiques",
    footerContactCol: "Contact & Horaires",
    footerAddress: "Boutique PharmaClick en ligne, Algérie",
    footerHours: "Samedi - Jeudi : 08h30 à 20h30",
    footerFriday: "Vendredi : Support par WhatsApp",
    footerCopyright:
      "Tous droits réservés © 2026 PharmaClick - Votre destination santé et soins.",
    footerSkincare: "Soins du Visage & Corps",
    footerShippingPolicy: "Politique d’expédition et livraison",
    footerPrivacyPolicy: "Confidentialité et protection des données",
    footerTerms: "Conditions générales d’utilisation et de vente",
    footerFaq: "Foire Aux Questions (FAQ)",
    footerTrackOrder: "Suivre ma commande en ligne",

    // Cart Page
    cartTitle: "Mon Panier",
    cartEmptyTitle: "Votre panier est actuellement vide",
    cartEmptySub: "Découvrez notre sélection et ajoutez vos soins favoris",
    cartContinueShopping: "Continuer mes achats",
    cartClearAll: "Vider le panier",
    cartOrderSummary: "Récapitulatif de commande",
    cartSubtotal: "Sous-total des articles",
    cartShippingFee: "Frais de livraison estimés",
    cartTotal: "Total TTC à payer",
    cartCheckoutBtn: "Passer la commande",
    cartDeliveryLocation: "Estimation de livraison par wilaya",
    cartHomeDelivery: "Livraison à domicile",
    cartDeskDelivery: "Point relais / Bureau",
    cartFreeShippingProgress: "Ajoutez encore",
    cartFreeShippingEarned: "Félicitations ! Livraison gratuite obtenue !",

    // Checkout Page
    checkoutTitle: "Validation de la commande",
    checkoutPersonalTitle: "1. Informations personnelles & Contact",
    checkoutFullName: "Nom et prénom complet",
    checkoutPhone: "Numéro de téléphone principal",
    checkoutAltPhone: "Numéro secondaire (optionnel)",
    checkoutAddressTitle: "2. Adresse de livraison",
    checkoutWilaya: "Wilaya (parmi les 69 wilayas)",
    checkoutCommune: "Commune",
    checkoutStreet: "Adresse détaillée (Rue, Quartier, N°)",
    checkoutNotes: "Instructions particulières pour la livraison",
    checkoutCodNotice:
      "Paiement à la livraison : Vous réglez en espèces à la réception de votre colis.",
    checkoutConfirmBtn: "Confirmer ma commande maintenant",
    footerDeliveryDesk:
      "À votre porte ou au bureau de distribution le plus proche",
    footerNationalCoverage: "Couverture nationale avec paiement à la livraison",
    footerSupportTeam: "Une équipe dédiée pour répondre à toutes vos questions",
    discount: "Promo",
    all: "Tous",
    onlyInStock: "En stock uniquement",
    onlyDiscounts: "Promotions uniquement",
    sortBy: "Trier :",
    sortFeatured: "En vedette",
    sortPriceAsc: "Prix : croissant",
    sortPriceDesc: "Prix : décroissant",
    sortDiscount: "Plus grande remise",
    productsDisplayed: "Produits affichés :",
    resetFilters: "Réinitialiser",
    allProductsSub:
      "Découvrez notre sélection complète de soins visage, cheveux et compléments alimentaires 100% authentiques.",
    cartEmptyDesc:
      "Vous n’avez pas encore ajouté de produits. Découvrez notre gamme de soins visage, cheveux et compléments 100% authentiques.",
    cartItemsCount: "produit(s)",
    checkoutEmailOptional: "Email (optionnel pour notification)",
    checkoutDeliveryType: "Mode de livraison",
    checkoutOrderItems: "Articles de la commande",
    checkoutPlacingOrder: "Confirmation en cours...",
    checkoutSuccessTitle: "Commande confirmée avec succès !",
    checkoutOrderNumber: "N° de commande",
    pwaInstallAlert:
      "Vous pouvez installer l'application directement depuis le menu de votre navigateur (Ajouter à l'écran d'accueil).",
    free: "Gratuit",

    // Brands Page
    brandsTitle: "Marques Médicales & Dermatologiques de Référence",
    brandsSub: "Marques et Laboratoires Certifiés",
    brandsDesc:
      "Nous proposons des produits 100% authentiques issus directement des distributeurs et laboratoires agréés, garantissant sécurité et efficacité.",
    browseProducts: "Voir les produits",
    certifiedProductsCount: "produit(s) certifié(s)",
    partnersLabs: "Partenariats & laboratoires agréés",

    // Offers Page
    offersTitle: "Prenez soin de vous aux meilleurs prix",
    offersSub: "Offres & Promotions",
    offersBannerBadge: "Promotions certifiées à durée limitée",
    offersBannerDesc:
      "Économisez jusqu’à 20% sur les soins des plus grands laboratoires (La Roche-Posay, Eucerin, Vichy) avec livraison directe vers les 69 wilayas.",
    activeDiscountsCount: "Produits en promotion actuellement :",
    specialOffer: "offre spéciale",

    // Categories Page & Visual Filter
    categoriesCatalog: "Guide officiel des rayons",
    categoriesBrowseByCat: "Explorez vos soins par rayon",
    categoriesHeroDesc:
      "Explorez une sélection complète de soins dermo-cosmétiques, vitamines et dispositifs certifiés avec livraison express vers les 69 wilayas.",
    subcategories: "Sous-catégories :",
    exploreProductsOf: "Découvrir les produits",
    totalProductsAvailable: "Total des références disponibles :",
    browseAndFilterVisual: "Filtrer par catégorie en images",
    clickToFilterInstant: "Cliquez sur un rayon pour filtrer",
    generalProducts: "Produits généraux",
    mainDepartment: "(Principal)",
    filterActive: "Filtre :",
    searchByNameOrBrand: "Rechercher par nom ou marque...",
    sortPopular: "Plus populaires",
    sortRating: "Mieux notés",
    noProductsMatchFilter: "Aucun produit ne correspond au filtre sélectionné",
    resetFilterAll: "Voir tous les produits de",
    clearFilter: "Effacer le filtre",

    // Product Details & Reviews
    shareProduct: "Partager le produit",
    linkCopied: "Lien copié !",
    officialPrice: "Prix certifié :",
    youSaved: "Vous économisez",
    choose: "Choisir",
    addedToCartSuccess: "✓ Produit ajouté avec succès à votre panier !",
    officialLabs: "Issu des laboratoires officiels",
    brandLabel: "Marque :",
    categoryLabel: "Rayon :",
    volumeLabel: "Contenance :",
    stockStatus: "Disponibilité :",
    inStockImmediate: "En stock immédiat",
    units: "pièces",
    relatedProductsTitle: "Produits similaires recommandés",
    viewMore: "Voir plus",

    // Cart Page & Drawer
    itemsInYourCart: "produit(s) dans votre panier",
    cartEmptyNow: "Votre panier est actuellement vide",
    closeCart: "Fermer le panier",
    freeShippingCongrat:
      "Félicitations ! Livraison gratuite vers 69 wilayas 🎉",
    browseProductsBtn: "Découvrir nos produits",
    deleteItem: "Supprimer",
    calculatedAtCheckout: "Calculé à la caisse",
    viewCartDetails: "Voir les détails du panier",
    drawerCheckoutBtn: "Commander (Paiement à la livraison)",
    perItem: "par pièce",

    checkoutSubmitBtn: "Confirmer la commande",
    checkoutSubmitting: "Enregistrement de la commande en cours...",

    // Checkout Success Page
    orderSuccessTitle: "Commande reçue et confirmée avec succès ! 🎉",
    orderSuccessDesc:
      "Merci de votre confiance. Votre commande est enregistrée et en cours de préparation pour la wilaya de",
    orderRefNumber: "Référence de votre commande :",
    copyOrderNumber: "Copier la référence",
    copied: "Copié",
    copy: "Copier",
    totalAmountCod: "Montant total à payer à la livraison :",
    whatHappensNext: "Quelles sont les prochaines étapes ?",
    step1PhoneTitle: "Confirmation téléphonique :",
    step1PhoneDesc:
      "Un conseiller du service client vous contactera par téléphone pour valider l’adresse exacte.",
    step2ShippingTitle: "Préparation et expédition :",
    step2ShippingDesc:
      "Vos articles sont soigneusement emballés et remis à la société de livraison.",
    step3CodTitle: "Paiement à la livraison (COD) :",
    step3CodDesc:
      "Vous réglez en espèces au livreur uniquement après réception et vérification de votre colis.",
    trackOrderStatus: "Suivre ma commande",
    backToShopping: "Continuer mes achats",

    // Track Page
    trackOrderTitle: "Suivi de commande pas à pas",
    trackOrderDesc:
      "Entrez votre numéro de commande et téléphone pour suivre l’état d’acheminement vers l’une des 69 wilayas.",
    trackOrderRefInput: "Référence de commande (ex: ORD-2026-XXXX)",
    trackPhoneInput: "Numéro de téléphone enregistré",
    trackSubmitBtn: "Rechercher mon colis",
    trackingSearching: "Recherche de votre commande en cours...",
    orderFound: "Détails et acheminement du colis",
    orderNotFound: "Impossible de trouver cette commande",

    // FAQ Page
    faqTitle: "Foire Aux Questions PharmaClick",
    faqSub:
      "Toutes les réponses à vos questions concernant la livraison dans 69 wilayas, le paiement à la livraison et l’authenticité des soins.",
    faqBadge: "Des réponses claires à vos questions",
    allQuestions: "Toutes les questions",

    // Brands Page
    brandsAvailableToBuy: "produit(s) certifié(s) disponible(s)",
    brandsNoProds: "Aucun produit disponible actuellement pour cette marque.",
    brandsBackAll: "Retour à toutes les marques",
    brandsBreadcrumb: "Marques",

    // Offers Page
    offersSortBy: "Trier par :",
    offersSortMaxDiscount: "Plus forte remise (%)",
    offersSortPriceAsc: "Prix : croissant",
    offersSortPriceDesc: "Prix : décroissant",
    offersSortPopular: "Plus populaires",

    // Search Page
    searchBreadcrumb: "Recherche & Filtres",
    searchPageTitle: "Rechercher dans le catalogue certifié",
    searchPageSub:
      "Recherchez par nom, marque ou actif pour trouver vos soins instantanément",
    searchPlaceholderLong: "Nom du soin, marque (ex: CeraVe, Eucerin)...",
    filterOptions: "Options de filtres",
    searchResetBtn: "Réinitialiser",
    byCategory: "Par catégorie :",
    byBrand: "Par marque :",
    maxPrice: "Prix maximum :",
    onlyInStockFilter: "En stock uniquement",
    searchFoundCountPrefix: "Trouvé",
    searchFoundCountSuffix: "produit(s) correspondant(s)",
    sortFeaturedRating: "En vedette & Mieux notés",
    searchNoResultsTitle: "Vous n’avez pas trouvé votre soin ?",
    searchNoResultsDesc:
      "Ne vous inquiétez pas ! Contactez-nous directement et notre équipe vous aidera à trouver et obtenir ce dont vous avez besoin.",
    searchWhatsappBtn: "Discuter sur WhatsApp",
    searchShowAllBtn: "Voir tous les produits",
    searchLoadingResults: "Chargement des résultats de recherche...",
    exclusiveOffer: "Offre exclusive",

    // Track Order Page
    trackWilayasBadge: "Suivi direct de votre colis vers les 69 wilayas",

    trackOrderRequiredErr:
      "Veuillez saisir le numéro de commande (ex: ORD-2026-123456)",
    trackPhoneRequiredErr:
      "Veuillez saisir votre numéro de téléphone pour vérifier votre commande",

    trackRefDetails: "Détails de la commande de référence :",
    trackOrderDate: "Date de commande :",
    trackTimelineTitle: "Étapes d’acheminement du colis",
    trackDeliveryDestination: "Destination de livraison",
    trackWilaya: "Wilaya",
    trackCommune: "Commune :",
    trackAddress: "Adresse :",
    trackDeliveryType: "Mode de remise :",
    trackHomeDelivery: "Livraison à domicile",
    trackDeskDelivery: "Bureau / Point relais",
    trackStopDesk: "Bureau de livraison (Stop Desk)",
    trackPaymentSummary: "Paiement et montant total",
    trackSubtotal: "Sous-total :",
    trackShippingFee: "Frais de livraison :",
    trackCodAmount: "Montant à payer à la livraison :",
    trackCodNotice: "✓ Paiement en espèces à la livraison",
    trackPackageContents: "Contenu du colis",
    trackQuantity: "Quantité :",
    trackNeedHelpTitle: "Besoin de modifier l’adresse ou une question ?",
    trackNeedHelpSub: "Notre service client est à votre écoute tous les jours",
    trackContactSupport: "Contacter le support",
    statusPending: "En attente et révision",
    statusConfirmed: "Confirmée par téléphone",
    statusProcessing: "En préparation et emballage",
    statusShipped: "En cours de livraison",
    statusDelivered: "Livrée avec succès",
    statusCancelled: "Commande annulée",

    // FAQ Page
    faqHeading: "Foire Aux Questions PharmaClick",
    faqHeroDesc:
      "Toutes les réponses à vos questions concernant la livraison dans 69 wilayas, le paiement à la livraison et l’authenticité des soins.",
    faqNotFoundTitle: "Vous n’avez pas trouvé votre réponse ?",
    faqNotFoundDesc:
      "L’équipe de support PharmaClick est prête à vous aider directement par WhatsApp ou par téléphone.",
    faqWhatsappBtn: "Discussion WhatsApp directe",
    faqContactPageBtn: "Page de contact",
    faqCatAll: "Toutes les questions",
    faqCatShipping: "Livraison & Expédition (69 wilayas)",
    faqCatPayment: "Paiement & Tarifs",
    faqCatQuality: "Authenticité & Qualité",
    faqCatOrders: "Commandes & Retours",
    faqCatSupport: "Service Client",

    // Contact Page
    contactBreadcrumb: "Contactez-nous & Support",
    contactHeroTitle: "Contactez la boutique PharmaClick",
    contactHeroDesc:
      "Nous sommes à votre disposition pour vous orienter et répondre à vos questions sur nos soins et les livraisons aux 69 wilayas.",
    contactSupportAlways: "Une équipe dédiée à votre service",
    contactFormTitle: "Envoyez-nous un message",
    contactFormSub:
      "Remplissez le formulaire ci-dessous et notre équipe vous répondra dans les plus brefs délais.",
    contactSuccessTitle: "Message envoyé avec succès !",
    contactSuccessDesc:
      "Merci de contacter PharmaClick. Votre message a été reçu et un conseiller vous contactera rapidement.",
    contactSendAnother: "Envoyer un autre message",
    contactFullName: "Nom complet",
    contactFullNamePlaceholder: "Entrez votre nom complet...",
    contactPhone: "Numéro de téléphone",
    contactWilayaLabel: "Wilaya (69 wilayas)",
    contactChooseWilaya: "Choisissez votre wilaya...",
    contactSubject: "Sujet de la demande",
    contactSubjectPlaceholder: "Commande, suivi de colis, conseil...",
    contactMessage: "Message ou détails",
    contactMessagePlaceholder:
      "Écrivez votre message ou les produits recherchés...",
    contactSendBtn: "Envoyer le message",
    contactSubmitting: "Envoi en cours...",
    contactWhatsappTitle: "Échange direct par WhatsApp",
    contactWhatsappDesc:
      "Obtenez une réponse rapide et personnalisée pour vous guider dans vos achats.",
    contactWhatsappBtn: "Discussion WhatsApp directe",
    contactPhoneTitle: "Téléphone & Service Client",
    contactPhoneAvail: "Disponible pendant les jours ouvrables",
    contactHoursTitle: "Horaires d’ouverture & Support",
    contactHoursVal: "Samedi - Jeudi : 08h30 à 20h30",
    contactFridayVal: "Vendredi : Support disponible via WhatsApp",
    contactCoverageTitle: "Zone de livraison & Expédition",
    contactCoverageVal: "Livraison rapide vers les 69 wilayas",
    contactCoverageSub: "Paiement en espèces à la livraison (COD)",
    contactQualityTitle: "Garantie d’authenticité & Qualité",
    contactQualityVal: "100% Produits conformes et authentiques",
    contactQualitySub:
      "Directement des distributeurs et laboratoires officiels",
    contactFormValidation:
      "Veuillez remplir le nom, le numéro de téléphone et le message.",
  },

  en: {
    // Header & Navigation
    deliveryBadge: "Fast and reliable delivery across 69 wilayas in Algeria 🇩🇿",
    customerService: "Customer Support",
    logoSlogan: "Your health in one click",
    searchPlaceholder: "Search skincare, vitamins, sun protection, brands...",
    searchButton: "Search",
    trackOrder: "Track Order",
    trackOrderSub: "Follow package",
    cart: "Cart",
    home: "Home",
    allProducts: "All Products",
    allCategories: "All Categories",
    certifiedBrands: "Certified Brands",
    offersAndDiscounts: "Offers & Discounts",
    contactUs: "Contact Us",
    quickSuggestions: "Popular Searches:",
    liveSearchResults: "Instant Search Results",
    productUnit: "products",
    viewAllResults: "View all results for",
    noResults: "No products matched",
    currency: "DZD",
    discoverNow: "Discover Now",
    shopNow: "Shop Now",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    addToCart: "Add to Cart",
    viewProduct: "View Details",
    bestSellers: "Best Sellers",
    shopByCategory: "Shop by Category",
    trust100Original: "100% Authentic Products",
    trust69Wilayas: "Shipping to 69 Wilayas",
    trustCod: "Cash on Delivery",
    trustSupport: "Expert Advice 7/7",
    usageTab: "Directions & Usage",
    warningsTab: "Warnings & Precautions",
    detailsTab: "Specifications & Composition",

    // Hero Section
    heroPriorityBadge: "Your Health & Beauty, Our Priority • PharmaClick",
    heroTitle: "Your wellness & skincare essentials, delivered to your door.",
    heroTitlePrefix: "Your wellness & skincare essentials, ",
    heroTitleHighlight: "delivered to your door.",
    heroDesc:
      "100% authentic dermatological care and health essentials from leading global and local brands, delivered swiftly across all 69 Algerian wilayas.",
    heroShopNow: "Shop Products Now",
    heroOffers: "Offers & Discounts",
    heroContact: "Contact Us",
    heroSocialProof: "Over 10,000+ happy customers",
    heroReviewsCount: "(+2,500 verified reviews)",
    heroFloatingOriginal: "100% Authentic",
    heroFloatingLabs: "Direct from certified laboratories",
    heroFloatingVerified: "100% Tested & Verified",
    heroFloatingStore: "Certified PharmaClick Store",
    heroFloatingTagline: "Expert care & guaranteed essentials",
    heroFloatingShipping: "Shipping to 69 Wilayas",
    heroFloatingShippingSub: "Certified skincare & wellness",
    heroQuickSkincare: "Skincare",
    heroQuickHaircare: "Haircare",
    heroQuickVitamins: "Vitamins",
    catSunProtection: "Sun Protection",

    // Value Proposition Bar
    propFastDelivery: "Fast & Guaranteed Delivery",
    propFastDeliverySub: "On time to all 69 Algerian wilayas",
    propSecurePayment: "Cash on Delivery",
    propSecurePaymentSub: "100% safe & transparent payment",
    propEasyReturn: "Flexible & Easy Returns",
    propEasyReturnSub: "Quality guarantee on every single item",
    propSupport77: "Dedicated Support 7/7",
    propSupport77Sub: "Always available via WhatsApp & phone",

    // Categories Section
    catSectionTitle: "Shop by Category",
    catSectionSub:
      "Explore our curated wellness catalog tailored to your needs",
    catViewAll: "View All Categories",
    catItems: "products",

    // Best Sellers Section
    bestSellersTitle: "Best Sellers",
    bestSellersSub: "The most popular and trusted essentials in Algeria",
    viewAll: "View All",

    // 69 Wilayas Delivery Banner
    banner69Title: "Original Skincare & Health Products at Your Doorstep",
    banner69Sub:
      "Browse thousands of verified products from leading global and local brands, with convenient cash on delivery across Algeria.",
    banner69Badge1: "Guaranteed Fast Delivery",
    banner69Badge2: "Full coverage of all 69 Algerian wilayas 🇩🇿",
    banner69Browse: "Browse All Categories",
    banner69Contact: "Contact Support Team",
    banner69QualityBadge: "100% Guaranteed Authenticity",
    banner69QualitySub:
      "Every item meets rigorous safety and certification standards",

    // Services Section
    servicesTitle: "Care Services & Certified Shopping",
    servicesSub:
      "Integrated digital wellness solutions for you and your family",
    service1Title: "Direct Expert Advice",
    service1Desc:
      "Chat with our wellness specialists on WhatsApp or phone to choose your tailored routine.",
    service1Btn: "Talk to Us Now",
    service2Title: "Delivery to 69 Wilayas",
    service2Desc:
      "Fast and reliable shipping to your doorstep or pickup desks across Algeria without exception.",
    service2Btn: "Shipping Policy Details",
    service3Title: "100% Genuine Quality",
    service3Desc:
      "Clinically tested and certified products sourced directly from official partners.",
    service3Btn: "Explore Certified Brands",
    service4Title: "Cash on Delivery",
    service4Desc:
      "Shop with full confidence; pay cash upon delivery and order inspection.",
    service4Btn: "Frequently Asked Questions",
    certStoreBadge: "Officially certified e-store in Algeria",
    certCoverageBadge: "Nationwide delivery across 69 wilayas",
    certLabBadge: "100% Authentic lab-tested products",
    certPaymentBadge: "Secure & flexible payment options",

    // Newsletter & PWA
    newsTitle: "Subscribe to our newsletter for exclusive offers",
    newsSub:
      "Get exclusive discounts and weekly wellness tips directly to your inbox.",
    newsPlaceholder: "Enter your email address...",
    newsButton: "Subscribe",
    newsSubscribed: "Subscribed ✓",
    pwaBadge: "Installable PWA App",
    pwaTitle: "Install PharmaClick on your phone",
    pwaSub:
      "Lightning fast browsing without heavy app store downloads, order with one tap.",
    pwaInstallBtn: "Add to Home Screen",

    // Footer
    footerAbout:
      "Your trusted wellness platform in Algeria. Combining modern e-commerce with expert care to meet all your health and beauty needs.",
    footerQuickLinks: "Quick Links",
    footerCustomerService: "Customer Care & Policies",
    footerContactCol: "Customer Support & Contact",
    footerAddress: "PharmaClick Online Store, Algeria",
    footerHours: "Saturday - Thursday: 08:30 to 20:30",
    footerFriday: "Friday: Support via WhatsApp",
    footerCopyright:
      "All rights reserved © 2026 PharmaClick - Your certified health and beauty destination.",
    footerSkincare: "Skincare & Dermocosmetics",
    footerShippingPolicy: "Shipping & Delivery Policy",
    footerPrivacyPolicy: "Privacy & Data Protection",
    footerTerms: "Terms of Use & Sale",
    footerFaq: "Frequently Asked Questions",
    footerTrackOrder: "Track Order Online",

    // Cart Page
    cartTitle: "Shopping Cart",
    cartEmptyTitle: "Your shopping cart is currently empty",
    cartEmptySub:
      "Explore our catalog and add your favorite wellness essentials",
    cartContinueShopping: "Continue Shopping",
    cartClearAll: "Clear Entire Cart",
    cartOrderSummary: "Order Summary",
    cartSubtotal: "Items Subtotal",
    cartShippingFee: "Estimated Shipping Fee",
    cartTotal: "Total Amount",
    cartCheckoutBtn: "Proceed to Checkout",
    cartDeliveryLocation: "Estimate Shipping by Wilaya",
    cartHomeDelivery: "Home Delivery",
    cartDeskDelivery: "Desk / Pickup Station",
    cartFreeShippingProgress: "Add",
    cartFreeShippingEarned: "Congratulations! Free shipping unlocked!",

    // Checkout Page
    checkoutTitle: "Checkout & Delivery",
    checkoutPersonalTitle: "1. Personal & Contact Details",
    checkoutFullName: "Full Name",
    checkoutPhone: "Primary Phone Number",
    checkoutAltPhone: "Alternative Phone (Optional)",
    checkoutAddressTitle: "2. Shipping Address",
    checkoutWilaya: "Wilaya (from all 69 wilayas)",
    checkoutCommune: "Commune / City",
    checkoutStreet: "Detailed Address / Street / House No.",
    checkoutNotes: "Delivery Instructions (Optional)",
    checkoutCodNotice:
      "Cash on Delivery: Pay cash upon receiving and inspecting your package.",
    checkoutConfirmBtn: "Confirm & Place Order Now",
    footerDeliveryDesk: "To your doorstep or nearest pickup desk",
    footerNationalCoverage: "Nationwide coverage with cash on delivery",
    footerSupportTeam:
      "Dedicated specialist support team to answer your questions",
    discount: "OFF",
    all: "All",
    onlyInStock: "In stock only",
    onlyDiscounts: "On sale only",
    sortBy: "Sort by:",
    sortFeatured: "Featured",
    sortPriceAsc: "Price: Low to High",
    sortPriceDesc: "Price: High to Low",
    sortDiscount: "Biggest Discount",
    productsDisplayed: "Displayed products:",
    resetFilters: "Reset filters",
    allProductsSub:
      "Explore our comprehensive selection of 100% authentic skincare, haircare, and dietary supplements.",
    cartEmptyDesc:
      "You have not added any products yet. Browse our selection of 100% authentic skincare, haircare, and wellness products.",
    cartItemsCount: "product(s)",
    checkoutEmailOptional: "Email (optional for notifications)",
    checkoutDeliveryType: "Delivery Method",
    checkoutOrderItems: "Order Items",
    checkoutPlacingOrder: "Placing your order...",
    checkoutSuccessTitle: "Order Placed & Confirmed Successfully!",
    checkoutOrderNumber: "Order #",
    pwaInstallAlert:
      "You can install the app directly via browser menu (Add to Home Screen).",
    free: "Free",

    // Brands Page
    brandsTitle: "Certified Leading Medical & Skincare Brands",
    brandsSub: "Official Brands & Laboratories",
    brandsDesc:
      "We supply 100% genuine products sourced directly from authorized distributors and laboratories, ensuring supreme safety and efficacy.",
    browseProducts: "Browse Products",
    certifiedProductsCount: "certified product(s)",
    partnersLabs: "Certified Global Labs & Partners",

    // Offers Page
    offersTitle: "Premium Care at the Best Prices",
    offersSub: "Offers & Discounts",
    offersBannerBadge: "Limited Time Certified Discounts",
    offersBannerDesc:
      "Save up to 20% on top dermatological brands (La Roche-Posay, Eucerin, Vichy) with direct shipping across all 69 Algerian wilayas.",
    activeDiscountsCount: "Currently discounted products:",
    specialOffer: "special offer",

    // Categories Page & Visual Filter
    categoriesCatalog: "Official Category Guide",
    categoriesBrowseByCat: "Browse Products by Department",
    categoriesHeroDesc:
      "Explore comprehensive selections of certified dermo-cosmetics, dietary supplements, and medical devices with swift delivery to 69 wilayas.",
    subcategories: "Subcategories:",
    exploreProductsOf: "Explore products of",
    totalProductsAvailable: "Total available products:",
    browseAndFilterVisual: "Visual Category Filters",
    clickToFilterInstant: "Click any category to filter instantly",
    generalProducts: "General Products",
    mainDepartment: "(Main)",
    filterActive: "Filter:",
    searchByNameOrBrand: "Search by name or brand...",
    sortPopular: "Most Popular",
    sortRating: "Top Rated",
    noProductsMatchFilter: "No products match the selected filter",
    resetFilterAll: "View all products of",
    clearFilter: "Clear filter",

    // Product Details & Reviews
    shareProduct: "Share Product",
    linkCopied: "Link copied!",
    officialPrice: "Official Price:",
    youSaved: "You saved",
    choose: "Choose",
    addedToCartSuccess: "✓ Product added to your cart successfully!",
    officialLabs: "From officially certified laboratories",
    brandLabel: "Brand:",
    categoryLabel: "Category:",
    volumeLabel: "Size / Volume:",
    stockStatus: "Stock Status:",
    inStockImmediate: "In stock for immediate dispatch",
    units: "items",
    relatedProductsTitle: "Recommended Related Products",
    viewMore: "View more",

    // Cart Page & Drawer
    itemsInYourCart: "item(s) in your cart",
    cartEmptyNow: "Your cart is currently empty",
    closeCart: "Close Cart",
    freeShippingCongrat:
      "Congratulations! Free delivery across 69 wilayas unlocked 🎉",
    browseProductsBtn: "Browse Products",
    deleteItem: "Delete",
    calculatedAtCheckout: "Calculated at checkout",
    viewCartDetails: "View Cart Details",
    drawerCheckoutBtn: "Proceed to Checkout (Cash on Delivery)",
    perItem: "per piece",

    checkoutSubmitBtn: "Confirm Order Now",
    checkoutSubmitting: "Submitting order...",

    // Checkout Success Page
    orderSuccessTitle: "Order Received & Confirmed Successfully! 🎉",
    orderSuccessDesc:
      "Thank you for your trust. Your order has been placed and is being prepared for shipping to wilaya of",
    orderRefNumber: "Your Order Reference:",
    copyOrderNumber: "Copy Order Number",
    copied: "Copied",
    copy: "Copy",
    totalAmountCod: "Total Amount to Pay upon Delivery:",
    whatHappensNext: "What happens next?",
    step1PhoneTitle: "Phone Confirmation:",
    step1PhoneDesc:
      "A customer care representative will call you shortly to confirm your exact delivery address.",
    step2ShippingTitle: "Packaging & Dispatch:",
    step2ShippingDesc:
      "Your items are safely packaged and handed over to our shipping partner.",
    step3CodTitle: "Cash on Delivery (COD):",
    step3CodDesc:
      "You pay cash to the courier only upon receiving and inspecting your package.",
    trackOrderStatus: "Track Order Status",
    backToShopping: "Continue Shopping",

    // Track Page
    trackOrderTitle: "Step-by-Step Order Tracking",
    trackOrderDesc:
      "Enter your order reference and registered phone number to track real-time delivery status to any of the 69 wilayas.",
    trackOrderRefInput: "Order Reference (e.g. ORD-2026-XXXX)",
    trackPhoneInput: "Registered Phone Number",
    trackSubmitBtn: "Track Order",
    trackingSearching: "Searching for your order...",
    orderFound: "Package Details & Route",
    orderNotFound: "Could not find this order",

    // FAQ Page
    faqTitle: "Frequently Asked Questions | PharmaClick",
    faqSub:
      "All the answers regarding our 69-wilaya delivery coverage, cash on delivery, and 100% genuine product guarantee.",
    faqBadge: "Clear answers to your questions",
    allQuestions: "All Questions",

    // Brands Page
    brandsAvailableToBuy: "certified product(s) available",
    brandsNoProds: "No products currently listed for this brand.",
    brandsBackAll: "Back to all brands",
    brandsBreadcrumb: "Brands",

    // Offers Page
    offersSortBy: "Sort by:",
    offersSortMaxDiscount: "Highest Discount (%)",
    offersSortPriceAsc: "Price: Low to High",
    offersSortPriceDesc: "Price: High to Low",
    offersSortPopular: "Most Popular",

    // Search Page
    searchBreadcrumb: "Search & Filters",
    searchPageTitle: "Search Store & Certified Catalog",
    searchPageSub:
      "Search by name, brand, or active ingredient to filter results instantly",
    searchPlaceholderLong:
      "Type product name, brand (e.g., CeraVe, Eucerin)...",
    filterOptions: "Filter Options",
    searchResetBtn: "Reset",
    byCategory: "By Category:",
    byBrand: "Brand:",
    maxPrice: "Max Price:",
    onlyInStockFilter: "In stock only",
    searchFoundCountPrefix: "Found",
    searchFoundCountSuffix: "matching product(s)",
    sortFeaturedRating: "Featured & Top Rated",
    searchNoResultsTitle: "Didn’t find what you are looking for?",
    searchNoResultsDesc:
      "No worries! Contact us directly and our support team will help you find and source what you need swiftly.",
    searchWhatsappBtn: "Chat on WhatsApp",
    searchShowAllBtn: "View all products",
    searchLoadingResults: "Loading search results...",
    exclusiveOffer: "Exclusive Offer",

    // Track Order Page
    trackWilayasBadge: "Direct package tracking across 69 wilayas",

    trackOrderRequiredErr:
      "Please enter your order reference (e.g. ORD-2026-123456)",
    trackPhoneRequiredErr:
      "Please enter your registered phone number to verify your order",

    trackRefDetails: "Order Reference Details:",
    trackOrderDate: "Order Date:",
    trackTimelineTitle: "Shipment Timeline & Progress",
    trackDeliveryDestination: "Delivery Destination",
    trackWilaya: "Wilaya",
    trackCommune: "Commune / City:",
    trackAddress: "Address:",
    trackDeliveryType: "Delivery Method:",
    trackHomeDelivery: "Home Delivery",
    trackDeskDelivery: "Desk / Pickup Station",
    trackStopDesk: "Pickup Station (Stop Desk)",
    trackPaymentSummary: "Payment & Total Summary",
    trackSubtotal: "Subtotal:",
    trackShippingFee: "Shipping Fee:",
    trackCodAmount: "Total COD Amount upon Delivery:",
    trackCodNotice: "✓ Cash payment upon package delivery",
    trackPackageContents: "Package Contents",
    trackQuantity: "Quantity:",
    trackNeedHelpTitle: "Need to update delivery address or have questions?",
    trackNeedHelpSub:
      "Our customer support team is available daily to help you",
    trackContactSupport: "Contact Support",
    statusPending: "Pending Review",
    statusConfirmed: "Confirmed by Phone",
    statusProcessing: "Processing & Packaging",
    statusShipped: "Out for Delivery",
    statusDelivered: "Delivered Successfully",
    statusCancelled: "Order Cancelled",

    // FAQ Page
    faqHeading: "Frequently Asked Questions | PharmaClick",
    faqHeroDesc:
      "All the answers regarding our 69-wilaya delivery coverage, cash on delivery, and 100% genuine product guarantee.",
    faqNotFoundTitle: "Didn’t find the answer you’re looking for?",
    faqNotFoundDesc:
      "PharmaClick support team is ready to help you directly via WhatsApp or phone.",
    faqWhatsappBtn: "Direct WhatsApp Chat",
    faqContactPageBtn: "Contact Page",
    faqCatAll: "All Questions",
    faqCatShipping: "Shipping & Delivery (69 Wilayas)",
    faqCatPayment: "Payment & Pricing",
    faqCatQuality: "Authenticity & Quality",
    faqCatOrders: "Orders & Returns",
    faqCatSupport: "Customer Support",

    // Contact Page
    contactBreadcrumb: "Contact Us & Customer Support",
    contactHeroTitle: "Contact PharmaClick Store",
    contactHeroDesc:
      "We are delighted to assist you and answer all inquiries regarding our certified essentials, orders, and 69 wilayas shipping.",
    contactSupportAlways: "Support team always at your service",
    contactFormTitle: "Send Us a Direct Message",
    contactFormSub:
      "Fill out the form below and our team will get back to you shortly via phone or email.",
    contactSuccessTitle: "Message Sent Successfully!",
    contactSuccessDesc:
      "Thank you for contacting PharmaClick. Your message has been received and a representative will contact you soon.",
    contactSendAnother: "Send another message",
    contactFullName: "Full Name",
    contactFullNamePlaceholder: "Enter your full name...",
    contactPhone: "Phone Number",
    contactWilayaLabel: "Wilaya (69 Wilayas)",
    contactChooseWilaya: "Choose your wilaya...",
    contactSubject: "Subject of Inquiry",
    contactSubjectPlaceholder: "Order, shipping tracking, inquiry...",
    contactMessage: "Message or Request Details",
    contactMessagePlaceholder:
      "Write your message or the products you are looking for...",
    contactSendBtn: "Send Message Now",
    contactSubmitting: "Sending...",
    contactWhatsappTitle: "Instant WhatsApp Chat",
    contactWhatsappDesc:
      "Get quick and direct assistance from our customer support team to answer questions and place orders.",
    contactWhatsappBtn: "Direct WhatsApp Chat",
    contactPhoneTitle: "Phone & Customer Support",
    contactPhoneAvail: "Available during business hours",
    contactHoursTitle: "Business Hours & Support",
    contactHoursVal: "Saturday - Thursday: 08:30 to 20:30",
    contactFridayVal: "Friday: Support available via WhatsApp",
    contactCoverageTitle: "Shipping & Delivery Scope",
    contactCoverageVal: "Fast & reliable delivery to 69 wilayas",
    contactCoverageSub: "Cash on delivery (COD) at your doorstep",
    contactQualityTitle: "Authenticity & Quality Guarantee",
    contactQualityVal: "100% genuine and certified products",
    contactQualitySub:
      "Imported and certified directly from official distributors",
    contactFormValidation:
      "Please fill in your name, phone number, and message.",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  direction: "rtl",
  setLanguage: () => {},
  t: (key) => key,
  getLocalized: () => "",
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("ar");

  // Load persisted language from URL param (?lang=) or localStorage
  useEffect(() => {
    try {
      let activeLang: SupportedLanguage = "ar";
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get("lang") as SupportedLanguage;
        if (urlLang && ["ar", "fr", "en"].includes(urlLang)) {
          activeLang = urlLang;
          localStorage.setItem("preferred_locale", urlLang);
        } else {
          const savedLang = localStorage.getItem(
            "preferred_locale",
          ) as SupportedLanguage;
          if (savedLang && ["ar", "fr", "en"].includes(savedLang)) {
            activeLang = savedLang;
          }
        }
      }
      setLanguageState(activeLang);
      applyLanguageToDocument(activeLang);
    } catch (e) {
      applyLanguageToDocument("ar");
    }
  }, []);

  const applyLanguageToDocument = (lang: SupportedLanguage) => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("preferred_locale", lang);
    } catch (e) {}
    applyLanguageToDocument(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["ar"]?.[key] || key;
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
    fallbackField?: string,
  ): string => {
    if (!item) return "";

    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

    if (language === "en") {
      const enVal =
        item[`${field}En`] ||
        item[`${field}_en`] ||
        item[`${field}EN`] ||
        (field === "badge" ? item.badgeTextEn : undefined);
      if (enVal && typeof enVal === "string" && enVal.trim() !== "") {
        return enVal.trim();
      }
    } else if (language === "fr") {
      const frVal =
        item[`${field}Fr`] ||
        item[`${field}_fr`] ||
        item[`${field}FR`] ||
        (field === "badge" ? item.badgeTextFr : undefined);
      if (frVal && typeof frVal === "string" && frVal.trim() !== "") {
        return frVal.trim();
      }
    }

    // Default / Fallback to Arabic or primary field
    const arVal =
      item[`${field}Ar`] ||
      item[`${field}_ar`] ||
      item[field] ||
      (field === "badge" ? item.badgeText : undefined) ||
      (fallbackField ? item[fallbackField] : "");

    return (arVal && typeof arVal === "string" ? arVal.trim() : "") || "";
  };

  const direction = language === "ar" ? "rtl" : "ltr";

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
