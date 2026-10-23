'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, direction } = useLanguage();

  const borderClass = direction === 'rtl' ? 'border-r-2 pr-2' : 'border-l-2 pl-2';

  return (
    <footer className="bg-brand-deep text-slate-200 text-sm mt-auto border-t border-brand-teal/30">
      {/* 1. Value Proposition Features */}
      <div className="border-b border-slate-700/60 bg-[#043c4f]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-turquoise/15 flex items-center justify-center text-brand-turquoise shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t('trust100Original')}</h4>
              <p className="text-xs text-slate-300">{t('heroFloatingLabs')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/15 flex items-center justify-center text-brand-green shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t('propFastDelivery')}</h4>
              <p className="text-xs text-slate-300">{t('footerDeliveryDesk')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-lime/15 flex items-center justify-center text-brand-lime shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t('trust69Wilayas')}</h4>
              <p className="text-xs text-slate-300">{t('footerNationalCoverage')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/25 flex items-center justify-center text-brand-turquoise shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{t('trustSupport')}</h4>
              <p className="text-xs text-slate-300">{t('footerSupportTeam')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-start">
        {/* Col 1: About & Logo */}
        <div className="space-y-4">
          <div className="bg-white/95 p-3 rounded-2xl inline-block shadow-sm">
            <Logo size="md" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('footerAbout')}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className={`font-bold text-white text-sm mb-4 border-brand-green ${borderClass}`}>
            {t('footerQuickLinks')}
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/categories" className="hover:text-emerald-300 transition-colors">
                {t('allCategories')}
              </Link>
            </li>
            <li>
              <Link href="/category/skincare" className="hover:text-emerald-300 transition-colors">
                {t('footerSkincare')}
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-emerald-300 transition-colors">
                {t('offersAndDiscounts')}
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-emerald-300 transition-colors">
                {t('certifiedBrands')}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <span>{t('contactUs')}</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Care & Legal */}
        <div>
          <h3 className={`font-bold text-white text-sm mb-4 border-brand-turquoise ${borderClass}`}>
            {t('footerCustomerService')}
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shipping-policy" className="hover:text-emerald-300 transition-colors">
                {t('footerShippingPolicy')}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-emerald-300 transition-colors">
                {t('footerPrivacyPolicy')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-emerald-300 transition-colors">
                {t('footerTerms')}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-emerald-300 transition-colors">
                {t('footerFaq')}
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-emerald-300 transition-colors">
                {t('footerTrackOrder')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Working Hours */}
        <div className="space-y-3">
          <h3 className={`font-bold text-white text-sm mb-4 border-brand-lime ${borderClass}`}>
            {t('footerContactCol')}
          </h3>
          <div className="flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-brand-turquoise shrink-0 mt-0.5" />
            <span>{t('footerAddress')}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs">
            <Phone className="w-4 h-4 text-brand-green shrink-0" />
            <span dir="ltr">0541790205</span>
          </div>
          <div className="flex items-start gap-2.5 text-xs">
            <Clock className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
            <div>
              <p>{t('footerHours')}</p>
              <p className="text-slate-400">{t('footerFriday')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright */}
      <div className="border-t border-slate-700/80 bg-[#032d3b] text-center text-xs py-4 px-4 text-slate-400">
        <p>
          {t('footerCopyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
