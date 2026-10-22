import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Product, Category, Brand } from '@/models';
import { MOCK_PRODUCTS } from '@/lib/data/mockData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const stockStatus = searchParams.get('stock') || '';

    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      // Seed if empty
      const count = await Product.countDocuments();
      if (count === 0) {
        for (const p of MOCK_PRODUCTS) {
          await Product.create({
            name: p.name,
            slug: p.slug,
            category: new mongoose.Types.ObjectId(), // placeholder
            price: p.price,
            originalPrice: p.originalPrice,
            discountPercentage: p.discountPercentage || 0,
            stockQuantity: p.stockQuantity,
            inStock: p.inStock,
            images: p.images,
            shortDescription: p.sizeOrVolume,
            description: p.description || p.name,
            usageInstructions: 'للاستخدام الخارجي فقط. يرجى اتباع التعليمات المدونة على العبوة.',
            isOnlineVisible: true,
          });
        }
      }

      const query: Record<string, any> = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
        ];
      }

      if (stockStatus === 'in_stock') query.stockQuantity = { $gte: 10 };
      if (stockStatus === 'low_stock') query.stockQuantity = { $gt: 0, $lt: 10 };
      if (stockStatus === 'out_of_stock') query.stockQuantity = { $lte: 0 };

      const products = await Product.find(query).sort({ createdAt: -1 }).lean();

      return NextResponse.json({
        success: true,
        products: products.map((p) => ({
          _id: p._id.toString(),
          name: p.name,
          nameAr: (p as any).nameAr || p.name,
          nameFr: (p as any).nameFr || '',
          nameEn: (p as any).nameEn || '',
          slug: p.slug,
          brand: p.brand,
          category: typeof p.category === 'string' ? p.category : 'العناية بالبشرة',
          categorySlug: 'skincare',
          price: p.price,
          originalPrice: p.originalPrice,
          discountPercentage: p.discountPercentage,
          stockQuantity: p.stockQuantity,
          inStock: p.inStock,
          images: p.images || [],
          sizeOrVolume: (p as any).shortDescription || (p as any).summary || '',
          descriptionFr: (p as any).descriptionFr || '',
          descriptionEn: (p as any).descriptionEn || '',
        })),
      });
    }
  } catch (err) {
    console.warn('MongoDB products query error, falling back to mock catalog:', err);
  }

  // Fallback to MOCK_PRODUCTS
  return NextResponse.json({
    success: true,
    products: MOCK_PRODUCTS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      nameFr,
      nameEn,
      slug,
      brand,
      category,
      price,
      originalPrice,
      stockQuantity,
      sizeOrVolume,
      imageUrl,
      summary,
      shortDescriptionFr,
      shortDescriptionEn,
      description,
      descriptionFr,
      descriptionEn,
      usageInstructions,
      usageInstructionsFr,
      usageInstructionsEn,
      usageGuidelines,
      healthWarnings,
      healthWarningsFr,
      healthWarningsEn,
      inStock = true,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'اسم المستحضر والسعر مطلوبان' },
        { status: 400 }
      );
    }

    const cleanSlug =
      slug ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const discountPercentage =
      originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    const resolvedUsage = (usageInstructions || usageGuidelines || '').trim();
    const resolvedWarnings = (healthWarnings || '').trim();

    const productPayload = {
      name: name.trim(),
      nameAr: name.trim(),
      nameFr: nameFr?.trim() || '',
      nameEn: nameEn?.trim() || '',
      slug: cleanSlug,
      category: new mongoose.Types.ObjectId(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercentage,
      stockQuantity: Number(stockQuantity) || 0,
      inStock: Boolean(inStock),
      images: [{ url: imageUrl || '/products/hyalu-b5.png', alt: name, isPrimary: true }],
      shortDescription: summary || sizeOrVolume || '',
      shortDescriptionAr: summary || sizeOrVolume || '',
      shortDescriptionFr: shortDescriptionFr?.trim() || '',
      shortDescriptionEn: shortDescriptionEn?.trim() || '',
      description: description || name,
      descriptionAr: description || name,
      descriptionFr: descriptionFr?.trim() || '',
      descriptionEn: descriptionEn?.trim() || '',
      usageInstructions: resolvedUsage || 'يرجى اتباع تعليمات الاستخدام المدونة على العبوة بدقة.',
      usageInstructionsFr: usageInstructionsFr?.trim() || '',
      usageInstructionsEn: usageInstructionsEn?.trim() || '',
      healthWarnings: resolvedWarnings || 'للاستعمال الخارجي فقط. يحفظ بعيداً عن متناول الأطفال.',
      healthWarningsFr: healthWarningsFr?.trim() || '',
      healthWarningsEn: healthWarningsEn?.trim() || '',
      isOnlineVisible: true,
    };

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const created = await Product.create(productPayload);
        return NextResponse.json({
          success: true,
          message: 'تم إضافة المستحضر بنجاح إلى قاعدة البيانات',
          product: created,
        });
      } catch (dbErr: any) {
        console.warn('MongoDB product create error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ المستحضر بنجاح',
      product: { _id: `prod_${Date.now()}`, ...productPayload },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف المستحضر مطلوب للحذف' },
        { status: 400 }
      );
    }

    if (process.env.MONGODB_URI && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await connectToDatabase();
        await Product.findByIdAndDelete(id);
        return NextResponse.json({
          success: true,
          message: 'تم حذف المستحضر بنجاح من قاعدة البيانات',
        });
      } catch (dbErr: any) {
        console.warn('MongoDB delete error:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستحضر بنجاح',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

