import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Banner } from '@/models';
import { MOCK_BANNERS } from '@/lib/data/mockData';

// 1. GET: جلب جميع اللافتات الإعلانية للوحة التحكم
export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      // Seed if empty
      const count = await Banner.countDocuments();
      if (count === 0) {
        for (let i = 0; i < MOCK_BANNERS.length; i++) {
          const mb = MOCK_BANNERS[i];
          await Banner.create({
            title: mb.title,
            subtitle: mb.subtitle,
            badgeText: mb.badgeText || 'تخفيضات موسمية حصرية',
            imageUrlDesktop: mb.imageUrlDesktop,
            imageUrlMobile: mb.imageUrlMobile || mb.imageUrlDesktop,
            linkUrl: mb.linkUrl,
            buttonText: mb.buttonText || 'اكتشف الآن',
            sortOrder: i + 1,
            isActive: true,
          });
        }
      }

      const banners = await Banner.find().sort({ sortOrder: 1, createdAt: -1 }).lean();

      return NextResponse.json({
        success: true,
        banners: banners.map((b: any) => ({
          _id: b._id.toString(),
          title: b.title,
          titleFr: b.titleFr || '',
          titleEn: b.titleEn || '',
          subtitle: b.subtitle || '',
          subtitleFr: b.subtitleFr || '',
          subtitleEn: b.subtitleEn || '',
          badgeText: b.badgeText || 'عرض حصري',
          badgeTextFr: b.badgeTextFr || '',
          badgeTextEn: b.badgeTextEn || '',
          imageUrlDesktop: b.imageUrlDesktop,
          imageUrlMobile: b.imageUrlMobile || b.imageUrlDesktop,
          linkUrl: b.linkUrl,
          buttonText: b.buttonText || 'اكتشف الآن',
          buttonTextFr: b.buttonTextFr || '',
          buttonTextEn: b.buttonTextEn || '',
          sortOrder: b.sortOrder ?? 0,
          isActive: Boolean(b.isActive),
          createdAt: b.createdAt,
          updatedAt: b.updatedAt,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      banners: MOCK_BANNERS.map((b, i) => ({
        ...b,
        sortOrder: i + 1,
        isActive: true,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'حدث خطأ أثناء جلب اللافتات' },
      { status: 500 }
    );
  }
}

// 2. POST: إنشاء لافتة إعلانية جديدة
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      titleFr,
      titleEn,
      subtitle,
      subtitleFr,
      subtitleEn,
      badgeText,
      badgeTextFr,
      badgeTextEn,
      imageUrlDesktop,
      imageUrlMobile,
      linkUrl,
      buttonText,
      buttonTextFr,
      buttonTextEn,
      sortOrder,
      isActive = true,
      startDate,
      endDate,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'عنوان اللافتة الإعلانية مطلوب' },
        { status: 400 }
      );
    }

    if (!imageUrlDesktop?.trim()) {
      return NextResponse.json(
        { success: false, message: 'رابط صورة سطح المكتب مطلوب' },
        { status: 400 }
      );
    }

    if (!linkUrl?.trim()) {
      return NextResponse.json(
        { success: false, message: 'رابط التوجيه مطلوب' },
        { status: 400 }
      );
    }

    const payload = {
      title: title.trim(),
      titleFr: titleFr?.trim() || '',
      titleEn: titleEn?.trim() || '',
      subtitle: subtitle?.trim() || '',
      subtitleFr: subtitleFr?.trim() || '',
      subtitleEn: subtitleEn?.trim() || '',
      badgeText: badgeText?.trim() || 'عرض حصري',
      badgeTextFr: badgeTextFr?.trim() || '',
      badgeTextEn: badgeTextEn?.trim() || '',
      imageUrlDesktop: imageUrlDesktop.trim(),
      imageUrlMobile: (imageUrlMobile?.trim() || imageUrlDesktop.trim()),
      linkUrl: linkUrl.trim(),
      buttonText: buttonText?.trim() || 'اكتشف الآن',
      buttonTextFr: buttonTextFr?.trim() || '',
      buttonTextEn: buttonTextEn?.trim() || '',
      sortOrder: Number(sortOrder) || 0,
      isActive: Boolean(isActive),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    };

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const newBanner = await Banner.create(payload);
      return NextResponse.json({
        success: true,
        message: 'تم إضافة اللافتة الإعلانية بنجاح',
        banner: {
          _id: newBanner._id.toString(),
          ...payload,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم إضافة اللافتة (نمط الذاكرة)',
      banner: {
        _id: `ban_${Date.now()}`,
        ...payload,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'فشل إضافة اللافتة' },
      { status: 500 }
    );
  }
}

// 3. PATCH / PUT: تحديث لافتة أو تغيير حالتها / ترتيبها
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف اللافتة مطلوب' },
        { status: 400 }
      );
    }

    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      if (action === 'toggle-active') {
        const current = await Banner.findById(id);
        if (!current) {
          return NextResponse.json(
            { success: false, message: 'اللافتة غير موجودة' },
            { status: 404 }
          );
        }
        current.isActive = !current.isActive;
        await current.save();

        return NextResponse.json({
          success: true,
          message: current.isActive ? 'تم تفعيل اللافتة بنجاح' : 'تم تعطيل اللافتة بنجاح',
          banner: current,
        });
      }

      const updated = await Banner.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'تم تحديث اللافتة بنجاح',
        banner: updated,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم التحديث بنجاح',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'فشل تحديث اللافتة' },
      { status: 500 }
    );
  }
}

// 4. DELETE: حذف لافتة إعلانية
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'معرف اللافتة مطلوب للحذف' },
        { status: 400 }
      );
    }

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      await Banner.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: 'تم حذف اللافتة الإعلانية بنجاح',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم الحذف بنجاح',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'فشل حذف اللافتة' },
      { status: 500 }
    );
  }
}
