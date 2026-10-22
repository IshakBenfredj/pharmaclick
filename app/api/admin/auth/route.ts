import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Admin, { verifyPassword } from '@/models/Admin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try DB lookup if MongoDB is connected
    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const admin = await Admin.findOne({ email: cleanEmail, isActive: true }).select('+password');
        if (admin) {
          const isMatch = await admin.comparePassword(password);
          if (isMatch) {
            // Update lastLoginAt
            admin.lastLoginAt = new Date();
            await admin.save();

            const userSafe = {
              id: admin._id,
              fullName: admin.fullName,
              email: admin.email,
              role: admin.role,
              permissions: admin.permissions,
            };

            const response = NextResponse.json({
              success: true,
              message: 'تم تسجيل الدخول بنجاح',
              user: userSafe,
            });

            // Set cookie for admin session
            response.cookies.set('admin_session', JSON.stringify(userSafe), {
              httpOnly: false, // accessible to client for quick state
              path: '/',
              maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return response;
          }
        }
      } catch (dbErr) {
        console.warn('MongoDB admin check failed, checking fallback credentials:', dbErr);
      }
    }

    // 2. Demo Fallback credentials for instant development / demo
    if (
      (cleanEmail === 'admin@pharmaclick.dz' || cleanEmail === 'admin@admin.com') &&
      password === 'admin123456'
    ) {
      const demoUser = {
        id: 'demo_super_admin_1',
        fullName: 'المدير العام (PharmaClick)',
        email: cleanEmail,
        role: 'super_admin' as const,
        permissions: [
          'manage_products',
          'manage_categories',
          'manage_brands',
          'manage_marketing',
          'manage_orders',
          'manage_shipping',
          'manage_admins',
          'view_analytics',
        ],
      };

      const response = NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح (حساب تجريبي معتمد)',
        user: demoUser,
      });

      response.cookies.set('admin_session', JSON.stringify(demoUser), {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'بيانات تسجيل الدخول غير صحيحة، يرجى التحقق من البريد وكلمة المرور' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Admin Auth Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ غير متوقع أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });

  response.cookies.delete('admin_session');
  return response;
}

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('admin_session');
  if (!sessionCookie?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = JSON.parse(sessionCookie.value);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
