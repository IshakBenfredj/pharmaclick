import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * نموذج التصنيفات وفئات المستحضرات (Category Document)
 *
 * @description
 * يمثل شجرة التصنيفات الرئيسية والفرعية لمستحضرات العناية والصحة والجمال.
 * يدعم اللغتين العربية والفرنسية، والأيقونات المعتمدة، والعلاقات الهرمية (Parent/Subcategories).
 *
 * @example
 * ```typescript
 * import { Category } from '@/models';
 *
 * // 1. إنشاء تصنيف رئيسي
 * const mainCat = await Category.create({
 *   nameAr: 'العناية بالبشرة',
 *   nameFr: 'Soins de la Peau',
 *   slug: 'skincare',
 *   icon: 'Droplets',
 *   image: '/images/categories/skincare.webp',
 *   descriptionAr: 'منتجات ومستحضرات معتمدة لصحة ونضارة مختلف أنواع البشرة',
 *   sortOrder: 1,
 *   isActive: true,
 * });
 *
 * // 2. إنشاء تصنيف فرعي ينتمي للتصنيف الرئيسي
 * const subCat = await Category.create({
 *   nameAr: 'واقيات الشمس',
 *   nameFr: 'Protections Solaires',
 *   slug: 'sun-protection',
 *   icon: 'ShieldCheck',
 *   parentCategory: mainCat._id,
 *   sortOrder: 1,
 *   isActive: true,
 * });
 *
 * // 3. جلب التصنيفات الرئيسية مع تضمين تصنيفاتها الفرعية
 * const tree = await Category.find({ parentCategory: null, isActive: true })
 *   .populate('subCategories')
 *   .sort({ sortOrder: 1 });
 * ```
 */
export interface ICategory extends Document {
  /** اسم التصنيف باللغة العربية */
  nameAr: string;
  /** اسم التصنيف باللغة الفرنسية */
  nameFr: string;
  /** المعرف اللطيف في الروابط (URL slug) */
  slug: string;
  /** اسم الأيقونة المعتمدة (مثل 'Droplets', 'Heart', 'ShieldCheck', 'Scissors') */
  icon?: string;
  /** رابط صورة الغلاف التوضيحية للقسم */
  image?: string;
  /** وصف القسم باللغة العربية */
  descriptionAr?: string;
  /** وصف القسم باللغة الفرنسية */
  descriptionFr?: string;
  /** المعرف المرجعي للتصنيف الأب (إذا كان تصنيفاً فرعياً، null إذا كان قسماً رئيسياً) */
  parentCategory?: mongoose.Types.ObjectId;
  /** ترتيب الظهور في القوائم والواجهة */
  sortOrder: number;
  /** حالة التفعيل وظهور التصنيف للزوار */
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    nameAr: {
      type: String,
      required: [true, 'اسم التصنيف بالعربية مطلوب'],
      trim: true,
    },
    nameFr: {
      type: String,
      required: [true, 'اسم التصنيف بالفرنسية مطلوب'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'المعرف اللطيف (Slug) مطلوب'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    icon: {
      type: String,
      trim: true,
      default: 'ShoppingBag',
    },
    image: {
      type: String,
      trim: true,
    },
    descriptionAr: {
      type: String,
      trim: true,
    },
    descriptionFr: {
      type: String,
      trim: true,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
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

// Virtual for subcategories
CategorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory',
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
