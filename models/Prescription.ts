import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * معيار خدمة تحضير وتجهيز الوصفات الطبية (Click & Collect):
 * - الخدمة مخصصة حصراً للاستلام الشخصي من المقر الرئيسي لتوفير وقت الانتظار.
 * - يمنع قطعاً أي توصيل منزلي للوصفات أو الأدوية الطبية.
 * - الإحداثيات الرسمية للمقر: 36.386320783307085, 7.248944842328149
 * - النطاق الجغرافي المسموح به: حتى 5000 متر (5 كم) حصراً.
 */

export type PrescriptionStatus =
  | 'pending' // قيد المراجعة والتدقيق من الأخصائي
  | 'reviewed' // تمت المراجعة والتحقق من التوفر
  | 'preparing' // جاري تحضير وتعبئة الأدوية
  | 'ready_for_pickup' // الأدوية جاهزة ومعبأة للاستلام الفوري من المقر
  | 'completed' // تم الاستلام من قبل المريض
  | 'rejected'; // تعذر التجهيز أو أدوية غير متوفرة

/**
 * واجهة بيانات المريض صاحب الوصفة الطبية
 * @property fullName - الاسم الكامل للمريض
 * @property phone - رقم الهاتف المباشر لتأكيد جاهزية الأدوية عبر رسالة SMS أو اتصال
 * @property nationalId - رقم بطاقة التعريف الوطنية (اختياري)
 * @property hasChifaCard - هل يحمل المريض بطاقة الشفاء للاستفادة من التأمين
 * @property chifaCardNumber - رقم بطاقة الشفاء إن توفرت
 */
export interface IPatientInfo {
  fullName: string;
  phone: string;
  nationalId?: string;
  hasChifaCard: boolean;
  chifaCardNumber?: string;
}

/**
 * لقطة التحقق الجغرافي من موقع المريض
 * @property latitude - خط العرض
 * @property longitude - خط الطول
 * @property distanceInMeters - المسافة المحسوبة بالنسبة لمقرنا (شرط أساسي: يجب أن تكون <= 5000 متر)
 * @property accuracy - دقة تحديد الموقع بالأمتار من جهاز المريض
 */
export interface IUserLocationSnapshot {
  latitude: number;
  longitude: number;
  distanceInMeters: number;
  accuracy?: number;
}

/**
 * نموذج خدمة تحضير الوصفات الطبية المسبقة (Prescription Document - Click & Collect)
 *
 * @description
 * خدمة تحضير وتجهيز الوصفات الطبية مسبقاً للاستلام الشخصي الفوري من مقرنا لتجنب الانتظار.
 * تنبيه نظامي: لا يوجد أي توصيل منزلي للأدوية الطبية نهائياً.
 * النطاق الجغرافي المعتمد: المسافة بين 50 متراً و 5000 متراً من مقرنا (36.386320, 7.248944).
 *
 * @example
 * ```typescript
 * import { Prescription } from '@/models';
 *
 * // 1. إرسال وصفة طبية للتحضير المسبق (زبون في نطاق 2.3 كم)
 * const rx = await Prescription.create({
 *   patient: {
 *     fullName: 'كريم بوجمعة',
 *     phone: '0770334455',
 *     hasChifaCard: true,
 *     chifaCardNumber: '123456789012',
 *   },
 *   prescriptionImages: [
 *     '/uploads/prescriptions/rx-sample-front.webp',
 *   ],
 *   userLocation: {
 *     latitude: 36.389100,
 *     longitude: 7.251200,
 *     distanceInMeters: 2300, // أقل من 5 كم
 *     accuracy: 15,
 *   },
 *   expectedPickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // بعد ساعتين
 *   patientNotes: 'يرجى إعلامي عند جاهزية الأدوية واستخراج قسيمة الشفاء.',
 *   status: 'pending',
 * });
 *
 * // 2. قيام الأخصائي المعتمد بفحص الوصفة وتحديث حالتها
 * await Prescription.findByIdAndUpdate(rx._id, {
 *   status: 'ready_for_pickup',
 *   readyAt: new Date(),
 *   internalNotes: 'تم تجهيز وتعبئة الأدوية بالكامل مع الفاتورة وبطاقة الشفاء.',
 * });
 * ```
 */
export interface IPrescription extends Document {
  /** الرقم المرجعي الفريد للوصفة (مثل RX-90812) */
  rxNumber: string;
  /** بيانات المريض */
  patient: IPatientInfo;
  /** روابط صور الوصفة الطبية المرفوعة */
  prescriptionImages: string[];
  /** الموقع الجغرافي للمريض وقت الإرسال والمسافة المحسوبة */
  userLocation: IUserLocationSnapshot;
  /** الموعد التقريبي الذي حدده المريض للحضور واستلام الأدوية */
  expectedPickupTime?: Date;
  /** ملاحظات أو استفسارات المريض للأخصائي */
  patientNotes?: string;
  /** ملاحظات داخلية لفريق العمل والأخصائي المعتمد */
  internalNotes?: string;
  /** حالة معالجة وتجهيز الوصفة (pending, reviewed, preparing, ready_for_pickup, completed, rejected) */
  status: PrescriptionStatus;
  /** سبب الرفض أو الاعتذار في حال عدم التوفر أو انتهاء صلاحية الوصفة */
  rejectionReason?: string;
  /** توقيت إتمام تجهيز الأدوية لتكون جاهزة للاستلام الفوري */
  readyAt?: Date;
  /** توقيت استلام المريض الفعلي للأدوية من المقر */
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PatientInfoSchema = new Schema<IPatientInfo>(
  {
    fullName: {
      type: String,
      required: [true, 'اسم المريض الكامل مطلوب'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'رقم هاتف المريض مطلوب'],
      trim: true,
    },
    nationalId: {
      type: String,
      trim: true,
    },
    hasChifaCard: {
      type: Boolean,
      default: false,
    },
    chifaCardNumber: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const UserLocationSnapshotSchema = new Schema<IUserLocationSnapshot>(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    distanceInMeters: {
      type: Number,
      required: [true, 'المسافة الجغرافية المحسوبة مطلوبة'],
      max: [5000, 'الخدمة متاحة حصرياً لمن هم على مسافة 5 كم أو أقل من مقرنا للاستلام الشخصي'],
    },
    accuracy: {
      type: Number,
    },
  },
  { _id: false }
);

const PrescriptionSchema = new Schema<IPrescription>(
  {
    rxNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    patient: {
      type: PatientInfoSchema,
      required: true,
    },
    prescriptionImages: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'يجب إرفاق صورة واحدة على الأقل للوصفة الطبية',
      },
    },
    userLocation: {
      type: UserLocationSnapshotSchema,
      required: true,
    },
    expectedPickupTime: {
      type: Date,
    },
    patientNotes: {
      type: String,
      trim: true,
    },
    internalNotes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'reviewed',
        'preparing',
        'ready_for_pickup',
        'completed',
        'rejected',
      ],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    readyAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate rxNumber if missing
PrescriptionSchema.pre('validate', function () {
  if (!this.rxNumber) {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    this.rxNumber = `RX-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
});

const Prescription: Model<IPrescription> =
  (mongoose.models.Prescription as Model<IPrescription>) ||
  mongoose.model<IPrescription>('Prescription', PrescriptionSchema);

export default Prescription;
