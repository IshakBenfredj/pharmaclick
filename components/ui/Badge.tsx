import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'success' | 'teal' | 'neutral' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-bold',
  }[size];

  const variantStyles = {
    discount: 'bg-brand-green text-white shadow-xs font-black',
    success: 'bg-brand-green text-white',
    teal: 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20',
    turquoise: 'bg-brand-turquoise/15 text-brand-deep font-bold border border-brand-turquoise/30',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    neutral: 'bg-slate-100 text-slate-700',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full leading-none tracking-tight select-none ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
