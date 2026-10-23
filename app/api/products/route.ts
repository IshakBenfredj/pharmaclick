import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product, Category, Brand } from "@/models";
import { MOCK_PRODUCTS } from "@/lib/data/mockData";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || searchParams.get("search") || "").trim();
    const category = searchParams.get("category") || "all";
    const brand = searchParams.get("brand") || "all";
    const onlyInStock = searchParams.get("inStock") === "true";
    const maxPrice = Number(searchParams.get("maxPrice")) || 0;
    const sortBy = searchParams.get("sortBy") || "featured";

    let dbProductsList: any[] = [];

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();

        const mongoQuery: Record<string, any> = {
          isOnlineVisible: { $ne: false },
        };

        // 1. فلتر نص البحث (قوي وشامل للغات والماركات والتصنيفات)
        if (query) {
          const regex = new RegExp(query, "i");
          mongoQuery.$or = [
            { name: { $regex: regex } },
            { nameAr: { $regex: regex } },
            { nameFr: { $regex: regex } },
            { nameEn: { $regex: regex } },
            { slug: { $regex: regex } },
            { tags: { $in: [regex] } },
            { shortDescription: { $regex: regex } },
            { description: { $regex: regex } },
          ];
        }

        // 2. فلتر التوفر
        if (onlyInStock) {
          mongoQuery.inStock = true;
          mongoQuery.stockQuantity = { $gt: 0 };
        }

        // 3. فلتر السعر
        if (maxPrice > 0) {
          mongoQuery.price = { $lte: maxPrice };
        }

        // 4. فلتر التصنيف
        if (category && category !== "all") {
          const catDoc = await Category.findOne({
            $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
          }).lean();

          if (catDoc) {
            mongoQuery.$and = mongoQuery.$and || [];
            mongoQuery.$and.push({
              $or: [
                { category: catDoc._id },
                { subCategory: catDoc._id },
                { categorySlug: catDoc.slug },
                { subCategorySlug: catDoc.slug },
              ],
            });
          }
        }

        // 5. فلتر العلامة التجارية
        if (brand && brand !== "all") {
          const brandDoc = await Brand.findOne({
            $or: [{ slug: brand }, { _id: brand.match(/^[0-9a-fA-F]{24}$/) ? brand : null }, { name: brand }],
          }).lean();

          if (brandDoc) {
            mongoQuery.$and = mongoQuery.$and || [];
            mongoQuery.$and.push({
              $or: [{ brand: brandDoc._id }, { brand: brandDoc.name }],
            });
          }
        }

        // 6. الترتيب
        let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };
        if (sortBy === "price_asc") sortOptions = { price: 1 };
        if (sortBy === "price_desc") sortOptions = { price: -1 };
        if (sortBy === "discount") sortOptions = { discountPercentage: -1, price: 1 };
        if (sortBy === "popular") sortOptions = { orderCount: -1, rating: -1 };

        const docs = await Product.find(mongoQuery)
          .populate("category", "nameAr nameFr nameEn slug")
          .populate("subCategory", "nameAr nameFr nameEn slug")
          .populate("brand", "name logoUrl slug")
          .sort(sortOptions)
          .lean();

        if (docs && docs.length > 0) {
          dbProductsList = docs.map((p: any) => ({
            _id: p._id.toString(),
            name: p.name,
            nameAr: p.nameAr || p.name,
            nameFr: p.nameFr || "",
            nameEn: p.nameEn || "",
            slug: p.slug,
            brand:
              p.brand?.name ||
              (typeof p.brand === "string" ? p.brand : "PharmaClick"),
            brandId: p.brand?._id?.toString() || p.brand?.slug || "brand",
            price: p.price,
            originalPrice: p.originalPrice,
            discountPercentage: p.discountPercentage,
            image: p.images?.[0]?.url || "/images/default-prod.webp",
            images: p.images || [],
            category:
              p.category?.nameAr ||
              (typeof p.category === "string" ? p.category : "مستحضرات معتمدة"),
            categorySlug: p.category?.slug || p.categorySlug || "skincare",
            subCategory: p.subCategory?.nameAr || undefined,
            subCategorySlug: p.subCategory?.slug || undefined,
            inStock: p.inStock ?? true,
            stockQuantity: p.stockQuantity ?? 10,
            rating: p.rating ?? 4.8,
            reviewsCount: p.reviewsCount ?? 12,
            sizeOrVolume: p.shortDescription || p.sizeOrVolume || "",
            isBestSeller: Boolean(p.orderCount && p.orderCount > 10),
            isFeatured: Boolean(p.isFeatured),
          }));
        }
      } catch (err) {
        console.error("MongoDB query error in /api/products:", err);
      }
    }

    // 7. دمج مع MOCK_PRODUCTS للنتائج المطابقة كاحتياط
    const qLower = query.toLowerCase();
    const mockMatches = MOCK_PRODUCTS.filter((mp) => {
      if (qLower) {
        const matchesName =
          mp.name.toLowerCase().includes(qLower) ||
          (mp.nameAr && mp.nameAr.toLowerCase().includes(qLower)) ||
          (mp.nameFr && mp.nameFr.toLowerCase().includes(qLower)) ||
          (mp.nameEn && mp.nameEn.toLowerCase().includes(qLower)) ||
          mp.slug.toLowerCase().includes(qLower);
        const matchesBrand = mp.brand.toLowerCase().includes(qLower);
        const matchesCategory = mp.category.toLowerCase().includes(qLower);
        const matchesTags = mp.tags?.some((t) => t.toLowerCase().includes(qLower));

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      if (category && category !== "all") {
        if (mp.categorySlug !== category && mp.subCategorySlug !== category) {
          return false;
        }
      }

      if (brand && brand !== "all") {
        if (mp.brandId !== brand && mp.brand.toLowerCase() !== brand.toLowerCase()) {
          return false;
        }
      }

      if (onlyInStock && !mp.inStock) {
        return false;
      }

      if (maxPrice > 0 && mp.price > maxPrice) {
        return false;
      }

      return true;
    }).map((mp) => ({
      _id: mp._id,
      name: mp.name,
      nameAr: mp.nameAr || mp.name,
      nameFr: mp.nameFr || "",
      nameEn: mp.nameEn || "",
      slug: mp.slug,
      brand: mp.brand,
      brandId: mp.brandId,
      price: mp.price,
      originalPrice: mp.originalPrice,
      discountPercentage: mp.discountPercentage,
      image: mp.images?.[0]?.url || "/images/default-prod.webp",
      images: mp.images || [],
      category: mp.category,
      categorySlug: mp.categorySlug,
      subCategory: mp.subCategory,
      subCategorySlug: mp.subCategorySlug,
      inStock: mp.inStock,
      stockQuantity: mp.stockQuantity,
      rating: mp.rating,
      reviewsCount: mp.reviewsCount,
      sizeOrVolume: mp.sizeOrVolume,
      isBestSeller: mp.isBestSeller,
      isFeatured: mp.isFeatured,
    }));

    // دمج فريد بدون تكرار
    const finalProducts = [...dbProductsList];
    for (const mp of mockMatches) {
      if (!finalProducts.some((p) => p.slug === mp.slug || p._id === mp._id)) {
        finalProducts.push(mp);
      }
    }

    // فرز القائمة النهائية
    if (sortBy === "price_asc") {
      finalProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      finalProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      finalProducts.sort(
        (a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)
      );
    } else if (sortBy === "popular") {
      finalProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return NextResponse.json({
      success: true,
      count: finalProducts.length,
      products: finalProducts,
    });
  } catch (error: any) {
    console.error("API /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
