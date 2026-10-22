import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { MarketingSection, Product } from '@/models';
import { MOCK_PRODUCTS } from '@/lib/data/mockData';

// Fallback in-memory store if MongoDB is not connected
let inMemorySections: any[] = [
  {
    _id: 'sec_1',
    title: 'اختيارات مميزة لك',
    subtitle: 'مجموعة منتقاة بعناية لتعزيز نضارة وإشراقة بشرتك اليومية',
    emoji: '💎',
    badgeText: 'موصى به',
    selectionType: 'manual',
    products: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
    dynamicCriteria: 'featured',
    limit: 8,
    backgroundColor: '',
    sortOrder: 1,
    isActive: true,
  },
  {
    _id: 'sec_2',
    title: 'عناية بأسعار أحلى (تخفيضات كبرى)',
    subtitle: 'عروض حصرية وتخفيضات استثنائية على أشهر الماركات العالمية المعتمدة',
    emoji: '🏷️',
    badgeText: 'تخفيضات كبرى',
    selectionType: 'dynamic',
    dynamicCriteria: 'on_sale',
    products: [],
    limit: 8,
    backgroundColor: '',
    sortOrder: 2,
    isActive: true,
  },
  {
    _id: 'sec_3',
    title: 'الأكثر طلباً ومبيعاً',
    subtitle: 'المستحضرات الأكثر ثقة وشراءً من قبل زبائننا في كافة الولايات',
    emoji: '🔥',
    badgeText: 'الأكثر مبيعاً',
    selectionType: 'dynamic',
    dynamicCriteria: 'best_sellers',
    products: [],
    limit: 8,
    backgroundColor: '',
    sortOrder: 3,
    isActive: true,
  },
];

// Helper to format resolved products for frontend
function formatResolvedProducts(products: any[]) {
  if (!Array.isArray(products)) return [];
  return products.map((p) => ({
    _id: p._id?.toString() || p.id || '',
    name: p.name || '',
    nameAr: p.nameAr || p.name || '',
    nameFr: p.nameFr || '',
    nameEn: p.nameEn || '',
    brand: typeof p.brand === 'string' ? p.brand : (p.brand?.name || 'ماركة معتمدة'),
    price: p.price || 0,
    originalPrice: p.originalPrice,
    discountPercentage: p.discountPercentage || 0,
    image: p.images?.[0]?.url || p.image || '/products/hyalu-b5.png',
    category: typeof p.category === 'string' ? p.category : (p.category?.nameAr || 'العناية بالبشرة'),
    categorySlug: p.categorySlug || 'skincare',
    inStock: p.inStock !== false && (p.stockQuantity === undefined || p.stockQuantity > 0),
    sizeOrVolume: p.shortDescription || p.sizeOrVolume || '',
  }));
}

