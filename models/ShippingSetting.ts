import mongoose, { Schema, Document, Model } from 'mongoose';
import { ALGERIA_WILAYAS } from '@/lib/constants/wilayas';

/**
 * نموذج إعدادات الشحن والتوصيل لولايات الجزائر (Shipping Setting Document)
 *
 * @description
 * يدير تعريفات ورسوم التوصيل لكامل المعيار الإداري لولايات الجزائر (69 ولاية كاملة).
 * يدعم تسعير التوصيل للمنزل (Home Delivery) ومكتب التوزيع (Stop Desk)،
 * وأيام التوصيل المتوقعة، والحد الأدنى للشحن المجاني، مع دالة التهيئة الجماعية (seedDefaultWilayas).
 *
 * @example
 * ```typescript
 * import { ShippingSetting } from '@/models';
 *
 * // 1. تهيئة الـ 69 ولاية كاملة لأول مرة في النظام
 * const seeded = await ShippingSetting.seedDefaultWilayas();
 * console.log(`تم تهيئة ${seeded} ولاية بنجاح.`);
 *
 * // 2. استعلام رسوم التوصيل لولاية وهران (ولاية 31)
 * const setting = await ShippingSetting.findOne({ wilayaCode: 31, isAvailable: true });
 * console.log(`توصيل للمنزل: ${setting?.homeDeliveryFee} دج، للمكتب: ${setting?.deskDeliveryFee} دج`);
 *
 * // 3. تخصيص شحن مجاني للطلبات فوق 10,000 دج في ولاية معينة
 * await ShippingSetting.findOneAndUpdate(
 *   { wilayaCode: 16 },
 *   { minFreeShippingAmount: 10000 }
 * );
 * ```
 */
export interface IShippingSetting extends Document {
  /** رمز الولاية الإداري الرسمي من 1 إلى 69 */
  wilayaCode: number;
  /** اسم الولاية باللغة العربية */
  nameAr: string;
  /** اسم الولاية باللغة الفرنسية */
  nameFr: string;
  /** قائمة بلديات الولاية المتاحة للتوصيل */
  communes: string[];
  /** سعر التوصيل المباشر حتى باب المنزل بالدينار الجزائري */
  homeDeliveryFee: number;
  /** سعر التوصيل حتى مكتب شركة الشحن والتوزيع (Stop Desk) */
  deskDeliveryFee: number;
  /** المدة الزمنية التقديرية لوصول الشحنة (مثل '24-48 ساعة' أو '2-3 أيام') */
  estimatedDays: string;
  /** حالة توفر وإتاحة الشحن لهذه الولاية */
  isAvailable: boolean;
  /** الحد الأدنى لقيمة السلة المالية للحصول على شحن مجاني (إن تم تفعيله) */
  minFreeShippingAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingSettingSchema = new Schema<IShippingSetting>(
  {
    wilayaCode: {
      type: Number,
      required: [true, 'رمز الولاية مطلوب'],
      unique: true,
      min: [1, 'رمز الولاية يجب أن يكون 1 على الأقل'],
      max: [69, 'عدد ولايات الجزائر المعتمد هو 69 ولاية حصراً'],
      index: true,
    },
    nameAr: {
      type: String,
      required: [true, 'اسم الولاية بالعربية مطلوب'],
      trim: true,
    },
    nameFr: {
      type: String,
      required: [true, 'اسم الولاية بالفرنسية مطلوب'],
      trim: true,
    },
    communes: {
      type: [String],
      default: [],
    },
    homeDeliveryFee: {
      type: Number,
      required: true,
      default: 600,
      min: 0,
    },
    deskDeliveryFee: {
      type: Number,
      required: true,
      default: 400,
      min: 0,
    },
    estimatedDays: {
      type: String,
      default: '24-48 ساعة',
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    minFreeShippingAmount: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export interface IShippingSettingModel extends Model<IShippingSetting> {
  seedDefaultWilayas(): Promise<number>;
}

// Static helper to seed all 69 Wilayas with default tariffs
ShippingSettingSchema.statics.seedDefaultWilayas = async function (): Promise<number> {
  let seededCount = 0;
  for (const w of ALGERIA_WILAYAS) {
    const existing = await this.findOne({ wilayaCode: w.code });
    if (!existing) {
      await this.create({
        wilayaCode: w.code,
        nameAr: w.nameAr,
        nameFr: w.nameFr,
        homeDeliveryFee: w.defaultHomeFee,
        deskDeliveryFee: w.defaultDeskFee,
        estimatedDays: w.estimatedDays,
        isAvailable: true,
      });
      seededCount++;
    }
  }
  return seededCount;
};

const ShippingSetting: IShippingSettingModel =
  (mongoose.models.ShippingSetting as IShippingSettingModel) ||
  mongoose.model<IShippingSetting, IShippingSettingModel>('ShippingSetting', ShippingSettingSchema);

export default ShippingSetting;
