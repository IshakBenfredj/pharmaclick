'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info } from 'lucide-react';

export interface FormLabelWithHelpProps {
  /** اسم الحقل المعروض */
  label: React.ReactNode;
  /** النص الإرشادي أو التوضيحي للآدمن حول ماهية الحقل وكيفية ملئه */
  helpText: React.ReactNode;
  /** هل الحقل إجباري؟ يعرض نجمة حمراء * */
  required?: boolean;
  /** معرف عنصر الإدخال المرتبط (htmlFor) */
  htmlFor?: string;
  /** شارة إضافية اختيارية (مثل 'جديد' أو 'اختياري') */
  badge?: string;
  /** نوع الأيقونة: علامة استفهام HelpCircle أو حرف معلومة Info */
  iconType?: 'help' | 'info';
  /** فئات CSS إضافية للحاوية */
  className?: string;
  /** فئات CSS إضافية لنص الـ Label */
  labelClassName?: string;
}

/**
 * مكون تسمية الحقول الموحد في لوحة التحكم (FormLabelWithHelp)
 *
 * @description
 * يعرض تسمية الحقل (Label) مرفقاً بأيقونة صغيرة تفاعلية (علامة استفهام أو معلومة)
 * تظهر تلميحاً أنيقاً (Tooltip / Popover) يشرح للآدمن وظيفة هذا الحقل، القيود، وأمثلة توضيحية.
 * يدعم التمرير بالفأرة (Hover) على الحواسيب واللمس (Tap) على شاشات الموبايل مع إغلاق تلقائي عند النقر بالخارج.
 */
export const FormLabelWithHelp: React.FC<FormLabelWithHelpProps> = ({
  label,
  helpText,
  required = false,
  htmlFor,
  badge,
  iconType = 'help',
  className = '',
  labelClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const IconComponent = iconType === 'info' ? Info : HelpCircle;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1.5 select-none mb-1.5 ${className}`}
    >
      {/* Label Text */}
      <label
        htmlFor={htmlFor}
        className={`text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1 cursor-pointer ${labelClassName}`}
      >
        <span>{label}</span>
        {required && (
          <span className="text-red-500 font-black" title="حقل إجباري">
            *
          </span>
        )}
      </label>

      {/* Optional Badge */}
      {badge && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          {badge}
        </span>
      )}

      {/* Tooltip Trigger Icon Button */}
      <div
        className="relative inline-flex items-center"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          aria-expanded={isOpen}
          aria-label="معلومات توضيحية عن هذا الحقل"
          className={`p-0.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-brand-teal/50 ${
            isOpen
              ? 'text-brand-deep bg-brand-deep/10 scale-110'
              : 'text-slate-400 hover:text-brand-deep hover:bg-slate-100'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5" />
        </button>

        {/* Floating Tooltip Bubble */}
        {isOpen && (
          <div
            role="tooltip"
            className="absolute bottom-full right-0 mb-2 z-50 w-64 sm:w-72 p-3 bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl shadow-slate-900/20 border border-slate-800 text-xs leading-relaxed animate-in fade-in zoom-in-95 duration-150 pointer-events-auto text-right"
          >
            {/* Arrow */}
            <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-slate-900/95" />

            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                <IconComponent className="w-3 h-3 text-brand-turquoise" />
              </div>
              <div className="flex-1 font-normal text-slate-100">{helpText}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormLabelWithHelp;
