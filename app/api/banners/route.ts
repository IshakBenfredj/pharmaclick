import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Banner } from '@/models';
import { MOCK_BANNERS } from '@/lib/data/mockData';

export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();

      // Seed default banners if collection is completely empty
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

      const now = new Date();
      const dbBanners = await Banner.find({
        isActive: true,
        $and: [
          { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
          { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
        ],
      })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();

      if (dbBanners && dbBanners.length > 0) {
        const banners = dbBanners.map((b: any) => ({
          _id: b._id.toString(),
          title: b.title,
          titleAr: b.title,
          titleFr: b.titleFr || '',
          titleEn: b.titleEn || '',
          subtitle: b.subtitle || '',
          subtitleAr: b.subtitle || '',
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
        }));

        return NextResponse.json({
          success: true,
          banners,
        });
      }
    }

    // Fallback to mock banners if DB is unavailable or returns 0 items
    return NextResponse.json({
      success: true,
      banners: MOCK_BANNERS,
    });
  } catch (error: any) {
    console.warn('GET /api/banners fallback to mock due to error:', error?.message);
    return NextResponse.json({
      success: true,
      banners: MOCK_BANNERS,
    });
  }
}
