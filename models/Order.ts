import mongoose, { Schema, Document, Model } from 'mongoose';

export type OrderPickupMethod = 'delivery'; // توصيل لكافة الـ 69 ولاية (توصيل للمنزل أو لمكتب التوزيع)

export type OrderDeliveryType = 'home' | 'desk'; // توصيل للمنزل أو لمكتب التوزيع

export type OrderStatus =
  | 'pending' // قيد الانتظار والمراجعة
  | 'confirmed' // تم التأكيد هاتفياً
  | 'processing' // قيد التجهيز والتحضير
  | 'ready_for_pickup' // جاهز للاستلام من مكتب التوزيع (Stop Desk)
  | 'shipped' // تم تسليمه لشركة التوصيل
  | 'delivered' // تم التوصيل والاستلام بنجاح
  | 'cancelled'; // تم الإلغاء

/**
 * واجهة عنصر الطلب (المستحضر المشترى)
 * @property product - المعرف المرجعي للمستحضر
 * @property productName - اسم المستحضر وقت الطلب كنسخة ثابتة
 * @property productImage - صورة المستحضر وقت الطلب
 * @property selectedVariant - المتغير المختار إن وجد (مثل "الحجم: 50ml")
 * @property unitPrice - سعر الوحدة الفعلي وقت الطلب بالدينار الجزائري
 * @property quantity - الكمية المطلوبة
 * @property totalPrice - حاصل ضرب الكمية في سعر الوحدة
 */
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  selectedVariant?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

/**
 * واجهة بيانات الزبون صاحب الطلب
 * @property fullName - الاسم الكامل للزبون
 * @property phone - رقم الهاتف الأساسي للتأكيد والتوصيل
 * @property alternativePhone - رقم هاتف احتياطي اختياري
 * @property email - البريد الإلكتروني لإرسال تفاصيل الفاتورة
 */
export interface IOrderCustomer {
  fullName: string;
  phone: string;
  alternativePhone?: string;
  email?: string;
}

/**
 * واجهة عنوان التوصيل وفق المعيار الإداري لولايات الجزائر (69 ولاية)
 * @property wilayaCode - رمز الولاية الإداري (1 إلى 69)
 * @property wilayaName - اسم الولاية باللغة العربية
 * @property commune - اسم البلدية
 * @property streetAddress - تفاصيل العنوان أو الحي
 * @property deliveryType - نوع التوصيل: 'home' (للمنزل) أو 'desk' (لمكتب التوزيع)
 */
export interface IOrderShippingAddress {
  wilayaCode: number;
  wilayaName: string;
  commune: string;
  streetAddress?: string;
  deliveryType: OrderDeliveryType;
}

/**
 * نموذج طلبات الشراء (Order Document)
 *
 * @description
 * يدير كامل عمليات الشراء في المتجر بالتوصيل لكافة الولايات الـ 69 في الجزائر
 * (سواء التوصيل لباب المنزل أو الاستلام من مكتب شركة التوصيل Stop Desk).
 *
 * @example
 * ```typescript
 * import { Order } from '@/models';
 *
 * // 1. إنشاء طلب شراء جديد بالتوصيل المنزلي لولاية قسنطينة (ولاية 25)
 * const order = await Order.create({
 *   customer: {
 *     fullName: 'محمد بن علي',
 *     phone: '0550123456',
 *     email: 'mohamed@example.com',
 *   },
 *   pickupMethod: 'delivery',
 *   shippingAddress: {
 *     wilayaCode: 25,
 *     wilayaName: 'قسنطينة',
 *     commune: 'علي منجلي',
 *     streetAddress: 'حي الاستقلال عمارة 12',
 *     deliveryType: 'home',
 *   },
 *   items: [
 *     {
 *       product: productId,
 *       productName: 'سيروم حمض الهيالورونيك المرطب B5',
 *       unitPrice: 3200,
 *       quantity: 2,
 *       totalPrice: 6400,
 *       selectedVariant: 'الحجم: 50ml',
 *     },
 *   ],
 *   subtotal: 6400,
 *   shippingFee: 550,
 *   discountAmount: 0,
 *   totalAmount: 6950,
 *   status: 'pending',
 *   paymentMethod: 'cod',
 * });
 *
 * // 2. إنشاء طلب استلام من مكتب شركة التوصيل (Stop Desk)
 * const deskOrder = await Order.create({
 *   customer: {
 *     fullName: 'سارة بلقاسم',
 *     phone: '0661987654',
 *   },
 *   pickupMethod: 'delivery',
 *   shippingAddress: {
 *     wilayaCode: 16,
 *     wilayaName: 'الجزائر العاصمة',
 *     commune: 'باب الزوار',
 *     deliveryType: 'desk',
 *   },
 *   items: [...],
 *   subtotal: 4500,
 *   shippingFee: 300,
 *   totalAmount: 4800,
 *   status: 'pending',
 *   paymentMethod: 'cod',
 * });
 * ```
 */
