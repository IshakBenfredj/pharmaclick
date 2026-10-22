import mongoose, { Schema, Document, Model } from 'mongoose';

export type SectionSelectionType = 'manual' | 'dynamic';
export type DynamicCriteriaType =
  | 'on_sale'
  | 'featured'
  | 'best_sellers'
  | 'most_viewed'
  | 'by_category';

/**
 * نموذج الأقسام الترويجية بالصفحة الرئيسية (Marketing Section Document)
 *
 * @description
 * يتحكم في الأقسام الترويجية التفاعلية المعروضة في الصفحة الرئيسية (مثل: "عناية بأسعار أحلى",
 * "الأكثر طلباً", "اختيارات نضارة وحيوية", "عروض حصرية").
 * يدعم كلاً من الاختيار اليدوي لمستحضرات محددة أو الاختيار الديناميكي وفق شروط (خصومات، مبيعات، قسم).
 *
 * @example
 * ```typescript
 * import { MarketingSection, Product } from '@/models';
 *
 * // 1. إنشاء قسم ترويجي ديناميكي للعروض والتخفيضات
 * const discountSection = await MarketingSection.create({
 *   title: 'عناية بأسعار أحلى',
 *   subtitle: 'تخفيضات استثنائية على أشهر مستحضرات العناية المعتمدة',
 *   emoji: '🏷️',
 *   badgeText: 'تخفيضات لفترة محدودة',
 *   selectionType: 'dynamic',
 *   dynamicCriteria: 'on_sale',
 *   limit: 8,
 *   sortOrder: 1,
 *   isActive: true,
 * });
 *
 * // 2. جلب الأقسام الفعالة مع المنتجات المضمنة
 * const sections = await MarketingSection.find({ isActive: true })
 *   .populate('products')
 *   .sort({ sortOrder: 1 });
 * ```
 */
