import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * نموذج اللافتات الإعلانية المنزلقة (Banner Document)
 *
 * @description
 * يمثل اللافتات الترويجية المعروضة في السلايدر الرئيسي بالصفحة الرئيسية.
 * يدعم صوراً متجاوبة منفصلة لكل من شاشات سطح المكتب والهواتف الذكية مع جدولة زمنية للبدء والانتهاء.
 *
 * @example
 * ```typescript
 * import { Banner } from '@/models';
 *
 * // 1. إنشاء لافتة إعلانية لحملة ترويجية مجدولة
 * const heroBanner = await Banner.create({
 *   title: 'عناية فائقة لبشرة متألقة طوال اليوم',
 *   subtitle: 'اكتشف أرقى مستحضرات الترطيب والحماية المعتمدة',
 *   imageUrlDesktop: '/images/banners/skincare-hero-desktop.webp',
 *   imageUrlMobile: '/images/banners/skincare-hero-mobile.webp',
 *   linkUrl: '/category/skincare',
 *   buttonText: 'تسوق الآن',
 *   sortOrder: 1,
 *   startDate: new Date('2026-10-01'),
 *   endDate: new Date('2026-11-30'),
 *   isActive: true,
 * });
 *
 * // 2. جلب اللافتات النشطة حالياً ضمن نطاق التاريخ الصالح
 * const now = new Date();
 * const activeBanners = await Banner.find({
 *   isActive: true,
 *   $and: [
 *     { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
 *     { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
 *   ],
 * }).sort({ sortOrder: 1 });
 * ```
 */
export interface IBanner extends Document {
  /** العنوان الرئيسي للافتة بالعربية (إجباري) */
  title: string;
  /** العنوان بالفرنسية (اختياري) */
  titleFr?: string;
  /** العنوان بالإنجليزية (اختياري) */
  titleEn?: string;
  /** وصف فرعي أو نص تشويقي بالعربية */
  subtitle?: string;
  /** وصف فرعي بالفرنسية (اختياري) */
  subtitleFr?: string;
  /** وصف فرعي بالإنجليزية (اختياري) */
  subtitleEn?: string;
  /** نص الشارة الترويجية بالعربية (مثل تخفيضات حصرية) */
  badgeText?: string;
  /** نص الشارة بالفرنسية (اختياري) */
  badgeTextFr?: string;
  /** نص الشارة بالإنجليزية (اختياري) */
  badgeTextEn?: string;
  /** رابط الصورة عريضة الدقة المخصصة لشاشات الحواسيب والأجهزة اللوحية */
  imageUrlDesktop: string;
  /** رابط الصورة الرأسية المخصصة لشاشات الهواتف المحمولة */
  imageUrlMobile?: string;
  /** رابط التوجيه عند النقر (داخلي مثل /category/haircare أو خارجي) */
  linkUrl: string;
  /** النص المكتوب داخل زر التفاعل (CTA) بالعربية */
  buttonText?: string;
  /** نص زر التفاعل بالفرنسية (اختياري) */
  buttonTextFr?: string;
  /** نص زر التفاعل بالإنجليزية (اختياري) */
  buttonTextEn?: string;
  /** ترتيب عرض اللافتة في السلايدر المنزلق */
  sortOrder: number;
  /** تاريخ بداية سريان الحملة الإعلانية (اختياري) */
  startDate?: Date;
  /** تاريخ نهاية الحملة الإعلانية (اختياري) */
  endDate?: Date;
  /** حالة تفعيل اللافتة للظهور للعملاء */
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'عنوان اللافتة الإعلانية مطلوب'],
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
    imageUrlDesktop: {
      type: String,
      required: [true, 'صورة سطح المكتب مطلوبة'],
      trim: true,
    },
    imageUrlMobile: {
      type: String,
      trim: true,
      default: '',
    },
    badgeText: {
      type: String,
      trim: true,
      default: 'عرض حصري',
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
    linkUrl: {
      type: String,
      required: [true, 'رابط التوجيه مطلوب'],
      trim: true,
    },
    buttonText: {
      type: String,
      default: 'اكتشف الآن',
      trim: true,
    },
    buttonTextFr: {
      type: String,
      trim: true,
      default: '',
    },
    buttonTextEn: {
      type: String,
      trim: true,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
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

// Method to check if banner is currently active according to date range
BannerSchema.methods.isCurrentlyActive = function (): boolean {
  if (!this.isActive) return false;
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
};

const Banner: Model<IBanner> =
  (mongoose.models.Banner as Model<IBanner>) ||
  mongoose.model<IBanner>('Banner', BannerSchema);

export default Banner;
