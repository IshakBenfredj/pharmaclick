"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { MOCK_BANNERS, MockBanner } from "@/lib/data/mockData";

interface BannerCarouselProps {
  banners?: MockBanner[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({
  banners = MOCK_BANNERS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, banners.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-slate-900 shadow-lg border border-slate-100/10 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Container with fixed ratio */}
      <div className="relative w-full min-h-95 sm:min-h-105 md:min-h-115 flex items-center">
        {/* Background images with smooth cross-fade */}
        {banners.map((b, idx) => (
          <div
            key={b._id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={b.imageUrlDesktop}
              alt={b.title}
              className="w-full h-full object-cover object-center filter brightness-[0.4] sm:brightness-[0.45]"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-brand-deep/95 via-brand-deep/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent sm:hidden" />
          </div>
        ))}

        {/* Content Box */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-10 w-full text-right">
          <div className="max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-brand-lime text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-ping" />
              <span>{currentBanner.badgeText}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              {currentBanner.title}
            </h2>

            {/* Subtitle */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 font-medium">
              {currentBanner.subtitle}
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={currentBanner.linkUrl}
                className="inline-flex items-center gap-2.5 bg-brand-green hover:bg-brand-lime hover:text-brand-deep text-white font-black text-sm px-7 py-3.5 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{currentBanner.buttonText}</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              aria-label="الشريحة السابقة"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              aria-label="الشريحة التالية"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/10">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`انتقال للشريحة ${i + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === currentIndex
                    ? "w-7 h-2 bg-brand-green"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
