import { NextRequest, NextResponse } from 'next/server';
import { generateR2PresignedPutUrl } from '@/lib/cloudflareR2';
import { checkRateLimit } from '@/lib/rateLimit';

// الحد الأقصى لحجم الصور: 10 ميجابايت (10MB)
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// الامتدادات وأنواع الوسائط المسموح بها حصراً
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export async function POST(req: NextRequest) {
  try {
    // 1. فحص الحد من الطلبات المتكررة (Rate Limiting: 25 طلب رفع كحد أقصى خلال 10 دقائق)
    const rateLimitResult = checkRateLimit(req, {
      limit: 25,
      windowMs: 10 * 60 * 1000,
      prefix: 'upload',
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'تم تجاوز الحد الأقصى لطلبات رفع الصور، يرجى المحاولة بعد قليل.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const { filename, contentType, fileSize, folder = 'products' } = body;

    // 2. التحقق من وجود اسم الملف
    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        { success: false, message: 'اسم الملف مطلوب ويجب أن يكون نصاً صالحاً' },
        { status: 400 }
      );
    }

    // 3. التحقق الصارم من امتداد الملف
    const fileExt = filename.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        {
          success: false,
          message: `امتداد الملف غير مدعوم (.${fileExt}). الامتدادات المسموحة فقط هي: ${ALLOWED_EXTENSIONS.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 4. التحقق من نوع الوسائط (Content-Type / MIME)
    const normalizedContentType = (contentType || 'image/jpeg').toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(normalizedContentType)) {
      return NextResponse.json(
        {
          success: false,
          message: `نوع الصورة غير مسموح (${normalizedContentType}). الأنواع المدعومة فقط: JPG, PNG, WEBP`,
        },
        { status: 400 }
      );
    }

    // 5. التحقق من الحجم الأقصى المسموح به (10MB)
    if (fileSize && typeof fileSize === 'number' && fileSize > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: `حجم الصورة (${(fileSize / (1024 * 1024)).toFixed(1)} ميجابايت) يتجاوز الحد الأقصى المسموح به (10 ميجابايت).`,
        },
        { status: 400 }
      );
    }

    // 6. تنظيف وتأمين اسم الملف ومساره
    const cleanFilename = filename
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-');

    const cleanFolder = ['products', 'banners', 'brands', 'categories'].includes(folder)
      ? folder
      : 'products';

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const key = `uploads/${cleanFolder}/${timestamp}-${randomSuffix}-${cleanFilename}`;

    const { uploadUrl, publicUrl } = generateR2PresignedPutUrl({
      key,
      contentType: normalizedContentType,
      expiresInSeconds: 900, // 15 دقيقة
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
      message: 'تم التحقق الأمني وتوليد رابط الرفع المسبق (Presigned URL) بنجاح',
    });
  } catch (error: any) {
    console.error('Presigned URL security & generation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'فشل في توليد رابط الرفع' },
      { status: 500 }
    );
  }
}
