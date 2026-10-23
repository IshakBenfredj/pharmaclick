import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OffersClientView } from "@/components/offers/OffersClientView";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";
import { ProductData } from "@/components/ui/ProductCard";

export const metadata = {
  title: "العروض والتخفيضات الحصرية | PharmaClick",
  description:
    "استكشف أقوى التخفيضات والعروض الحصرية على مستحضرات العناية بالبشرة والجمال مع شحن سريع لكافة الـ 69 ولاية.",
};

type OfferProductItem = ProductData & {
  discountPercentage?: number;
  rating?: number;
  createdAt?: string;
};

export default async function OffersPage() {
  let offerProducts: OfferProductItem[] = [];

  // 1. استعلام المنتجات المخفضة حياً من قاعدة بيانات MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();

      const dbOffers = await Product.find({
        isOnlineVisible: { $ne: false },
        $or: [
          { discountPercentage: { $gt: 0 } },
          { $expr: { $gt: ["$originalPrice", "$price"] } },
        ],
      })
        .populate("category", "nameAr nameFr slug")
        .populate("brand", "name logoUrl slug")
        .sort({ discountPercentage: -1, orderCount: -1, createdAt: -1 })
        .lean();

      if (dbOffers && dbOffers.length > 0) {
        offerProducts = dbOffers.map((p: any) => ({
          _id: p._id.toString(),
          name: p.name,
          nameAr: p.nameAr || p.name,
          nameFr: p.nameFr || "",
          nameEn: p.nameEn || "",
          slug: p.slug,
          brand:
            p.brand?.name ||
            (typeof p.brand === "string" ? p.brand : "PharmaClick"),
          price: p.price,
          originalPrice: p.originalPrice,
          discountPercentage: p.discountPercentage,
          image: p.images?.[0]?.url || "/images/default-prod.webp",
          category:
            p.category?.nameAr ||
            (typeof p.category === "string" ? p.category : "مستحضرات معتمدة"),
          inStock: p.inStock ?? true,
          sizeOrVolume: p.shortDescription || p.sizeOrVolume || "",
          rating: p.rating ?? 4.8,
        }));
      }
    } catch (err) {
      console.error("Error fetching offers from MongoDB:", err);
    }
  }

  // 2. دمج أو استكمال بالعروض التجريبية المعتمدة لضمان صفحة غنية دائماً
  const mockDiscounted = MOCK_PRODUCTS.filter(
    (p) =>
      (p.discountPercentage && p.discountPercentage > 0) ||
      (p.originalPrice && p.originalPrice > p.price)
  );

  for (const mp of mockDiscounted) {
    const alreadyExists = offerProducts.some(
      (item) => item.slug === mp.slug || item._id === mp._id
    );
    if (!alreadyExists) {
      offerProducts.push({
        _id: mp._id,
        name: mp.name,
        nameAr: mp.nameAr || mp.name,
        nameFr: mp.nameFr || "",
        nameEn: mp.nameEn || "",
        slug: mp.slug,
        brand: mp.brand,
        price: mp.price,
        originalPrice: mp.originalPrice,
        discountPercentage: mp.discountPercentage,
        image: mp.images?.[0]?.url || "/images/default-prod.webp",
        category: mp.category,
        inStock: mp.inStock,
        sizeOrVolume: mp.sizeOrVolume,
        rating: mp.rating,
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <OffersClientView initialProducts={offerProducts} />
      <Footer />
    </div>
  );
}
