import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GlobalShippingConfig } from '@/models/ShippingSetting';

// In-memory fallback configuration when MongoDB is not connected
let inMemoryShippingConfig = {
  isFreeShippingEnabled: false, // افتراضياً غير مفعل حتى يفعله المدير
  freeShippingThreshold: 10000, // المبلغ الافتراضي عند التفعيل
};

export async function GET() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      let config = await GlobalShippingConfig.findOne().lean();
      if (!config) {
        // Create initial default setting (disabled by default)
        const created = await GlobalShippingConfig.create({
          isFreeShippingEnabled: false,
          freeShippingThreshold: 10000,
        });
        config = created.toObject();
      }
      return NextResponse.json({
        success: true,
        isFreeShippingEnabled: Boolean(config.isFreeShippingEnabled),
        freeShippingThreshold: Number(config.freeShippingThreshold) || 10000,
      });
    }
  } catch (err) {
    console.warn('MongoDB shipping settings fetch failed, using fallback:', err);
  }

  return NextResponse.json({
    success: true,
    isFreeShippingEnabled: inMemoryShippingConfig.isFreeShippingEnabled,
    freeShippingThreshold: inMemoryShippingConfig.freeShippingThreshold,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { isFreeShippingEnabled, freeShippingThreshold } = body;

    const newIsEnabled = Boolean(isFreeShippingEnabled);
    const newThreshold = Math.max(0, Number(freeShippingThreshold) || 10000);

    inMemoryShippingConfig = {
      isFreeShippingEnabled: newIsEnabled,
      freeShippingThreshold: newThreshold,
    };

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        let config = await GlobalShippingConfig.findOne();
        if (config) {
          config.isFreeShippingEnabled = newIsEnabled;
          config.freeShippingThreshold = newThreshold;
          await config.save();
        } else {
          await GlobalShippingConfig.create({
            isFreeShippingEnabled: newIsEnabled,
            freeShippingThreshold: newThreshold,
          });
        }
      } catch (dbErr) {
        console.error('Error saving shipping config to MongoDB:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث إعدادات التوصيل والشحن المجاني بنجاح',
      isFreeShippingEnabled: newIsEnabled,
      freeShippingThreshold: newThreshold,
    });
  } catch (error: any) {
    console.error('Error updating shipping settings:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء حفظ الإعدادات' },
      { status: 500 }
    );
  }
}
