import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Detect if request is targeting the Dashboard subdomain
  // Supports production (dash.pc.com, dash.pharmaclick.dz) and local development (dash.localhost:3000)
  const isDashboardSubdomain = host.startsWith('dash.');

  if (isDashboardSubdomain) {
    const adminSession = request.cookies.get('admin_session');
    const isLogin = pathname === '/login' || pathname === '/admin/login';

    // Protect dashboard: require login session for all paths except login
    if (!adminSession?.value && !isLogin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If logged in and visiting /login, redirect to dashboard home
    if (adminSession?.value && isLogin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Rewrite internal paths so user sees clean URLs on subdomain:
    // - dash.pc.com/         -> internally renders /admin
    // - dash.pc.com/products -> internally renders /admin/products
    // - dash.pc.com/orders   -> internally renders /admin/orders
    // - dash.pc.com/login    -> internally renders /admin/login
    if (!pathname.startsWith('/admin')) {
      url.pathname = `/admin${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  }

  // 2. Standard domain access (e.g. pc.com or localhost:3000)
  // Protect direct /admin paths
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('admin_session');

    if (!adminSession?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except api, static files, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
