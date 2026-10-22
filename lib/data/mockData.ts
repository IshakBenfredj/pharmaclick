/**
 * البيانات النموذجية المعتمدة للمتجر (PharmaClick Mock & Seed Data)
 * تتوافق بدقة مع نماذج قاعدة البيانات وقواعد المشروع:
 * - خالية تماماً من الكلمات المحظورة
 * - خالية من أيقونة Sparkles
 * - متوافقة مع معيار ولايات الجزائر الـ 69
 */

export interface MockCategory {
  _id: string;
  nameAr: string;
  nameFr: string;
  nameEn?: string;
  slug: string;
  icon: string;
  image: string;
  descriptionAr: string;
  descriptionFr: string;
  descriptionEn?: string;
  productCount: number;
  subCategories?: {
    nameAr: string;
    nameFr: string;
    nameEn?: string;
    slug: string;
    image?: string;
    icon?: string;
    descriptionAr?: string;
    descriptionEn?: string;
  }[];
}

export interface MockBrand {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  countryOfOrigin: string;
  isFeatured: boolean;
}

export interface MockProduct {
  _id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  nameEn?: string;
  slug: string;
  brand: string;
  brandId: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  subCategorySlug?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewsCount: number;
  sizeOrVolume: string;
  variants?: { name: string; option: string; priceDelta: number; stockQuantity: number }[];
  description: string;
  descriptionFr?: string;
  descriptionEn?: string;
  shortDescriptionFr?: string;
  shortDescriptionEn?: string;
  usageInstructions: string;
  usageInstructionsFr?: string;
  usageInstructionsEn?: string;
  healthWarnings: string;
  isFeatured: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export interface MockBanner {
  _id: string;
  title: string;
  titleFr?: string;
  titleEn?: string;
  subtitle: string;
  subtitleFr?: string;
  subtitleEn?: string;
  badgeText: string;
  badgeTextFr?: string;
  badgeTextEn?: string;
  imageUrlDesktop: string;
  imageUrlMobile: string;
  linkUrl: string;
  buttonText: string;
  buttonTextFr?: string;
  buttonTextEn?: string;
  accentColor: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    _id: "cat-1",
    nameAr: "العناية بالبشرة",
    nameFr: "Soins de la Peau",
    slug: "skincare",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "مستحضرات طبية وعلاجية معتمدة لترطيب، نضارة، وتجديد خلايا البشرة بأنواعها.",
    descriptionFr: "Produits certifiés pour hydrater et revitaliser tous types de peau.",
    productCount: 142,
    subCategories: [
      {
        nameAr: "مرطبات وسيرومات",
        nameFr: "Sérums & Hydratants",
        slug: "serums-hydratants",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "سيرومات حمض الهيالورونيك والنياسيناميد وكريمات الترطيب العميق.",
      },
      {
        nameAr: "منظفات وغسول الوجه",
        nameFr: "Nettoyants Visage",
        slug: "nettoyants",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "غسولات رغوية وجل منظف ومياه ميسيلار لإزالة الشوائب والدهون.",
      },
      {
        nameAr: "مكافحة التجاعيد والشيخوخة",
        nameFr: "Anti-Âge",
        slug: "anti-age",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "مستحضرات الريتينول وفيتامين C لشد البشرة ومقاومة الخطوط التعبيرية.",
      },
    ],
  },
  {
    _id: "cat-2",
    nameAr: "واقيات الشمس",
    nameFr: "Protections Solaires",
    slug: "sun-protection",
    icon: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "حماية فائقة SPF 50+ ومضادات أكسدة للوقاية من الأشعة الضارة والتصبغات.",
    descriptionFr: "Haute protection SPF 50+ contre les UV et l'hyperpigmentation.",
    productCount: 48,
    subCategories: [
      {
        nameAr: "كريمات حماية للبشرة الدهنية",
        nameFr: "Fluides Peau Grasse",
        slug: "fluides-solaires",
        image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "سوائل حماية بملمس غير لامع ومقاوم للمعان طوال اليوم.",
      },
      {
        nameAr: "واقيات شمس ملونة",
        nameFr: "Solaires Teintés",
        slug: "solaires-teintes",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "حماية متكاملة مع تغطية طبيعية لتوحيد لون البشرة وإخفاء العيوب.",
      },
      {
        nameAr: "حماية شمسية للأطفال",
        nameFr: "Solaires Enfants",
        slug: "solaires-enfants",
        image: "https://images.unsplash.com/photo-1502741384106-56538427cde9?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "تركيبات فائقة التحمل ومقاومة للماء مخصصة لبشرة الصغار الحساسة.",
      },
    ],
  },
  {
    _id: "cat-3",
    nameAr: "العناية بالشعر",
    nameFr: "Soins Capillaires",
    slug: "haircare",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "شامبوهات علاجية وزيوت مغذية لعلاج تساقط الشعر والقشرة وإعادة اللمعان.",
    descriptionFr: "Traitements anti-chute et réparateurs pour des cheveux sains.",
    productCount: 86,
    subCategories: [
      {
        nameAr: "علاج تساقط الشعر",
        nameFr: "Anti-Chute",
        slug: "anti-chute",
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "شامبوهات ومستحضرات موضعية منشطة للبصيلات للحد من التساقط.",
      },
      {
        nameAr: "شامبو وبلسم علاجي",
        nameFr: "Shampoings Traitants",
        slug: "shampoings",
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "حلول فعالة للقشرة والحكة واستعادة النعومة والترطيب.",
      },
      {
        nameAr: "سيرومات وماسكات التغذية",
        nameFr: "Masques & Sérums",
        slug: "masques-cheveux",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "ماسكات زيتية وبروتينية مكثفة لإصلاح ألياف الشعر المتقصف والتالف.",
      },
    ],
  },
  {
    _id: "cat-4",
    nameAr: "الفيتامينات والمكملات",
    nameFr: "Vitamines & Compléments",
    slug: "vitamins",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "فيتامينات طبيعية، معادن، ومكملات غذائية لتعزيز المناعة والنشاط اليومي.",
    descriptionFr: "Vitamines et minéraux certifiés pour stimuler votre vitalité.",
    productCount: 110,
    subCategories: [
      {
        nameAr: "المناعة والنشاط",
        nameFr: "Immunité & Tonus",
        slug: "immunite-tonus",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "فيتامين C، زنك، ومقويات عامة لمقاومة التعب والإرهاق اليومي.",
      },
      {
        nameAr: "أوميغا 3 والزيوت المفيدة",
        nameFr: "Oméga 3",
        slug: "omega-3",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "أحماض دهنية أساسية لدعم صحة القلب وتنشيط الذاكرة والتركيز.",
      },
      {
        nameAr: "صحة المفاصل والعظام",
        nameFr: "Articulations & Os",
        slug: "articulations",
        image: "https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "كالسيوم، فيتامين D3، وكولاجين لتقوية الغضاريف والمفاصل.",
      },
    ],
  },
  {
    _id: "cat-5",
    nameAr: "الأم والرضيع",
    nameFr: "Maman & Bébé",
    slug: "baby",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "مستلزمات متكاملة وحليب وغسول مضاد للحساسية لنعومة وصحة الرضيع والأم.",
    descriptionFr: "Soins hypoallergéniques et alimentation adaptée pour nourrissons.",
    productCount: 75,
    subCategories: [
      {
        nameAr: "نظافة ورعاية الرضيع",
        nameFr: "Hygiène Bébé",
        slug: "hygiene-bebe",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "شامبو أطفال خالي من الدموع وكريمات علاج ومنع طفح الحفاض.",
      },
      {
        nameAr: "تغذية وحليب الأطفال",
        nameFr: "Alimentation Infantile",
        slug: "alimentation-bebe",
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "حليب أطفال معتمد بمختلف المراحل العمرية ومكملات غذائية للنمو.",
      },
      {
        nameAr: "عناية الحامل والأمومة",
        nameFr: "Maternité",
        slug: "maternite",
        image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "كريمات الوقاية من علامات التمدد ومستلزمات فترة الرضاعة الطبيعية.",
      },
    ],
  },
  {
    _id: "cat-6",
    nameAr: "الأجهزة والمعدات الطبية",
    nameFr: "Matériel Médical",
    slug: "devices",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&auto=format&fit=crop&q=80",
    descriptionAr: "أجهزة قياس الضغط والسكر، موازين الحرارة، ومعدات الإسعافات والمتابعة المنزلية.",
    descriptionFr: "Tensiomètres, glucomètres et matériel de suivi à domicile.",
    productCount: 62,
    subCategories: [
      {
        nameAr: "أجهزة فحص السكر والشرائط",
        nameFr: "Glucomètres",
        slug: "glucometers",
        image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "أجهزة قياس السكر الفورية وشرائط فحص أصلية ومعقمة.",
      },
      {
        nameAr: "أجهزة قياس ضغط الدم",
        nameFr: "Tensiomètres",
        slug: "tensiometers",
        image: "https://images.unsplash.com/photo-1583912267670-6575ad362e4a?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "أجهزة قياس الضغط الإلكترونية للذراع والمعصم بدقة طبية معتمدة.",
      },
      {
        nameAr: "موازين الحرارة الرقمية",
        nameFr: "Thermomètres",
        slug: "thermometers",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
        descriptionAr: "موازين حرارة رقمية وبالأشعة تحت الحمراء بدون تلامس.",
      },
    ],
  },
];

