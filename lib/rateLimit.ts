import { NextRequest } from "next/server";

interface RateLimitOptions {
  /** الحد الأقصى لعدد المحاولات المسموح بها في النافذة الزمنية */
  limit: number;
  /** مدة النافذة الزمنية بالميلي ثانية (الافتراضي: 60000 = دقيقة واحدة) */
  windowMs: number;
  /** بادئة لتمييز المسار (مثل 'orders', 'contact', 'upload') */
  prefix?: string;
}

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// تخزين محلي بالذاكرة للمسارات مع تنظيف دوري
const rateLimitMap = new Map<string, RateLimitRecord>();

// تنظيف السجلات منتهية الصلاحية كل 5 دقائق
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * استخراج عنوان IP الحقيقي للعميل مع دعم شبكات CDN و Cloudflare
 */
export function getClientIp(req: NextRequest): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",");
    if (ips[0]) return ips[0].trim();
  }

  return "127.0.0.1";
}

/**
 * التحقق من معدل الطلبات لمنع السبام والهجمات والإغراق
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
} {
  const ip = getClientIp(req);
  const prefix = options.prefix || "global";
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const existingRecord = rateLimitMap.get(key);

  if (!existingRecord || now > existingRecord.resetAt) {
    rateLimitMap.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      success: true,
      limit: options.limit,
      remaining: options.limit - 1,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  if (existingRecord.count >= options.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existingRecord.resetAt - now) / 1000)
    );

    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  existingRecord.count += 1;

  return {
    success: true,
    limit: options.limit,
    remaining: Math.max(0, options.limit - existingRecord.count),
    retryAfterSeconds: Math.ceil((existingRecord.resetAt - now) / 1000),
  };
}
