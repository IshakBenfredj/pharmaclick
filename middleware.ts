import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = (request.headers.get('host') || '').toLowerCase();

  // 1. التحقق مما إذا كان الطلب عبر النطاق الفرعي المخصص للإدارة (dash.)
  // يدعم بيئة الإنتاج (مثل: dash.pharmaclick.dz أو dash.domain.com) وبيئة التطوير المحلية (dash.localhost:3000)
  // مع دعم ترويسة x-subdomain: dash للمحاكاة والاختبار في البيئات التي تفتقر لإعداد DNS المحلي
  const isDashboardSubdomain =
    host.startsWith('dash.') ||
    request.headers.get('x-subdomain') === 'dash';

  if (isDashboardSubdomain) {
    const adminSession = request.cookies.get('admin_session');

    // إزالة بادئة /admin إن وُجدت لتكون الروابط نظيفة ومستقلة على النطاق الفرعي
    // مثلاً: dash.domain.com/admin/login -> تحويل مباشر إلى dash.domain.com/login
    // مثلاً: dash.domain.com/admin/products -> تحويل مباشر إلى dash.domain.com/products
    // مثلاً: dash.domain.com/admin -> تحويل مباشر إلى dash.domain.com/
    if (pathname.startsWith('/admin')) {
      const cleanPath = pathname.replace(/^\/admin/, '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }

    const isLogin = pathname === '/login';

    // حماية لوحة التحكم: اشتراط تسجيل الدخول لجميع المسارات باستثناء صفحة تسجيل الدخول /login
    if (!adminSession?.value && !isLogin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // إذا كان المشرف مسجلاً للدخول بالفعل وحاول زيارة /login، يتم تحويله للرئيسية /
    if (adminSession?.value && isLogin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // إعادة توجيه داخلية خفية (Internal Rewrite):
    // dash.domain.com/         -> يقرأ داخلياً من /admin
    // dash.domain.com/login    -> يقرأ داخلياً من /admin/login
    // dash.domain.com/products -> يقرأ داخلياً من /admin/products
    // dash.domain.com/orders   -> يقرأ داخلياً من /admin/orders
    url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. الوصول عبر النطاق الرئيسي العام (مثل: domain.com أو pharmaclick.dz أو localhost:3000)
  // حظر تام وحاسم لكافة مسارات /admin و /admin/login على النطاق العام
  // الوصول إلى لوحة الإدارة مقتصر ومحصور حصراً عبر النطاق الفرعي dash.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // إرجاع صفحة 404 كاملة لإخفاء وجود لوحة التحكم تماماً عن الزوار ومحركات البحث
    url.pathname = '/not-found';
    return NextResponse.rewrite(url, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  // مطابقة كافة المسارات باستثناء مسارات الـ API والأصول الثابتة
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
