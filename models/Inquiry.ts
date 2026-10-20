import mongoose, { Schema, Document, Model } from 'mongoose';

export type InquiryStatus =
  | 'pending' // قيد التدقيق والمراجعة
  | 'in_review' // جاري التحقق من التوفر في المخزون
  | 'available' // متوفر وجاهز للاستلام
  | 'alternative_available' // متوفر كبديل مكافئ معتمد
  | 'unavailable' // غير متوفر حالياً
  | 'closed'; // تم الرد والتواصل مع المريض بنجاح

/**
 * نموذج خدمة الاستفسار عن توفر الأدوية والمستحضرات (Inquiry Document)
 *
 * @description
 * خدمة تتيح للزبائن والمراجعين الاستفسار عن توفر دواء أو مستحضر نادر أو غير موجود بالمتجر،
 * مع إمكانية إرفاق صورة العلبة لتأكيد مطابقة الاسم والتركيز، ومتابعة الرد واقتراح البدائل المعتمدة.
 *
 * @example
 * ```typescript
 * import { Inquiry } from '@/models';
 *
 * // 1. إرسال استفسار جديد من الزبون عن دواء
 * const inquiry = await Inquiry.create({
 *   medicationName: 'Augmentin 1g Sachets',
 *   images: ['/uploads/inquiries/box-photo.webp'],
 *   patientName: 'عمر الخالد',
 *   patientPhone: '0655112233',
 *   notes: 'أبحث عن علبة من 14 كيس، هل هي متوفرة لديكم؟',
 *   status: 'pending',
 * });
 *
 * // 2. قيام الأخصائي المعتمد بالرد مع توفير البديل المكافئ
 * await Inquiry.findByIdAndUpdate(inquiry._id, {
 *   status: 'alternative_available',
 *   responseNotes: 'الاسم التجاري المطلوب غير متوفر حالياً، يتوفر لدينا البديل الجنيس المعتمد بنفس المادة الفعالة والجرعة (Amoxicilline / Acide Clavulanique 1g).',
 *   alternativeSuggestions: 'Clavulin 1g أو Amoclan 1g متوفران وجاهزان للاستلام.',
 *   respondedAt: new Date(),
 * });
 * ```
 */
export interface IInquiry extends Document {
  /** الرقم المرجعي الفريد للاستفسار (مثل INQ-48201) */
  inquiryNumber: string;
  /** اسم الدواء أو المستحضر المراد الاستفسار عنه */
  medicationName: string;
  /** صور توضيحية لعلبة الدواء أو العبوة إن وجدت */
  images?: string[];
  /** اسم المريض أو المستفسر */
  patientName?: string;
  /** رقم هاتف المريض المباشر لتلقي الرد */
  patientPhone: string;
  /** ملاحظات إضافية من المريض (الجرعة المطلوبة، شكل المستحضر كأقراص أو كبسولات أو شراب) */
  notes?: string;
  /** حالة معالجة الاستفسار (pending, in_review, available, alternative_available, unavailable, closed) */
  status: InquiryStatus;
  /** رد الأخصائي المعتمد وتوضيحاته للمريض */
  responseNotes?: string;
  /** اقتراحات البدائل المتطابقة في المادة والجرعة في حال عدم توفر نفس الاسم التجاري */
  alternativeSuggestions?: string;
  /** المعرف المرجعي للمسؤول أو الأخصائي الذي دون الرد */
  respondedBy?: mongoose.Types.ObjectId;
  /** توقيت تسجيل الرد */
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    inquiryNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    medicationName: {
      type: String,
      required: [true, 'اسم الدواء أو المستحضر المطلوب إجباري'],
      trim: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    patientName: {
      type: String,
      trim: true,
    },
    patientPhone: {
      type: String,
      required: [true, 'رقم الهاتف للتواصل وموافاتكم بالرد إجباري'],
      trim: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'in_review',
        'available',
        'alternative_available',
        'unavailable',
        'closed',
      ],
      default: 'pending',
      index: true,
    },
    responseNotes: {
      type: String,
      trim: true,
    },
    alternativeSuggestions: {
      type: String,
      trim: true,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate inquiryNumber
InquirySchema.pre('validate', function () {
  if (!this.inquiryNumber) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    this.inquiryNumber = `INQ-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
});

const Inquiry: Model<IInquiry> =
  (mongoose.models.Inquiry as Model<IInquiry>) ||
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
