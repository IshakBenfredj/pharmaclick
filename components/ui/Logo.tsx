import React from "react";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "horizontal" | "stacked" | "icon";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  variant = "horizontal",
}) => {
  const sizeConfig = {
    sm: {
      icon: 32,
      text: "text-base",
      subtext: "text-[9px]",
      stackedWidth: 70,
    },
    md: {
      icon: 42,
      text: "text-xl",
      subtext: "text-[11px]",
      stackedWidth: 100,
    },
    lg: { icon: 54, text: "text-2xl", subtext: "text-xs", stackedWidth: 140 },
    xl: { icon: 72, text: "text-3xl", subtext: "text-sm", stackedWidth: 180 },
  }[size];

  // إذا تم اختيار العرض الرأسي الكامل (شعار + نص مدمج من logo-text.png)
  if (variant === "stacked") {
    return (
      <Link
        href="/"
        className={`inline-flex flex-col items-center group select-none transition-transform duration-200 hover:scale-105 ${className}`}
        aria-label="PharmaClick - الصفحة الرئيسية"
      >
        <Image
          src="/logo-text.png"
          alt="PharmaClick Logo"
          width={sizeConfig.stackedWidth}
          height={sizeConfig.stackedWidth * 1.1}
          className="object-contain drop-shadow-xs"
          priority
        />
      </Link>
    );
  }

  // إذا تم اختيار الأيقونة فقط
  if (variant === "icon" || !showText) {
    return (
      <Link
        href="/"
        className={`inline-flex items-center justify-center group select-none transition-transform duration-200 hover:scale-105 ${className}`}
        aria-label="PharmaClick - الصفحة الرئيسية"
      >
        <Image
          src="/logo.png"
          alt="PharmaClick Icon"
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          className="object-contain drop-shadow-xs"
          priority
        />
      </Link>
    );
  }

  // العرض الأفقي المتناسق للهيدر وشريط التنقل (أيقونة الرسمية + النص العصري)
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none ${className}`}
      aria-label="PharmaClick - الصفحة الرئيسية"
    >
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shrink-0">
        <Image
          src="/logo.png"
          alt="PharmaClick Icon"
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          className="object-contain drop-shadow-xs"
          priority
        />
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`font-black tracking-tight ${sizeConfig.text}`}>
          <span className="text-brand-deep">Pharma</span>
          <span className="text-brand-green transition-colors duration-200 group-hover:text-brand-lime">
            Click
          </span>
        </div>
        <span
          className={`text-[#64748b] font-medium tracking-wide ${sizeConfig.subtext}`}
        >
          صحتك بنقرة واحدة
        </span>
      </div>
    </Link>
  );
};

export default Logo;
