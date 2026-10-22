'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, SupportedLanguage } from '@/context/LanguageContext';

const LANGUAGES: { code: SupportedLanguage; label: string; short: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', short: 'عربي', flag: '🇩🇿' },
  { code: 'fr', label: 'Français', short: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
];

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'compact' | 'drawer';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'compact' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (variant === 'drawer') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/60">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              language === l.code
                ? 'bg-white text-brand-deep shadow-xs'
                : 'text-slate-600 hover:text-brand-deep'
            }`}
          >
            <span className="text-xs">{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'topbar') {
    return (
      <div className="relative inline-block text-left" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-[11px] font-bold cursor-pointer py-0.5 px-2 rounded-full hover:bg-white/10"
          aria-label="تغيير اللغة / Change Language"
        >
          <Globe className="w-3.5 h-3.5 text-brand-lime" />
          <span>{currentLang.label}</span>
          <ChevronDown className="w-3 h-3 opacity-70" />
        </button>

        {isOpen && (
          <div className="absolute top-full mt-1.5 end-0 z-50 w-36 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-start px-3.5 py-2 flex items-center justify-between font-bold transition-colors cursor-pointer ${
                  language === l.code
                    ? 'bg-teal-50 text-brand-teal'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.label}</span>
                </div>
                {language === l.code && <Check className="w-3.5 h-3.5 text-brand-teal" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default compact variant (Header main bar)
  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 transition-all text-slate-700 hover:text-brand-deep cursor-pointer text-xs font-bold shadow-2xs"
        aria-label="تغيير اللغة"
      >
        <Globe className="w-4 h-4 text-brand-teal" />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.short}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 end-0 z-50 w-40 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            اختر اللغة / Select
          </div>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-start px-3.5 py-2 flex items-center justify-between font-bold transition-colors cursor-pointer ${
                language === l.code
                  ? 'bg-teal-50 text-brand-teal'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{l.flag}</span>
                <span>{l.label}</span>
              </div>
              {language === l.code && <Check className="w-3.5 h-3.5 text-brand-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
