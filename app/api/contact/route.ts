import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { ALGERIA_WILAYAS, TOTAL_ALGERIA_WILAYAS } from "@/lib/constants/wilayas";

export async function POST(req: NextRequest) {
  try {
    // 1. فحص الحد من الإغراق والسبام (Rate Limiting: 4 رسائل كحد أقصى خلال 10 دقائق لكل عنوان IP)
    const rateLimit = checkRateLimit(req, {
      limit: 4,
      windowMs: 10 * 60 * 1000,
      prefix: "contact",
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "تم إرسال عدة رسائل في وقت قصير. يرجى الانتظار بضع دقائق قبل إرسال استفسار جديد.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const { fullName, phone, wilaya, subject, message } = body;

    // 2. التحقق من صحة الاسم
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: "الاسم الكامل مطلوب (3 أحرف على الأقل)" },
        { status: 400 }
      );
    }

    // 3. التحقق من رقم الهاتف الجزائري
    const cleanPhone = (phone || "").trim().replace(/\s+/g, "");
    const algerianPhoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!algerianPhoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: "رقم الهاتف غير صالح. يجب أن يتكون من 10 أرقام ويبدأ بـ 05 أو 06 أو 07",
        },
        { status: 400 }
      );
    }

    // 4. التحقق من الولاية المختارة (معيار الـ 69 ولاية)
    if (wilaya && typeof wilaya === "string") {
      const wilayaNumber = parseInt(wilaya, 10);
      const isWilayaValid =
        (!isNaN(wilayaNumber) && wilayaNumber >= 1 && wilayaNumber <= TOTAL_ALGERIA_WILAYAS) ||
        ALGERIA_WILAYAS.some((w) => w.nameAr === wilaya || w.nameFr === wilaya);

      if (!isWilayaValid) {
        return NextResponse.json(
          {
            success: false,
            message: `يرجى اختيار ولاية صالحة من بين الـ ${TOTAL_ALGERIA_WILAYAS} ولاية جزائرية`,
          },
          { status: 400 }
        );
      }
    }

    // 5. التحقق من نص الرسالة
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "نص الرسالة مطلوب (10 أحرف على الأقل)" },
        { status: 400 }
      );
    }

    // تسجيل الرسالة بنجاح
    console.log("[Contact Message Received]:", {
      fullName: fullName.trim(),
      phone: cleanPhone,
      wilaya: wilaya || "غير محدد",
      subject: subject || "استفسار عام",
      messageLength: message.trim().length,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح! سيقوم فريق المستشارين المعتمدين بالرد عليك سريعاً.",
    });
  } catch (error: any) {
    console.error("API /api/contact error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ أثناء إرسال الرسالة" },
      { status: 500 }
    );
  }
}
