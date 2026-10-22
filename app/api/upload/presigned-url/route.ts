import { NextRequest, NextResponse } from 'next/server';
import { generateR2PresignedPutUrl } from '@/lib/cloudflareR2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, contentType, folder = 'products' } = body;

    if (!filename) {
      return NextResponse.json(
        { success: false, message: 'اسم الملف مطلوب' },
        { status: 400 }
      );
    }

    // Sanitize filename
    const cleanFilename = filename
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '-');

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const key = `uploads/${folder}/${timestamp}-${randomSuffix}-${cleanFilename}`;

    const { uploadUrl, publicUrl } = generateR2PresignedPutUrl({
      key,
      contentType: contentType || 'image/jpeg',
      expiresInSeconds: 900, // 15 mins
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      publicUrl,
      key,
      message: 'تم توليد رابط الرفع المسبق (Presigned URL) بنجاح',
    });
  } catch (error: any) {
    console.error('Presigned URL generation error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'فشل في توليد رابط الرفع' },
      { status: 500 }
    );
  }
}
