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
  /** عنوان القسم الترويجي الرئيسي */
  title: string;
  /** وصف توضيحي أو عنوان فرعي داعم */
  subtitle?: string;
  /** الرمز التعبيري المصاحب للعنوان (مثل '🔥', '🌿', '💎', '🏷️') */
  emoji?: string;
  /** شارة نصية صغيرة تظهر فوق العنوان (مثل 'عروض حصرية' أو 'الأكثر طلباً') */
  badgeText?: string;
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
    subtitle: {
      type: String,
      trim: true,
    },
    emoji: {
      type: String,
      default: '🏷️',
      trim: true,
    },
    badgeText: {
      type: String,
      trim: true,
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
      max: 24,
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

    // Maintain the admin-curated order of products
    const productMap = new Map(
      foundProducts.map((p: any) => [p._id.toString(), p])
    );
    return this.products
      .map((id: any) => productMap.get(id.toString()))
      .filter(Boolean)
      .slice(0, this.limit || 8);
  }

  // Dynamic selection criteria
  const query: Record<string, any> = { isOnlineVisible: true, inStock: true };
  const sort: Record<string, any> = {};

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
      if (this.targetCategory) {
        query.category = this.targetCategory;
      }
      sort.createdAt = -1;
      break;
    default:
      sort.createdAt = -1;
  }

  return await Product.find(query)
    .populate('category', 'nameAr nameFr slug')
    .sort(sort)
    .limit(this.limit || 8);
};

const MarketingSection: Model<IMarketingSection> =
  (mongoose.models.MarketingSection as Model<IMarketingSection>) ||
  mongoose.model<IMarketingSection>('MarketingSection', MarketingSectionSchema);

export default MarketingSection;