export interface IOrder extends Document {
  /** رقم الطلب الفريد التلقائي (مثل ORD-2026-4921) */
  orderNumber: string;
  /** بيانات العميل */
  customer: IOrderCustomer;
  /** طريقة الطلب: 'delivery' (توصيل لكافة الـ 69 ولاية) */
  pickupMethod: OrderPickupMethod;
  /** تفاصيل عنوان الشحن لكافة الطلبات */
  shippingAddress: IOrderShippingAddress;
  /** قائمة المنتجات المطلوبة مع أسعارها وكمياتها وقت الشراء */
  items: IOrderItem[];
  /** المجموع الفرعي لسعر المنتجات دون رسوم التوصيل */
  subtotal: number;
  /** رسوم التوصيل وفق الولاية ونوع التوصيل (منزل أو مكتب توزيع) */
  shippingFee: number;
  /** قيمة الخصم المالي المطبق إن وجد */
  discountAmount: number;
  /** المبلغ الإجمالي الواجب دفعه عند الاستلام بالدينار الجزائري */
  totalAmount: number;
  /** حالة معالجة الطلب في النظام */
  status: OrderStatus;
  /** طريقة الدفع: 'cod' (الدفع عند الاستلام) */
  paymentMethod: 'cod';
  /** حالة استلام قيمة الطلب (pending أو paid) */
  paymentStatus: 'pending' | 'paid';
  /** ملاحظات الزبون الإضافية حول التوصيل أو التوقيت */
  customerNotes?: string;
  /** ملاحظات فريق العمل الداخلية غير المرئية للعميل */
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'معرف المستحضر مطلوب'],
    },
    productName: {
      type: String,
      required: [true, 'اسم المستحضر مطلوب'],
      trim: true,
    },
    productImage: {
      type: String,
      trim: true,
    },
    selectedVariant: {
      type: String,
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'الكمية يجب أن تكون 1 على الأقل'],
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    fullName: {
      type: String,
      required: [true, 'اسم الزبون الكامل مطلوب'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
    },
    alternativePhone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

const OrderShippingAddressSchema = new Schema<IOrderShippingAddress>(
  {
    wilayaCode: {
      type: Number,
      required: [true, 'رمز الولاية مطلوب'],
      min: [1, 'رمز الولاية الأدنى هو 1'],
      max: [69, 'رمز الولاية الأقصى المعتمد هو 69 ولاية'],
    },
    wilayaName: {
      type: String,
      required: [true, 'اسم الولاية مطلوب'],
      trim: true,
    },
    commune: {
      type: String,
      required: [true, 'اسم البلدية مطلوب'],
      trim: true,
    },
    streetAddress: {
      type: String,
      trim: true,
    },
    deliveryType: {
      type: String,
      enum: ['home', 'desk'],
      default: 'home',
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customer: {
      type: OrderCustomerSchema,
      required: true,
    },
    pickupMethod: {
      type: String,
      enum: ['delivery'],
      required: [true, 'طريقة التوصيل مطلوبة'],
      default: 'delivery',
      index: true,
    },
    shippingAddress: {
      type: OrderShippingAddressSchema,
      required: [true, 'عنوان التوصيل مطلوب لكافة الطلبات'],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => Array.isArray(items) && items.length > 0,
        message: 'يجب أن يحتوي الطلب على مستحضر واحد على الأقل',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'ready_for_pickup',
        'shipped',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['cod'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
      index: true,
    },
    customerNotes: {
      type: String,
      trim: true,
    },
    internalNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate orderNumber if not present
OrderSchema.pre('validate', function () {
  if (!this.orderNumber) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${Date.now().toString().slice(-4)}${randomSuffix}`;
  }
});

const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