export const MOCK_BRANDS: MockBrand[] = [
  {
    _id: "b-1",
    name: "La Roche-Posay",
    slug: "la-roche-posay",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/La_Roche-Posay_logo.svg/320px-La_Roche-Posay_logo.svg.png",
    description: "الماركة الموصى بها من أطباء الجلد حول العالم للبشرة الحساسة.",
    countryOfOrigin: "فرنسا",
    isFeatured: true,
  },
  {
    _id: "b-2",
    name: "CeraVe",
    slug: "cerave",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/CeraVe_logo.svg/320px-CeraVe_logo.svg.png",
    description: "تركيبات غنية بـ 3 سيراميدات أساسية لترميم حاجز حماية البشرة.",
    countryOfOrigin: "الولايات المتحدة",
    isFeatured: true,
  },
  {
    _id: "b-3",
    name: "Eucerin",
    slug: "eucerin",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Eucerin_Logo.svg/320px-Eucerin_Logo.svg.png",
    description: "أبحاث علمية جلدية متطورة لتنقية وتوحيد لون البشرة وحمايتها.",
    countryOfOrigin: "ألمانيا",
    isFeatured: true,
  },
  {
    _id: "b-4",
    name: "Vichy",
    slug: "vichy",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Vichy_logo.svg/320px-Vichy_logo.svg.png",
    description: "مياه فيشي الحرارية الغنية بـ 15 معدناً نادراً لتقوية مقاومة الجلد.",
    countryOfOrigin: "فرنسا",
    isFeatured: true,
  },
  {
    _id: "b-5",
    name: "Bioderma",
    slug: "bioderma",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Bioderma_logo.svg/320px-Bioderma_logo.svg.png",
    description: "علم الأحياء في خدمة صحة ونضارة الجلد والحلول الفعالة للتهيج.",
    countryOfOrigin: "فرنسا",
    isFeatured: true,
  },
  {
    _id: "b-6",
    name: "Accu-Chek",
    slug: "accu-chek",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Roche_Logo.svg/320px-Roche_Logo.svg.png",
    description: "الدقة السويسرية الرائدة عالمياً في أجهزة فحص ومتابعة السكري.",
    countryOfOrigin: "سويسرا",
    isFeatured: true,
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    _id: "prod-1",
    name: "سيروم حمض الهيالورونيك المرطب المركز Hyalu B5",
    nameAr: "سيروم حمض الهيالورونيك المرطب المركز Hyalu B5",
    nameFr: "Sérum Anti-Rides Hyalu B5 Concentré",
    nameEn: "Hyalu B5 Pure Hyaluronic Acid Serum",
    slug: "hyalu-b5-serum",
    brand: "La Roche-Posay",
    brandId: "b-1",
    category: "العناية بالبشرة",
    categorySlug: "skincare",
    subCategory: "مرطبات وسيرومات",
    subCategorySlug: "serums-hydratants",
    price: 3800,
    originalPrice: 4500,
    discountPercentage: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", alt: "سيروم هيالو B5", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1608248597359-05d6811a2f64?w=800&auto=format&fit=crop&q=80", alt: "سيروم هيالو B5 جانبي", isPrimary: false },
    ],
    inStock: true,
    stockQuantity: 24,
    rating: 4.9,
    reviewsCount: 38,
    sizeOrVolume: "30 مل",
    variants: [
      { name: "الحجم", option: "30 مل", priceDelta: 0, stockQuantity: 18 },
      { name: "الحجم", option: "50 مل", priceDelta: 1200, stockQuantity: 6 },
    ],
    description: "سيروم فائق الفعالية غني بحمض الهيالورونيك النقي ثنائي الجزيئات وفيتامين B5 وماديكاسوسايد لإصلاح حاجز البشرة الواقي وتعبئة الخطوط الدقيقة وتعزيز مرونة البشرة وترطيبها بعمق.",
    descriptionFr: "Sérum dermatologique réparateur et repulpant à l'acide hyaluronique pur et vitamine B5.",
    descriptionEn: "Dermatological repairing and replumping serum with pure hyaluronic acid and vitamin B5.",
    usageInstructions: "توضع 3 إلى 4 قطرات على الوجه والرقبة صباحاً ومساءً على بشرة نظيفة ورطبة قبل استخدام الكريم المرطب المعتاد.",
    healthWarnings: "للاستعمال الخارجي فقط. يحفظ بعيداً عن متناول الأطفال وتجنب ملامسة منطقة العينين مباشرة.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["سيروم", "هيالورونيك", "ترطيب", "نضارة", "لاروش بوزيه"],
  },
  {
    _id: "prod-2",
    name: "واقي شمس سائل فائق الحماية Oil Control SPF50+ خالي من اللمعان",
    nameAr: "واقي شمس سائل فائق الحماية Oil Control SPF50+ خالي من اللمعان",
    nameFr: "Fluide Solaire Anti-Brillance Oil Control SPF50+",
    // Notice: nameEn is deliberately omitted to test fallback to Arabic when English is chosen!
    slug: "oil-control-spf50",
    brand: "Eucerin",
    brandId: "b-3",
    category: "واقيات الشمس",
    categorySlug: "sun-protection",
    subCategory: "كريمات حماية للبشرة الدهنية",
    subCategorySlug: "fluides-solaires",
    price: 2950,
    originalPrice: 3500,
    discountPercentage: 16,
    images: [
      { url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80", alt: "واقي شمس يوسيرين", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 52,
    sizeOrVolume: "50 مل",
    description: "حماية فائقة من الأشعة فوق البنفسجية UVA/UVB والضوء المرئي عالي الطاقة مع تقنية تنظيم الإفرازات الدهنية بمفعول جاف ومقاوم للمعان يدوم حتى 8 ساعات كاملة للبشرة الدهنية والمعرضة لحب الشباب.",
    descriptionFr: "Très haute protection solaire pour peau grasse à tendance acnéique avec effet anti-brillance 8h.",
    usageInstructions: "يوضع بسخاء على الوجه والرقبة قبل 20 دقيقة من التعرض للشمس، ويُعاد تطبيقه كل ساعتين أو بعد السباحة والتعرق الشديد.",
    healthWarnings: "التقليل من الكمية المطبقة يقلل بشكل ملحوظ من مستوى الحماية.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["واقي شمس", "يوسيرين", "بشرة دهنية", "حماية", "مات"],
  },
  {
    _id: "prod-3",
    name: "غسول رغوي منظف ومنقي للبشرة العادية إلى الدهنية مع 3 سيراميدات",
    nameAr: "غسول رغوي منظف ومنقي للبشرة العادية إلى الدهنية مع 3 سيراميدات",
    nameFr: "Gel Moussant Nettoyant Peaux Normales à Grasses",
    nameEn: "Foaming Facial Cleanser for Normal to Oily Skin",
    slug: "foaming-facial-cleanser",
    brand: "CeraVe",
    brandId: "b-2",
    category: "العناية بالبشرة",
    categorySlug: "skincare",
    subCategory: "منظفات وغسول الوجه",
    subCategorySlug: "nettoyants",
    price: 2600,
    images: [
      { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", alt: "غسول سيرافي رغوي", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 40,
    rating: 4.9,
    reviewsCount: 74,
    sizeOrVolume: "236 مل",
    variants: [
      { name: "الحجم", option: "236 مل", priceDelta: 0, stockQuantity: 25 },
      { name: "الحجم", option: "473 مل", priceDelta: 950, stockQuantity: 15 },
    ],
    description: "غسول رغوي لطيف يزيل الأوساخ والدهون الزائدة وبقايا المكياج دون أن يجرد البشرة من رطوبتها الطبيعية بفضل احتوائه على السيراميدات الأساسية وحمض الهيالورونيك والنياسيناميد المهدئ.",
    usageInstructions: "يدلك الغسول على بشرة مبللة بحركات دائرية لطيفة حتى تتشكل رغوة غنية، ثم يشطف بالماء الفاتر ويجفف الوجه بلطف.",
    healthWarnings: "في حال ملامسة العينين، تشطف فوراً بكميات وفيرة من الماء النظيف.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["غسول", "سيرافي", "سيراميد", "منظف", "بشرة مختلطة"],
  },
  {
    _id: "prod-4",
    name: "جهاز قياس السكر الفوري Accu-Chek Active مع 50 شريط اختبار",
    slug: "accu-chek-active-kit",
    brand: "Accu-Chek",
    brandId: "b-6",
    category: "الأجهزة والمعدات الطبية",
    categorySlug: "devices",
    subCategory: "أجهزة فحص السكر والشرائط",
    subCategorySlug: "glucometers",
    price: 4900,
    originalPrice: 5800,
    discountPercentage: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=80", alt: "جهاز قياس السكر أكيوشيك", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.9,
    reviewsCount: 29,
    sizeOrVolume: "طقم متكامل",
    description: "جهاز دقيق وسريع يظهر النتيجة الموثوقة خلال 5 ثوانٍ فقط، يتضمن الجهاز وقلم الوخز مع علبة تحتوي على 50 شريط اختبار معتمد بالإضافة إلى 10 إبر وخز معقمة.",
    usageInstructions: "اغسل يديك جيداً بالماء الدافئ والصابون وجففهما، أدخل الشريط في الجهاز وافرك طرف الإصبع برفق ثم خذ قطرة دم صغيرة وضعها على منطقة التفاعل المحددة بالشريط.",
    healthWarnings: "استخدم كل شريط لمرة واحدة فقط واحتفظ بالعلبة محكمة الإغلاق في درجة حرارة الغرفة بعيداً عن الرطوبة.",
    isFeatured: true,
    tags: ["جهاز سكر", "أكيوشيك", "أجهزة طبية", "صحة منزلية"],
  },
  {
    _id: "prod-5",
    name: "كبسولات أوميغا 3 عالية التركيز 1000 ملغ لصحة القلب والدماغ",
    slug: "omega-3-1000mg",
    brand: "PharmAlliance",
    brandId: "b-5",
    category: "الفيتامينات والمكملات",
    categorySlug: "vitamins",
    subCategory: "أوميغا 3 والزيوت المفيدة",
    subCategorySlug: "omega-3",
    price: 2200,
    originalPrice: 2650,
    discountPercentage: 17,
    images: [
      { url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80", alt: "كبسولات أوميغا 3", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 35,
    rating: 4.7,
    reviewsCount: 19,
    sizeOrVolume: "60 كبسولة",
    description: "مكمل غذائي غني بأحماض EPA و DHA الدهنية الأساسية المستخلصة من زيوت الأسماك النقية لدعم وظائف القلب الطبيعية، تعزيز الذاكرة والتركيز، وتقليل مستويات الكوليسترول الضار.",
    usageInstructions: "تناول كبسولة إلى كبسولتين يومياً مع وجبة طعام رئيسية وكوب كامل من الماء.",
    healthWarnings: "لا تتجاوز الجرعة اليومية الموصى بها. لا يعتبر المكمل الغذائي بديلاً عن نظام غذائي متوازن وصحي.",
    isFeatured: true,
    tags: ["أوميغا 3", "مكمل غذائي", "صحة القلب", "فيتامينات"],
  },
  {
    _id: "prod-6",
    name: "ماء ميسيلار منظف ومزيل للمكياج Sensibio H2O للبشرة الحساسة",
    slug: "sensibio-h2o-micellar-water",
    brand: "Bioderma",
    brandId: "b-5",
    category: "العناية بالبشرة",
    categorySlug: "skincare",
    subCategory: "منظفات وغسول الوجه",
    subCategorySlug: "nettoyants",
    price: 2450,
    images: [
      { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", alt: "ماء ميسيلار بايوديرما", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 5.0,
    reviewsCount: 93,
    sizeOrVolume: "500 مل",
    description: "المحلول الميسيلاري الأيقوني المهدئ الذي ينظف ويزيل 99% من المكياج والشوائب دون الحاجة للشطف، بتركيبة تحترم التوازن البيولوجي للبشرة الأكثر حساسية.",
    usageInstructions: "انقع قطعة قطنية بالماء الميسيلاري ونظف بها الوجه والعينين بلطف دون فرك شديد حتى تصبح القطنة نظيفة تماماً.",
    healthWarnings: "للاستعمال الخارجي فقط.",
    isFeatured: false,
    tags: ["ميسيلار", "بايوديرما", "مزيل مكياج", "بشرة حساسة"],
  },
  {
    _id: "prod-7",
    name: "شامبو مضاد لتساقط الشعر Dercos Aminexil المنشط للبصيلات",
    slug: "dercos-aminexil-shampoo",
    brand: "Vichy",
    brandId: "b-4",
    category: "العناية بالشعر",
    categorySlug: "haircare",
    subCategory: "علاج تساقط الشعر",
    subCategorySlug: "anti-chute",
    price: 2850,
    originalPrice: 3300,
    discountPercentage: 14,
    images: [
      { url: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80", alt: "شامبو ديركوس فيشي", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 28,
    rating: 4.8,
    reviewsCount: 41,
    sizeOrVolume: "200 مل",
    description: "شامبو مقوٍّ ومعالج مدعم بجزيء الأمينكسيل الحاصل على براءة اختراع والفيتامينات B5 و B6 لتقوية ألياف الشعر من الجذور حتى الأطراف والحد من التساقط الموسمي والمستمر.",
    usageInstructions: "يوضع على فروة الرأس المبللة ويدلك بلطف، يترك لمدة دقيقة إلى دقيقتين ثم يشطف جيداً بالماء.",
    healthWarnings: "في حال ملامسة العينين تغسل فوراً بالماء.",
    isFeatured: true,
    tags: ["شامبو", "تساقط الشعر", "فيشي", "ديركوس", "أمينكسيل"],
  },
  {
    _id: "prod-8",
    name: "كريم مرمم ومهدئ للبشرة المتهيجة والمتضررة Cicaplast Baume B5+",
    slug: "cicaplast-baume-b5",
    brand: "La Roche-Posay",
    brandId: "b-1",
    category: "العناية بالبشرة",
    categorySlug: "skincare",
    subCategory: "مرطبات وسيرومات",
    subCategorySlug: "serums-hydratants",
    price: 2150,
    images: [
      { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80", alt: "سيكابلاست بلسم B5", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 60,
    rating: 4.9,
    reviewsCount: 110,
    sizeOrVolume: "40 مل",
    variants: [
      { name: "الحجم", option: "40 مل", priceDelta: 0, stockQuantity: 35 },
      { name: "الحجم", option: "100 مل", priceDelta: 900, stockQuantity: 25 },
    ],
    description: "بلسم علاجي متعدد الاستخدامات يهدئ ويرمم البشرة المتهيجة والجافة وشديدة الحساسية، مناسب للرضع والأطفال والبالغين في حالات الحروق الخفيفة، الجروح السطحية، والتهابات الحفاض.",
    usageInstructions: "يطبق مرتين يومياً على بشرة نظيفة وجافة بعد غسلها، يمكن تطبيقه على الجسم والوجه والشفتين.",
    healthWarnings: "تجنب تطبيقه مباشرة على الجروح المفتوحة والنازفة.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["سيكابلاست", "ترميم", "تهيج", "لاروش", "أطفال"],
  },
  {
    _id: "prod-9",
    name: "لوشن مرطب يومي مهدئ للبشرة الحساسة والجافة جداً Lipikar Baume AP+M",
    slug: "lipikar-baume-apm",
    brand: "La Roche-Posay",
    brandId: "b-1",
    category: "العناية بالبشرة",
    categorySlug: "skincare",
    price: 3600,
    originalPrice: 4200,
    discountPercentage: 14,
    images: [
      { url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80", alt: "ليبيكار بالم AP+M", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 32,
    rating: 4.9,
    reviewsCount: 88,
    sizeOrVolume: "400 مل",
    description: "بلسم ترطيب ثلاثي المفعول مضاد للحكة ومضاد للانتكاس يهدئ على الفور البشرة شديدة الجفاف والمصابة بالأكزيما لكامل أفراد العائلة.",
    usageInstructions: "يوضع مرة يومياً على بشرة نظيفة بعد الاستحمام على الجسم والوجه.",
    healthWarnings: "للاستعمال الخارجي فقط.",
    isFeatured: true,
    isBestSeller: true,
    tags: ["ليبيكار", "ترطيب", "بشرة جافة", "أكزيما", "لاروش"],
  },
  {
    _id: "prod-10",
    name: "بخاخ واقي شمس شفاف ومنعش SPF 50 Anthelios للجسم والوجه",
    slug: "anthelios-transparent-spray-spf50",
    brand: "La Roche-Posay",
    brandId: "b-1",
    category: "واقيات الشمس",
    categorySlug: "sun-protection",
    price: 3400,
    originalPrice: 3900,
    discountPercentage: 13,
    images: [
      { url: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80", alt: "بخاخ أنثيليوس للجسم", isPrimary: true },
    ],
    inStock: true,
    stockQuantity: 22,
    rating: 4.8,
    reviewsCount: 36,
    sizeOrVolume: "200 مل",
    description: "رذاذ شفاف غير مرئي وسريع الامتصاص يوفر حماية واسعة النطاق من أشعة الشمس ومقاوم للماء والتعرق.",
    usageInstructions: "يرج جيداً قبل الاستخدام ويرش بسخاء وبشكل متساوٍ على بعد 20 سم من الجلد.",
    healthWarnings: "لا يرش مباشرة على الوجه، يرش على راحة اليدين ثم يوزع على الوجه.",
    isFeatured: true,
    tags: ["بخاخ شمس", "أنثيليوس", "واقي شمس", "لاروش"],
  },
];

export const MOCK_BANNERS: MockBanner[] = [
  {
    _id: "banner-1",
    title: "عناية فائقة لبشرة متألقة تدوم طوال اليوم",
    subtitle: "اكتشف تشكيلة السيرومات وواقيات الشمس الأكثر طلباً بأسعار معتمدة ومميزة",
    badgeText: "تخفيضات موسمية حصرية",
    imageUrlDesktop: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&auto=format&fit=crop&q=85",
    imageUrlMobile: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=85",
    linkUrl: "/category/skincare",
    buttonText: "تسوق تشكيلة العناية",
    accentColor: "from-brand-deep to-brand-teal",
  },
  {
    _id: "banner-2",
    title: "توصيل سريع وموثوق لكافة الـ 69 ولاية في الجزائر 🇩🇿",
    subtitle: "اطلب مستحضراتك الأصلية واستلمها في باب منزلك أو من أقرب مكتب توزيع مع الدفع عند الاستلام",
    badgeText: "تغطية وطنية شاملة",
    imageUrlDesktop: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1600&auto=format&fit=crop&q=85",
    imageUrlMobile: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=85",
    linkUrl: "/offers",
    buttonText: "استكشف العروض الحالية",
    accentColor: "from-brand-teal to-brand-green",
  },
  {
    _id: "banner-3",
    title: "فيتامينات ومكملات غذائية أصلية لتعزيز طاقتك ومناعتك",
    subtitle: "تشكيلة متكاملة من أجود المكملات والفيتامينات العالمية المعتمدة لصحة أفضل لك ولعائلتك",
    badgeText: "صحة ونشاط دائم",
    imageUrlDesktop: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1600&auto=format&fit=crop&q=85",
    imageUrlMobile: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&auto=format&fit=crop&q=85",
    linkUrl: "/category/vitamins",
    buttonText: "تسوق الفيتامينات والمكملات",
    accentColor: "from-brand-deep to-brand-turquoise",
  },
];
