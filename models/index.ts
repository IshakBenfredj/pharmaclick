/**
 * برميل تصدير جميع نماذج قاعدة البيانات (PharmaClick Mongoose Models)
 * جميع النماذج متوافقة مع القواعد والمعايير المعتمدة:
 * - معتمدة على المعيار الإداري لولايات الجزائر (69 ولاية كاملة)
 * - خدمة الوصفات الطبية: تحضير واستلام شخصي فقط (Click & Collect) ضمن نطاق 5 كم ولا يوجد توصيل نهائياً للأدوية
 */

export { default as Product } from './Product';
export * from './Product';

export { default as Category } from './Category';
export * from './Category';

export { default as MarketingSection } from './MarketingSection';
export * from './MarketingSection';

export { default as Banner } from './Banner';
export * from './Banner';

export { default as Brand } from './Brand';
export * from './Brand';

export { default as Order } from './Order';
export * from './Order';

export { default as Prescription } from './Prescription';
export * from './Prescription';

export { default as Inquiry } from './Inquiry';
export * from './Inquiry';

export { default as ShippingSetting } from './ShippingSetting';
export * from './ShippingSetting';

export { default as Admin } from './Admin';
export * from './Admin';
