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
              <h4 className="font-bold text-white text-sm">توصيل سريع ومضمون</h4>
              <p className="text-xs text-slate-300">لباب منزلك أو إلى أقرب مكتب توزيع</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-lime/15 flex items-center justify-center text-brand-lime shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">شحن لكافة الـ 69 ولاية</h4>
              <p className="text-xs text-slate-300">تغطية وطنية شاملة مع الدفع عند الاستلام</p>
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
              <Link href="/categories" className="hover:text-emerald-300 transition-colors">
                كافة التصنيفات والأقسام
              </Link>
            </li>
            <li>
              <Link href="/category/skincare" className="hover:text-emerald-300 transition-colors">
                مستحضرات العناية بالبشرة
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
                href="/contact"
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>تواصل معنا وخدمة العملاء</span>
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
                سياسة الخصوصية وأمان البيانات
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
              <Link href="/track" className="hover:text-emerald-300 transition-colors">
                تتبع حالة الطلب
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Working Hours */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm mb-4 border-r-2 border-brand-lime pr-2">
            خدمة العملاء والتواصل
          </h3>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" />
            <span>متجر PharmaClick الإلكتروني، الجزائر</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-brand-green shrink-0" />
            <span dir="ltr">0541790205</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p>السبت - الخميس: 08:30 إلى 20:30</p>
              <p className="text-slate-400">الجمعة: خدمة الدعم عبر واتساب</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="border-t border-slate-700/80 bg-[#032d3b] text-center text-xs py-4 px-4 text-slate-400">
        <p>
          جميع الحقوق محفوظة &copy; 2026 PharmaClick - تطوير المهندس إسحاق جيلالي بن فرج.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
