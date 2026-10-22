import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';

export type AdminRole = 'super_admin' | 'manager' | 'staff';

export const ADMIN_PERMISSIONS = [
  'manage_products',
  'manage_categories',
  'manage_brands',
  'manage_marketing',
  'manage_orders',
  'manage_shipping',
  'manage_admins',
  'view_analytics',
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

/**
 * نموذج حسابات المسؤولين وفريق العمل (Admin Document)
 *
 * @description
 * يدير حسابات مسؤولي لوحة التحكم، المدراء، وفريق إدارة المتجر والتجهيز.
 * يتضمن تجزئة وتشفير كلمات المرور عبر خوارزميات آمنة (scrypt)، مع إدارة الصلاحيات الدقيقة والأدوار.
 *
 * @example
 * ```typescript
 * import { Admin } from '@/models';
 *
 * // 1. إنشاء حساب مسؤول جديد (يتم تشفير كلمة المرور تلقائياً قبل الحفظ)
 * const admin = await Admin.create({
 *   fullName: 'ياسمين بوعلام',
 *   email: 'admin@pharmaclick.dz',
 *   password: 'SuperSecurePassword2026!',
 *   phone: '0555001122',
 *   role: 'super_admin',
 *   permissions: [
 *     'manage_products',
 *     'manage_categories',
 *     'manage_orders',
 *     'manage_shipping',
 *     'view_analytics',
 *   ],
 *   isActive: true,
 * });
 *
 * // 2. التحقق من صحة تسجيل الدخول ومطابقة كلمة المرور
 * const user = await Admin.findOne({ email: 'admin@pharmaclick.dz' }).select('+password');
 * if (user) {
 *   const isMatch = await user.comparePassword('SuperSecurePassword2026!');
 *   console.log('صحة كلمة المرور:', isMatch);
 * }
 * ```
 */
export interface IAdmin extends Document {
  /** الاسم الكامل للمسؤول */
  fullName: string;
  /** البريد الإلكتروني لتسجيل الدخول */
  email: string;
  /** كلمة المرور المشفرة (لا تظهر في استعلامات البحث الافتراضية select: false) */
  password: string;
  /** رقم هاتف المسؤول للتواصل الداخلي */
  phone?: string;
  /** الدور الإداري: 'super_admin' (مدير عام), 'manager' (مدير فرع), 'staff' (فريق الدعم والتحضير) */
  role: AdminRole;
  /** مصفوفة الصلاحيات الممنوحة للمستخدم */
  permissions: AdminPermission[];
  /** حالة تفعيل الحساب */
  isActive: boolean;
  /** تاريخ وتوقيت آخر تسجيل دخول ناجح */
  lastLoginAt?: Date;
  /** دالة مطابقة كلمة المرور المدخلة مع كلمة المرور المشفرة */
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: [true, 'اسم المسؤول الكامل مطلوب'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'صيغة البريد الإلكتروني غير صحيحة'],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [8, 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل'],
      select: false, // لا تظهر كلمة المرور تلقائياً في استعلامات البحث
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'manager', 'staff'],
      default: 'staff',
      index: true,
    },
    permissions: {
      type: [String],
      enum: ADMIN_PERMISSIONS,
      default: ['view_analytics', 'manage_orders'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Helper for hashing password using standard secure scrypt or bcrypt
export function hashPassword(plainText: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainText, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(plainText: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(plainText, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

// Pre-save hook to hash password if modified
AdminSchema.pre('save', function (this: IAdmin) {
  if (!this.isModified('password')) return;

  // If password does not already contain our salt separator, hash it
  if (!this.password.includes(':')) {
    this.password = hashPassword(this.password);
  }
});

// Compare password instance method
AdminSchema.methods.comparePassword = async function (
  this: IAdmin,
  candidatePassword: string
): Promise<boolean> {
  return verifyPassword(candidatePassword, this.password);
};

const Admin: Model<IAdmin> =
  (mongoose.models.Admin as Model<IAdmin>) ||
  mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;