export interface IMarketingSection extends Document {
  /** عنوان القسم الترويجي الرئيسي بالعربية (إجباري) */
  title: string;
  /** عنوان القسم بالفرنسية (اختياري) */
  titleFr?: string;
  /** عنوان القسم بالإنجليزية (اختياري) */
  titleEn?: string;
  /** وصف توضيحي أو عنوان فرعي داعم بالعربية */
  subtitle?: string;
  /** وصف فرعي بالفرنسية (اختياري) */
  subtitleFr?: string;
  /** وصف فرعي بالإنجليزية (اختياري) */
  subtitleEn?: string;
  /** الرمز التعبيري المصاحب للعنوان (مثل '🔥', '🌿', '💎', '🏷️') */
  emoji?: string;
  /** شارة نصية صغيرة بالعربية (مثل 'عروض حصرية' أو 'الأكثر طلباً') */
  badgeText?: string;
  /** شارة نصية بالفرنسية (اختياري) */
  badgeTextFr?: string;
  /** شارة نصية بالإنجليزية (اختياري) */
  badgeTextEn?: string;
  /** نوع الاختيار: 'manual' لقائمة محددة يدوياً، أو 'dynamic' وفق معايير آلية */
  selectionType: SectionSelectionType;
  /** معيار الاختيار الديناميكي (on_sale, featured, best_sellers, most_viewed, by_category) */
  dynamicCriteria?: DynamicCriteriaType;
  /** القسم المستهدف في حال كان الاختيار حسب التصنيف (by_category) */
  targetCategory?: mongoose.Types.ObjectId;
  /** مصفوفة معرّفات المستحضرات المحددة يدوياً */
  products: mongoose.Types.ObjectId[];
  /** الحد الأقصى للمنتجات المعروضة في هذا القسم (الافتراضي 8) */
  limit: number;
  /** ترتيب ظهور القسم في الصفحة الرئيسية */
  sortOrder: number;
  /** حالة التفعيل وظهور القسم في الواجهة */
  isActive: boolean;
  /** لون خلفية اختياري مخصص للقسم */
  backgroundColor?: string;
  /** دالة مدمجة ذكية لجلب المنتجات سواء كان الاختيار يدوياً أو ديناميكياً */
  getResolvedProducts(): Promise<any[]>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketingSectionSchema = new Schema<IMarketingSection>(
  {
    title: {
      type: String,
      required: [true, 'عنوان القسم الترويجي مطلوب'],
      trim: true,
    },
    titleFr: {
      type: String,
      trim: true,
      default: '',
    },
    titleEn: {
      type: String,
      trim: true,
      default: '',
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
    },
    subtitleFr: {
      type: String,
      trim: true,
      default: '',
    },
    subtitleEn: {
      type: String,
      trim: true,
      default: '',
    },
    emoji: {
      type: String,
      default: '🏷️',
      trim: true,
    },
    badgeText: {
      type: String,
      trim: true,
      default: '',
    },
    badgeTextFr: {
      type: String,
      trim: true,
      default: '',
    },
    badgeTextEn: {
      type: String,
      trim: true,
      default: '',
    },
    selectionType: {
      type: String,
      enum: ['manual', 'dynamic'],
      default: 'manual',
      required: true,
    },
    dynamicCriteria: {
      type: String,
      enum: ['on_sale', 'featured', 'best_sellers', 'most_viewed', 'by_category'],
      default: 'featured',
    },
    targetCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    limit: {
      type: Number,
      default: 8,
      min: 1,
      max: 100,
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
    backgroundColor: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to resolve products whether manually selected or dynamically queried
MarketingSectionSchema.methods.getResolvedProducts = async function (): Promise<any[]> {
  const Product = mongoose.models.Product || mongoose.model('Product');

  if (this.selectionType === 'manual') {
    if (!this.products || this.products.length === 0) {
      return [];
    }
    // Fetch manually selected products preserving order and filtering active/in-stock items
    const foundProducts = await Product.find({
      _id: { $in: this.products },
      isOnlineVisible: true,
    }).populate('category', 'nameAr nameFr slug');

    // Maintain the admin-curated order of products - for manual selection it is OPEN (no limit slice)
    const productMap = new Map(
      foundProducts.map((p: any) => [p._id.toString(), p])
    );
    return this.products
      .map((id: any) => productMap.get(id.toString()))
      .filter(Boolean);
  }

  // Dynamic selection criteria
  const query: Record<string, any> = { isOnlineVisible: true, inStock: true };
  const sort: Record<string, any> = {};

  // If a target category is specified, scope results to that category and its subcategories
  if (this.targetCategory) {
    try {
      const Category = mongoose.models.Category || mongoose.model('Category');
      const childCategories = await Category.find({ parentCategory: this.targetCategory }).select('_id');
      const categoryScope = [this.targetCategory, ...childCategories.map((c: any) => c._id)];
      query.$or = [
        { category: { $in: categoryScope } },
        { subCategory: { $in: categoryScope } },
      ];
    } catch {
      query.category = this.targetCategory;
    }
  }

  switch (this.dynamicCriteria) {
    case 'on_sale':
      query.discountPercentage = { $gt: 0 };
      sort.discountPercentage = -1;
      break;
    case 'featured':
      query.isFeatured = true;
      sort.createdAt = -1;
      break;
    case 'best_sellers':
      sort.orderCount = -1;
      break;
    case 'most_viewed':
      sort.viewCount = -1;
      break;
    case 'by_category':
      // Scoped above via targetCategory
      sort.createdAt = -1;
      break;
    default:
      sort.createdAt = -1;
  }

  const queryLimit = this.limit && this.limit > 0 ? this.limit : 8;
  return await Product.find(query)
    .populate('category', 'nameAr nameFr slug')
    .sort(sort)
    .limit(queryLimit);
};

const MarketingSection: Model<IMarketingSection> =
  (mongoose.models.MarketingSection as Model<IMarketingSection>) ||
  mongoose.model<IMarketingSection>('MarketingSection', MarketingSectionSchema);

export default MarketingSection;
