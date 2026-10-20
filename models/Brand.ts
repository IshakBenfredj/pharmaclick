import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * نموذج العلامات التجارية والماركات المعتمدة (Brand Document)
 *
 * @description
 * يمثل العلامات التجارية العالمية والمحلية المعتمدة لمستحضرات العناية والصحة المعروضة بالمتجر
 * (مثل La Roche-Posay, Cerave, Bioderma, Vichy وغيرها).
 *
 * @example
 * ```typescript
 * import { Brand, Product } from '@/models';
 *
 * // 1. إضافة علامة تجارية معتمدة جديدة
 * const brand = await Brand.create({
 *   name: 'لاروش بوزيه',
 *   slug: 'la-roche-posay',
 *   logoUrl: '/images/brands/laroche.webp',
 *   description: 'الماركة الرائدة الموصى بها من أطباء الجلد عالمياً للعناية بالبشرة الحساسة',
 *   countryOfOrigin: 'فرنسا',
 *   isFeatured: true,
 *   sortOrder: 1,
 *   isActive: true,
 * });
 *
 * // 2. جلب جميع منتجات علامة تجارية معينة
 * const brandProducts = await Product.find({ brand: brand._id, inStock: true });
 * ```
 */
export interface IBrand extends Document {
  /** اسم العلامة التجارية التجاري المعتمد */
  name: string;
  /** المعرف اللطيف في الروابط (URL slug) */
  slug: string;
  /** رابط الشعار الرسمي للماركة بجودة عالية */
  logoUrl?: string;
  /** نبذة تعريفية وفلسفة العلامة التجارية */
  description?: string;
  /** الموقع الإلكتروني الرسمي للشركة المصنعة */
  website?: string;
  /** بلد المنشأ (مثل: فرنسا، إسبانيا، الجزائر، ألمانيا) */
  countryOfOrigin?: string;
  /** هل الماركة مميزة لتظهر في شريط الماركات بالصفحة الرئيسية */
  isFeatured: boolean;
  /** ترتيب الظهور في شبكة الماركات */
  sortOrder: number;
  /** حالة التفعيل وظهور الماركة */
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: [true, 'اسم العلامة التجارية مطلوب'],
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'المعرف اللطيف (Slug) مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    countryOfOrigin: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand: Model<IBrand> =
  (mongoose.models.Brand as Model<IBrand>) ||
  mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