export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const count = await MarketingSection.countDocuments();
      if (count === 0) {
        // Seed default sections
        for (const s of inMemorySections) {
          await MarketingSection.create({
            title: s.title,
            subtitle: s.subtitle,
            emoji: s.emoji,
            badgeText: s.badgeText,
            selectionType: s.selectionType,
            dynamicCriteria: s.dynamicCriteria,
            limit: s.limit,
            backgroundColor: s.backgroundColor,
            sortOrder: s.sortOrder,
            isActive: s.isActive,
            products: [],
          });
        }
      }

      const dbSections = await MarketingSection.find().sort({ sortOrder: 1 });
      const populatedSections = [];

      for (const sec of dbSections) {
        let resolved = [];
        try {
          resolved = await sec.getResolvedProducts();
        } catch (resolveErr) {
          console.warn(`Error resolving products for section ${sec._id}:`, resolveErr);
        }

        // If dynamic returned 0 from database, provide fallback sample from MOCK_PRODUCTS
        if (resolved.length === 0 && sec.selectionType === 'dynamic') {
          if (sec.dynamicCriteria === 'on_sale') {
            resolved = MOCK_PRODUCTS.filter((p) => p.discountPercentage && p.discountPercentage > 0).slice(0, sec.limit || 8);
          } else if (sec.dynamicCriteria === 'best_sellers') {
            resolved = MOCK_PRODUCTS.filter((p) => p.isBestSeller).slice(0, sec.limit || 8);
          } else {
            resolved = MOCK_PRODUCTS.slice(0, sec.limit || 8);
          }
        }

        populatedSections.push({
          id: sec._id.toString(),
          title: sec.title,
          titleFr: sec.titleFr || '',
          titleEn: sec.titleEn || '',
          subtitle: sec.subtitle || '',
          subtitleFr: sec.subtitleFr || '',
          subtitleEn: sec.subtitleEn || '',
          emoji: sec.emoji || '🏷️',
          badge: sec.badgeText || '',
          badgeTextFr: sec.badgeTextFr || '',
          badgeTextEn: sec.badgeTextEn || '',
          selectionType: sec.selectionType,
          dynamicCriteria: sec.dynamicCriteria || 'featured',
          targetCategory: sec.targetCategory?.toString() || null,
          limit: sec.limit || 8,
          backgroundColor: sec.backgroundColor || '',
          productIds: (sec.products || []).map((p: any) => p.toString()),
          resolvedProducts: formatResolvedProducts(resolved),
          order: sec.sortOrder,
          isActive: sec.isActive,
        });
      }

      return NextResponse.json({
        success: true,
        sections: populatedSections,
      });
    }
  } catch (err) {
    console.warn('MongoDB marketing query failed, using memory store:', err);
  }

  // Fallback to sorted in-memory sections
  const sorted = [...inMemorySections].sort((a, b) => a.sortOrder - b.sortOrder);
  return NextResponse.json({
    success: true,
    sections: sorted.map((s) => ({
      id: s._id,
      title: s.title,
      subtitle: s.subtitle || '',
      emoji: s.emoji || '🏷️',
      badge: s.badgeText || '',
      selectionType: s.selectionType,
      dynamicCriteria: s.dynamicCriteria || 'featured',
      targetCategory: s.targetCategory || null,
      limit: s.limit || 8,
      backgroundColor: s.backgroundColor || '',
      productIds: s.products || [],
      resolvedProducts: formatResolvedProducts(
        (s.products || []).map((pid: string) => MOCK_PRODUCTS.find((p) => p._id === pid)).filter(Boolean)
      ),
      order: s.sortOrder,
      isActive: s.isActive,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      titleFr = '',
      titleEn = '',
      subtitle = '',
      subtitleFr = '',
      subtitleEn = '',
      emoji = '🏷️',
      badge = 'جديد',
      badgeTextFr = '',
      badgeTextEn = '',
      badgeFr = '',
      badgeEn = '',
      order = 1,
      productIds = [],
      selectionType = 'manual',
      dynamicCriteria = 'featured',
      targetCategory = null,
      limit = 8,
      backgroundColor = '',
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ success: false, message: 'عنوان القسم مطلوب' }, { status: 400 });
    }

    const sortOrder = Number(order) || 1;
    const cleanProductIds = Array.isArray(productIds) ? productIds : [];

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const validObjectIds = cleanProductIds
          .filter((id: string) => mongoose.Types.ObjectId.isValid(id))
          .map((id: string) => new mongoose.Types.ObjectId(id));

        let targetCatId: mongoose.Types.ObjectId | undefined = undefined;
        if (targetCategory && targetCategory !== 'all' && targetCategory !== 'null') {
          if (mongoose.Types.ObjectId.isValid(targetCategory)) {
            targetCatId = new mongoose.Types.ObjectId(targetCategory);
          } else {
            const Category = mongoose.models.Category || mongoose.model('Category');
            const foundCat = await Category.findOne({ slug: targetCategory });
            if (foundCat) targetCatId = foundCat._id;
          }
        }

        const created = await MarketingSection.create({
          title: title.trim(),
          titleFr: titleFr?.trim() || '',
          titleEn: titleEn?.trim() || '',
          subtitle: subtitle?.trim(),
          subtitleFr: subtitleFr?.trim() || '',
          subtitleEn: subtitleEn?.trim() || '',
          emoji: emoji?.trim() || '🏷️',
          badgeText: badge?.trim() || 'جديد',
          badgeTextFr: (badgeTextFr || badgeFr)?.trim() || '',
          badgeTextEn: (badgeTextEn || badgeEn)?.trim() || '',
          selectionType,
          dynamicCriteria,
          targetCategory: targetCatId,
          limit: selectionType === 'dynamic' ? (Number(limit) || 8) : 0,
          backgroundColor: backgroundColor?.trim(),
          sortOrder,
          products: validObjectIds,
          isActive: true,
        });

        return NextResponse.json({
          success: true,
          message: 'تم حفظ القسم الترويجي بنجاح في قاعدة البيانات',
          section: {
            id: created._id.toString(),
            title: created.title,
            titleFr: created.titleFr || '',
            titleEn: created.titleEn || '',
            subtitle: created.subtitle || '',
            subtitleFr: created.subtitleFr || '',
            subtitleEn: created.subtitleEn || '',
            emoji: created.emoji || '🏷️',
            badge: created.badgeText || '',
            badgeTextFr: created.badgeTextFr || '',
            badgeTextEn: created.badgeTextEn || '',
            selectionType: created.selectionType,
            dynamicCriteria: created.dynamicCriteria,
            targetCategory: created.targetCategory?.toString() || null,
            limit: created.limit,
            backgroundColor: created.backgroundColor || '',
            productIds: cleanProductIds,
            order: created.sortOrder,
            isActive: created.isActive,
          },
        });
      } catch (dbErr) {
        console.warn('MongoDB save error, falling back to memory store:', dbErr);
      }
    }

    const newSec = {
      _id: `sec_${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle?.trim(),
      emoji: emoji?.trim() || '🏷️',
      badgeText: badge?.trim() || 'جديد',
      selectionType,
      dynamicCriteria,
      targetCategory,
      limit: Number(limit) || 8,
      backgroundColor: backgroundColor?.trim(),
      sortOrder,
      products: cleanProductIds,
      isActive: true,
    };
    inMemorySections.push(newSec);

    return NextResponse.json({
      success: true,
      message: 'تم حفظ القسم الترويجي بنجاح',
      section: {
        id: newSec._id,
        title: newSec.title,
        subtitle: newSec.subtitle,
        emoji: newSec.emoji,
        badge: newSec.badgeText,
        selectionType: newSec.selectionType,
        dynamicCriteria: newSec.dynamicCriteria,
        targetCategory: newSec.targetCategory,
        limit: newSec.limit,
        backgroundColor: newSec.backgroundColor,
        productIds: cleanProductIds,
        order: newSec.sortOrder,
        isActive: newSec.isActive,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Reordering multiple sections
    if (Array.isArray(body.reorder)) {
      const reorderList: Array<{ id: string; sortOrder: number }> = body.reorder;

      if (process.env.MONGODB_URI) {
        try {
          await connectToDatabase();
          for (const item of reorderList) {
            if (mongoose.Types.ObjectId.isValid(item.id)) {
              await MarketingSection.findByIdAndUpdate(item.id, { sortOrder: item.sortOrder });
            }
          }
        } catch (dbErr) {
          console.warn('MongoDB reorder error:', dbErr);
        }
      }

      // Update in memory
      for (const item of reorderList) {
        const found = inMemorySections.find((s) => s._id === item.id);
        if (found) found.sortOrder = item.sortOrder;
      }

      return NextResponse.json({
        success: true,
        message: 'تم تحديث وترتيب الأقسام الترويجية بنجاح',
      });
    }

    // 2. Updating single section
    const {
      id,
      title,
      titleFr,
      titleEn,
      subtitle,
      subtitleFr,
      subtitleEn,
      emoji,
      badge,
      badgeTextFr,
      badgeTextEn,
      badgeFr,
      badgeEn,
      selectionType,
      dynamicCriteria,
      targetCategory,
      limit,
      backgroundColor,
      productIds,
      sortOrder,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف القسم مطلوب' }, { status: 400 });
    }

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        if (mongoose.Types.ObjectId.isValid(id)) {
          const updateData: Record<string, any> = {};
          if (title !== undefined) updateData.title = title.trim();
          if (titleFr !== undefined) updateData.titleFr = titleFr.trim();
          if (titleEn !== undefined) updateData.titleEn = titleEn.trim();
          if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
          if (subtitleFr !== undefined) updateData.subtitleFr = subtitleFr.trim();
          if (subtitleEn !== undefined) updateData.subtitleEn = subtitleEn.trim();
          if (emoji !== undefined) updateData.emoji = emoji.trim();
          if (badge !== undefined) updateData.badgeText = badge.trim();
          if (badgeTextFr !== undefined) updateData.badgeTextFr = badgeTextFr.trim();
          else if (badgeFr !== undefined) updateData.badgeTextFr = badgeFr.trim();
          if (badgeTextEn !== undefined) updateData.badgeTextEn = badgeTextEn.trim();
          else if (badgeEn !== undefined) updateData.badgeTextEn = badgeEn.trim();
          if (selectionType !== undefined) updateData.selectionType = selectionType;
          if (dynamicCriteria !== undefined) updateData.dynamicCriteria = dynamicCriteria;
          if (targetCategory !== undefined) {
            if (!targetCategory || targetCategory === 'all' || targetCategory === 'null') {
              updateData.targetCategory = null;
            } else if (mongoose.Types.ObjectId.isValid(targetCategory)) {
              updateData.targetCategory = new mongoose.Types.ObjectId(targetCategory);
            } else {
              const Category = mongoose.models.Category || mongoose.model('Category');
              const foundCat = await Category.findOne({ slug: targetCategory });
              updateData.targetCategory = foundCat ? foundCat._id : null;
            }
          }
          if (limit !== undefined) {
            updateData.limit = selectionType === 'dynamic' ? Number(limit) : 0;
          }
          if (backgroundColor !== undefined) updateData.backgroundColor = backgroundColor.trim();
          if (sortOrder !== undefined) updateData.sortOrder = Number(sortOrder);
          if (isActive !== undefined) updateData.isActive = Boolean(isActive);

          if (Array.isArray(productIds)) {
            updateData.products = productIds
              .filter((pid: string) => mongoose.Types.ObjectId.isValid(pid))
              .map((pid: string) => new mongoose.Types.ObjectId(pid));
          }

          const updated = await MarketingSection.findByIdAndUpdate(id, updateData, { new: true });
          if (updated) {
            return NextResponse.json({
              success: true,
              message: 'تم تحديث إعدادات القسم الترويجي بنجاح في قاعدة البيانات',
            });
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB update error:', dbErr);
      }
    }

    // Memory update
    const found = inMemorySections.find((s) => s._id === id);
    if (found) {
      if (title !== undefined) found.title = title;
      if (subtitle !== undefined) found.subtitle = subtitle;
      if (emoji !== undefined) found.emoji = emoji;
      if (badge !== undefined) found.badgeText = badge;
      if (selectionType !== undefined) found.selectionType = selectionType;
      if (dynamicCriteria !== undefined) found.dynamicCriteria = dynamicCriteria;
      if (targetCategory !== undefined) found.targetCategory = targetCategory;
      if (limit !== undefined) found.limit = Number(limit);
      if (backgroundColor !== undefined) found.backgroundColor = backgroundColor;
      if (sortOrder !== undefined) found.sortOrder = Number(sortOrder);
      if (isActive !== undefined) found.isActive = Boolean(isActive);
      if (Array.isArray(productIds)) found.products = productIds;
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث القسم الترويجي بنجاح',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف القسم مطلوب' }, { status: 400 });
    }

    if (process.env.MONGODB_URI && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await connectToDatabase();
        await MarketingSection.findByIdAndDelete(id);
      } catch (dbErr) {
        console.warn('MongoDB delete error:', dbErr);
      }
    }

    inMemorySections = inMemorySections.filter((s) => s._id !== id);
    return NextResponse.json({ success: true, message: 'تم حذف القسم بنجاح' });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
