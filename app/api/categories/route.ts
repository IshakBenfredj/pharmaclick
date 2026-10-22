import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Category, Product } from '@/models';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '@/lib/data/mockData';

/**
 * دالة مساعدة لزرع التصنيفات الافتراضية وشجرتها الهرمية في قاعدة البيانات إن كانت فارغة
 */
async function seedCategoriesIfEmpty() {
  const count = await Category.countDocuments();
  if (count > 0) return;

  console.log('[Seed] Seeding categories and subcategories into MongoDB...');

  // 1. زرع الأقسام الرئيسية أولاً
  const parentMap = new Map<string, mongoose.Types.ObjectId>();

  for (let i = 0; i < MOCK_CATEGORIES.length; i++) {
    const mockCat = MOCK_CATEGORIES[i];
    const parent: any = await Category.create({
      nameAr: mockCat.nameAr,
      nameFr: mockCat.nameFr,
      slug: mockCat.slug,
      icon: mockCat.icon || 'ShoppingBag',
      image: mockCat.image,
      descriptionAr: mockCat.descriptionAr,
      descriptionFr: mockCat.descriptionFr,
      parentCategory: null,
      sortOrder: i + 1,
      isActive: true,
    });
    parentMap.set(mockCat.slug, (parent?._id || parent?.id) as mongoose.Types.ObjectId);

    // 2. زرع التصنيفات الفرعية المرتبطة بهذا القسم الرئيسي
    if (mockCat.subCategories && mockCat.subCategories.length > 0) {
      for (let j = 0; j < mockCat.subCategories.length; j++) {
        const sub = mockCat.subCategories[j];
        await Category.create({
          nameAr: sub.nameAr,
          nameFr: sub.nameFr,
          slug: sub.slug,
          icon: sub.icon || mockCat.icon || 'ShoppingBag',
          image: sub.image || mockCat.image,
          descriptionAr: sub.descriptionAr || `${sub.nameAr} المعتمدة والمضمونة`,
          parentCategory: parent._id,
          sortOrder: j + 1,
          isActive: true,
        });
      }
    }
  }

  // 3. تحديث المنتجات الموجودة لربطها بالتصنيفات الحقيقية
  for (const mockProd of MOCK_PRODUCTS) {
    const parentId = parentMap.get(mockProd.categorySlug);
    if (!parentId) continue;

    let subCategoryId: mongoose.Types.ObjectId | undefined = undefined;
    if (mockProd.subCategorySlug) {
      const subCat = await Category.findOne({ slug: mockProd.subCategorySlug });
      if (subCat) {
        subCategoryId = subCat._id as mongoose.Types.ObjectId;
      }
    }

    await Product.updateOne(
      { slug: mockProd.slug },
      {
        $set: {
          category: parentId,
          ...(subCategoryId ? { subCategory: subCategoryId } : {}),
        },
      }
    );
  }

  console.log('[Seed] Categories seeded successfully.');
}

async function syncCategoryDetails() {
  const categories = await Category.find();
  const catMap = new Map<string, mongoose.Types.ObjectId>();
  categories.forEach((c) => catMap.set(c.slug, c._id as mongoose.Types.ObjectId));

  for (const mockCat of MOCK_CATEGORIES) {
    if (mockCat.subCategories) {
      for (const sub of mockCat.subCategories) {
        if (sub.image) {
          await Category.updateOne(
            { slug: sub.slug },
            { $set: { image: sub.image, descriptionAr: sub.descriptionAr } }
          );
        }
      }
    }
  }

  // Ensure products in DB are linked to correct category and subCategory ObjectIds
  for (const mockProd of MOCK_PRODUCTS) {
    const parentId = catMap.get(mockProd.categorySlug);
    if (!parentId) continue;

    const subCategoryId = mockProd.subCategorySlug
      ? catMap.get(mockProd.subCategorySlug)
      : undefined;

    await Product.updateOne(
      { slug: mockProd.slug },
      {
        $set: {
          category: parentId,
          subCategory: subCategoryId || null,
        },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const topNav = searchParams.get('topNav') === 'true';
    const limit = parseInt(searchParams.get('limit') || (topNav ? '5' : '50'), 10);
    const slug = searchParams.get('slug');

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        await seedCategoriesIfEmpty();
        await syncCategoryDetails();

        if (slug) {
          // جلب تصنيف محدد بالـ slug
          const category = await Category.findOne({ slug, isActive: true })
            .populate('subCategories')
            .lean();

          if (category) {
            return NextResponse.json({
              success: true,
              category,
            });
          }
        }

        // جلب التصنيفات الرئيسية
        const query: Record<string, any> = {
          parentCategory: null,
          isActive: { $ne: false },
        };

        const categories = await Category.find(query)
          .sort({ sortOrder: 1, createdAt: 1 })
          .limit(limit)
          .populate('subCategories')
          .lean();

        if (categories && categories.length > 0) {
          return NextResponse.json({
            success: true,
            categories,
          });
        }
      } catch (dbError) {
        console.error('Error fetching categories from MongoDB:', dbError);
        // Fallback to mock data below
      }
    }

    // Fallback to MOCK_CATEGORIES
    if (slug) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === slug);
      return NextResponse.json({
        success: !!cat,
        category: cat || null,
      });
    }

    const mockSlice = MOCK_CATEGORIES.slice(0, limit);
    return NextResponse.json({
      success: true,
      categories: mockSlice,
    });
  } catch (error: any) {
    console.error('API /api/categories error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب التصنيفات', error: error.message },
      { status: 500 }
    );
  }
}
