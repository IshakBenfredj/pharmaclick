import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 shadow-sm',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand-green hover:bg-[#00B048] text-white focus:ring-brand-green shadow-md shadow-brand-green/20 hover:shadow-lg hover:shadow-brand-green/30',
    secondary:
      'bg-brand-deep hover:bg-[#053F54] text-white focus:ring-brand-deep shadow-md shadow-brand-deep/20',
    outline:
      'border-2 border-brand-teal text-brand-teal hover:bg-brand-teal/10 focus:ring-brand-teal',
    ghost:
      'text-brand-deep hover:bg-slate-100 focus:ring-slate-300',
    gradient:
      'bg-linear-to-r from-brand-turquoise via-brand-green to-brand-lime text-white font-extrabold focus:ring-brand-green shadow-md shadow-brand-green/25 hover:opacity-95',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
