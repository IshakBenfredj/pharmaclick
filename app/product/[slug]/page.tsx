import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug);

  if (!product) {
    return {
      title: "المستحضر غير موجود | PharmaClick",
    };
  }

  return {
    title: `${product.name} | PharmaClick`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0]?.url || "" }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug);

  if (!product) {
    notFound();
  }

  // Find related products in the same category or brand
  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) =>
      p._id !== product._id &&
      (p.categorySlug === product.categorySlug || p.brandId === product.brandId)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" dir="rtl">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductDetailClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </main>

      <Footer />
    </div>
  );
}
