import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, Mail, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { Logo } from '../ui/Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-deep text-slate-200 text-sm mt-auto border-t border-brand-teal/30">
      {/* 1. Value Proposition Features */}
      <div className="border-b border-slate-700/60 bg-[#043c4f]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-turquoise/15 flex items-center justify-center text-brand-turquoise shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">منتجات أصلية 100%</h4>
              <p className="text-xs text-slate-300">مباشرة من كبرى المخابر والموردين المعتمدين</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/15 flex items-center justify-center text-brand-green shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">توصيل سريع واستلام فوري</h4>
              <p className="text-xs text-slate-300">إلى باب منزلك أو من مقرنا مباشرة</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-lime/15 flex items-center justify-center text-brand-lime shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">تحضير مسبق للوصفات</h4>
              <p className="text-xs text-slate-300">ارفع وصفتك ونجهزها قبل وصولك</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/25 flex items-center justify-center text-brand-turquoise shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">استشارة متخصصة موثوقة</h4>
              <p className="text-xs text-slate-300">فريق دعم صحي متخصص للإجابة عن أسئلتكم</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About & Logo */}
        <div className="space-y-4">
          <div className="bg-white/95 p-3 rounded-2xl inline-block shadow-sm">
            <Logo size="md" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            منصتكم الرقمية المعتمدة في الجزائر. نجمع بين أحدث معايير التجارة الإلكترونية وخدمات الرعاية الصحية المتخصصة لتلبية احتياجاتكم الجمالية والوقائية.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="font-bold text-white text-sm mb-4 border-r-2 border-brand-green pr-2">
            روابط سريعة
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/prescription" className="hover:text-emerald-300 transition-colors">
                طلب تحضير وصفة طبية (استلام مباشر من المقر)
              </Link>
            </li>
            <li>
              <Link href="/drug-inquiry" className="hover:text-emerald-300 transition-colors">
                الاستفسار عن توفر دواء
              </Link>
            </li>
            <li>
              <Link href="/promotions" className="hover:text-emerald-300 transition-colors">
                العروض والتخفيضات الحصرية
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-emerald-300 transition-colors">
                العلامات التجارية المعتمدة
              </Link>
            </li>
            <li>
              <Link
                href="/pharmacy-location"
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>موقعنا وأوقات العمل</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Legal */}
        <div>
          <h3 className="font-bold text-white text-sm mb-4 border-r-2 border-brand-turquoise pr-2">
            خدمة الزبائن والسياسات
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shipping-policy" className="hover:text-emerald-300 transition-colors">
                سياسة الشحن والتوصيل
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-emerald-300 transition-colors">
                سياسة الخصوصية وأمان البيانات الطبية
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-emerald-300 transition-colors">
                شروط الاستخدام والبيع
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-emerald-300 transition-colors">
                الأسئلة الشائعة
              </Link>
            </li>
            <li>
              <Link href="/order-tracking" className="hover:text-emerald-300 transition-colors">
                تتبع حالة الطلب
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Working Hours */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm mb-4 border-r-2 border-brand-lime pr-2">
            معلومات المقر والتواصل
          </h3>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" />
            <span>مركز بودشيش • PharmaClick، الجزائر</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-brand-green shrink-0" />
            <span dir="ltr">0541790205</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p>السبت - الخميس: 08:30 إلى 20:30</p>
              <p className="text-slate-400">الجمعة: مغلق (أو حسب جدول المناوبة)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="border-t border-slate-700/80 bg-[#032d3b] text-center text-xs py-4 px-4 text-slate-400">
        <p>
          جميع الحقوق محفوظة &copy; 2026 بودشيش • PharmaClick - تطوير المهندس إسحاق جيلالي بن فرج.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
