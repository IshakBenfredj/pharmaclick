import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * واجهة تمثيل متغيرات المستحضر (الأحجام أو التراكيز)
 * @property name - نوع المتغير مثل "الحجم" أو "التركيز"
 * @property option - القيمة المحددة مثل "50ml", "100ml", "500mg"
 * @property priceDelta - فارق السعر عن السعر الأساسي للمنتج (إن وجد)
 * @property sku - رمز التخزين الفريد للمتغير
 * @property stockQuantity - كمية المخزون المتاحة لهذا المتغير بعينه
 */
export interface IProductVariant {
  name: string;
  option: string;
  priceDelta?: number;
  sku?: string;
  stockQuantity: number;
}

/**
 * واجهة صور المستحضر
 * @property url - رابط الصورة السحابي (Cloudflare R2 / CDN)
 * @property alt - النص البديل التوضيحي للصورة لمحركات البحث
 * @property isPrimary - تحديد ما إذا كانت هذه هي الصورة الرئيسية المعروضة في البطاقة
 */
export interface IProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

/**
 * نموذج المستحضرات المعتمدة ومنتجات العناية (Product Document)
 *
 * @description
 * يمثل هذا النموذج مستحضرات العناية بالبشرة، المكملات الغذائية، والأجهزة الطبية وشبه الطبية.
 * يشمل الأسعار، نسب الخصومات المحسوبة تلقائياً، إرشادات الاستخدام الآمن، وتحذيرات الصحة.
 *
 * @example
 * ```typescript
 * import { Product } from '@/models';
 *
 * // 1. إنشاء مستحضر جديد مع متغيرات وخصم
 * const newProduct = await Product.create({
 *   name: 'سيروم حمض الهيالورونيك المرطب B5',
 *   slug: 'hyaluronic-acid-b5-serum',
 *   description: 'سيروم مركز لترطيب وتجديد نضارة البشرة الجافة والحساسة.',
 *   price: 3200,
 *   originalPrice: 4000, // سينتج عنه discountPercentage = 20% تلقائياً
 *   category: categoryId,
 *   brand: brandId,
 *   images: [
 *     { url: '/images/products/serum-1.webp', alt: 'سيروم مرطب', isPrimary: true },
 *   ],
 *   inStock: true,
 *   stockQuantity: 25,
 *   variants: [
 *     { name: 'الحجم', option: '30ml', priceDelta: 0, stockQuantity: 15 },
 *     { name: 'الحجم', option: '50ml', priceDelta: 800, stockQuantity: 10 },
 *   ],
 *   usageInstructions: 'توضع قطرات قليلة صباحاً ومساءً على بشرة نظيفة ورطبة قبل الكريم.',
 *   healthWarnings: 'للاستعمال الخارجي فقط. تجنب ملامسة العينين مباشرة.',
 *   isFeatured: true,
 *   isOnlineVisible: true,
 *   tags: ['ترطيب', 'عناية بالبشرة', 'حمض الهيالورونيك'],
 * });
 *
 * // 2. استعلام مع جلب بيانات التصنيف والعلامة التجارية
 * const products = await Product.find({ isOnlineVisible: true, inStock: true })
 *   .populate('category', 'nameAr nameFr slug')
 *   .populate('brand', 'name logoUrl')
 *   .sort({ orderCount: -1 });
 * ```
 */
