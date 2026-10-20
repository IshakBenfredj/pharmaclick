'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { Badge } from './Badge';

export interface ProductData {
  _id: string;
  name: string;
  slug?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  category: string;
  inStock: boolean;
  sizeOrVolume?: string;
}

interface ProductCardProps {
  product: ProductData;
  onAddToCart?: (product: ProductData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const hasDiscount =
    Boolean(product.originalPrice && product.originalPrice > product.price) ||
    Boolean(product.discountPercentage && product.discountPercentage > 0);

  const discountVal =
    product.discountPercentage ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  const productUrl = `/product/${product.slug || product._id}`;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100/90 hover:border-brand-teal/40 flex flex-col justify-between card-hover-effect overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
      {/* 1. منطقة الصورة التي تأخذ العرض الكامل للبطاقة (Full Width Product Image) */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100 border-b border-slate-100/80">
        {/* شارات الخصم والتوفر تطفو فوق الصورة بهامش متناسق مع انحناء الحواف */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between z-10 pointer-events-none">
          {hasDiscount ? (
            <span className="bg-brand-green text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md tracking-tight backdrop-blur-xs">
              خصم {discountVal}%
            </span>
          ) : (
            <span />
          )}

          {!product.inStock && (
            <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
              غير متوفر
            </span>
          )}
        </div>

        {/* رابط وصورة المنتج بكامل العرض */}
        <Link
          href={productUrl}
          className="relative block w-full h-full overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
          />

          {/* تأثير التمرير (Quick View Hover Overlay) */}
          <div className="absolute inset-0 bg-brand-deep/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-brand-deep p-2 rounded-full shadow-md transform scale-90 group-hover:scale-100 transition-transform">
              <Eye className="w-4 h-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* 2. منطقة البيانات والتفاصيل (مع padding أنيق) */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* العلامة التجارية والحجم */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-brand-teal font-bold">{product.brand}</span>
            {product.sizeOrVolume && (
              <span className="text-slate-400 font-medium">{product.sizeOrVolume}</span>
            )}
          </div>

          {/* اسم المنتج */}
          <Link href={productUrl}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 hover:text-brand-deep transition-colors leading-snug mb-2 min-h-8">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* السعر وزر السلة الدائري العصري */}
        <div className="pt-2 border-t border-slate-50 flex items-end justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-brand-deep tracking-tight">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-slate-500">د.ج</span>
            </div>

            {hasDiscount && product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through block font-medium">
                {product.originalPrice.toLocaleString()} د.ج
              </span>
            )}
          </div>

          {/* زر السلة الدائري */}
          <button
            onClick={() => onAddToCart && onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-9 h-9 rounded-full font-bold flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs ${
              product.inStock
                ? 'bg-brand-green hover:bg-[#00B048] text-white hover:scale-110 active:scale-95 hover:shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="أضف إلى السلة"
            aria-label="أضف إلى السلة"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