export interface IProduct extends Document {
  /** اسم المستحضر التجاري الكامل بالعربية (إجباري) */
  name: string;
  /** اسم المستحضر بالعربية */
  nameAr?: string;
  /** اسم المستحضر بالفرنسية (اختياري) */
  nameFr?: string;
  /** اسم المستحضر بالإنجليزية (اختياري) */
  nameEn?: string;
  /** المعرف اللطيف في الروابط (URL-friendly slug) */
  slug: string;
  /** الوصف التفصيلي والفوائد والمكونات بالعربية (إجباري) */
  description: string;
  /** الوصف بالعربية */
  descriptionAr?: string;
  /** الوصف بالفرنسية (اختياري) */
  descriptionFr?: string;
  /** الوصف بالإنجليزية (اختياري) */
  descriptionEn?: string;
  /** نبذة وصفية سريعة تظهر في بطاقات العرض بالعربية */ 
  shortDescription?: string;
  /** نبذة وصفية بالعربية */
  shortDescriptionAr?: string;
  /** نبذة وصفية بالفرنسية (اختياري) */
  shortDescriptionFr?: string;
  /** نبذة وصفية بالإنجليزية (اختياري) */
  shortDescriptionEn?: string;
  /** السعر الفعلي الحالي للبيع بالدينار الجزائري (DZD) */
  price: number;
  /** السعر الأصلي قبل التخفيض إن وجد عرض خاص */
  originalPrice?: number;
  /** نسبة الخصم المئوية (تُحسب تلقائياً في hook الـ pre-save) */
  discountPercentage?: number;
  /** المعرف المرجعي للتصنيف الأساسي */
  category: mongoose.Types.ObjectId;
  /** المعرف المرجعي للتصنيف الفرعي إن وُجد */
  subCategory?: mongoose.Types.ObjectId | null;
  /** المعرف المرجعي للعلامة التجارية */
  brand?: mongoose.Types.ObjectId | null;
  /** مصفوفة صور المستحضر */
  images: IProductImage[];
  /** حالة التوفر الفوري للشراء */
  inStock: boolean;
  /** إجمالي الكمية المتوفرة بالمخزون */
  stockQuantity: number;
  /** خيارات الأحجام أو التراكيز المتوفرة */
  variants: IProductVariant[];
  /** إرشادات وتوجيهات الاستخدام الآمن بالعربية */
  usageInstructions?: string;
  /** إرشادات الاستخدام بالفرنسية (اختياري) */
  usageInstructionsFr?: string;
  /** إرشادات الاستخدام بالإنجليزية (اختياري) */
  usageInstructionsEn?: string;
  /** التحذيرات الصحية وموانع الاستعمال بالعربية */
  healthWarnings?: string;
  /** التحذيرات الصحية وموانع الاستعمال بالفرنسية (اختياري) */
  healthWarningsFr?: string;
  /** التحذيرات الصحية وموانع الاستعمال بالإنجليزية (اختياري) */
  healthWarningsEn?: string;
  /** هل المستحضر مميز ليظهر في الواجهة الرئيسية */
  isFeatured: boolean;
  /** هل المستحضر متاح للعرض والشراء أونلاين */
  isOnlineVisible: boolean;
  /** رمز التخزين الموحد (SKU) */
  sku?: string;
  /** الرمز الشريطي الدولي (Barcode) */
  barcode?: string;
  /** كلمات مفتاحية للبحث والتصنيف */
  tags: string[];
  /** عدد مرات مشاهدة صفحة المستحضر */
  viewCount: number;
  /** إجمالي عدد مرات الشراء الناجحة */
  orderCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    name: { type: String, required: true, trim: true },
    option: { type: String, required: true, trim: true },
    priceDelta: { type: Number, default: 0 },
    sku: { type: String, trim: true },
    stockQuantity: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'اسم المستحضر مطلوب'],
      trim: true,
      index: true,
    },
    nameAr: {
      type: String,
      trim: true,
    },
    nameFr: {
      type: String,
      trim: true,
      default: '',
    },
    nameEn: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      required: [true, 'المعرف اللطيف (Slug) مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'وصف المستحضر مطلوب'],
      trim: true,
    },
    descriptionAr: {
      type: String,
      trim: true,
    },
    descriptionFr: {
      type: String,
      trim: true,
      default: '',
    },
    descriptionEn: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    shortDescriptionAr: {
      type: String,
      trim: true,
    },
    shortDescriptionFr: {
      type: String,
      trim: true,
      default: '',
    },
    shortDescriptionEn: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'سعر المستحضر مطلوب'],
      min: [0, 'السعر لا يمكن أن يكون سالباً'],
      index: true,
    },
    originalPrice: {
      type: Number,
      min: [0, 'السعر الأصلي لا يمكن أن يكون سالباً'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'التصنيف الأساسي مطلوب'],
      index: true,
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      index: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      index: true,
    },
    images: {
      type: [ProductImageSchema],
      default: [],
      validate: {
        validator: (v: IProductImage[]) => Array.isArray(v) && v.length > 0,
        message: 'يجب توفير صورة واحدة على الأقل للمستحضر',
      },
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQuantity: {
      type: Number,
      default: 10,
      min: [0, 'كمية المخزون لا يمكن أن تكون سالبة'],
    },
    variants: {
      type: [ProductVariantSchema],
      default: [],
    },
    usageInstructions: {
      type: String,
      trim: true,
      default: '',
    },
    usageInstructionsFr: {
      type: String,
      trim: true,
      default: '',
    },
    usageInstructionsEn: {
      type: String,
      trim: true,
      default: '',
    },
    healthWarnings: {
      type: String,
      trim: true,
      default: '',
    },
    healthWarningsFr: {
      type: String,
      trim: true,
      default: '',
    },
    healthWarningsEn: {
      type: String,
      trim: true,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isOnlineVisible: {
      type: Boolean,
      default: true,
      index: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    barcode: {
      type: String,
      sparse: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save calculate discount percentage if originalPrice is provided
ProductSchema.pre('save', function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  } else {
    this.discountPercentage = 0;
  }
});

// Compound text index for fast search
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
