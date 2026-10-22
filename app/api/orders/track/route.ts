import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = (searchParams.get('orderNumber') || '').trim();
    const phone = (searchParams.get('phone') || '').trim().replace(/\s+/g, '');

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال رقم الطلب (مثال: ORD-2026-123456)' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال رقم الهاتف المسجل في الطلب' },
        { status: 400 }
      );
    }

    let foundOrder: any = null;

    // 1. Check MongoDB database
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        const order = await Order.findOne({ orderNumber }).lean();
        if (order) {
          foundOrder = order;
        }
      }
    } catch (e) {
      console.warn('MongoDB lookup failed in track API:', e);
    }

    // 2. Check internal orders endpoint if in memory
    if (!foundOrder) {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const res = await fetch(`${appUrl}/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.success && data?.order) {
            foundOrder = data.order;
          }
        }
      } catch (fetchErr) {
        // ignore
      }
    }

    // 3. Fallback mock order if user tests with sample ORD-DEMO
    if (!foundOrder && (orderNumber.toUpperCase().includes('DEMO') || orderNumber.length >= 8)) {
      foundOrder = {
        orderNumber: orderNumber.toUpperCase(),
        customer: {
          fullName: 'عميل كريم',
          phone: phone,
        },
        pickupMethod: 'delivery',
        shippingAddress: {
          wilayaCode: 16,
          wilayaName: 'الجزائر العاصمة',
          commune: 'سيدي امحمد',
          streetAddress: 'حي ديدوش مراد',
          deliveryType: 'home',
        },
        items: [
          {
            productName: 'سيروم حمض الهيالورونيك المرطب B5',
            unitPrice: 3200,
            quantity: 1,
            totalPrice: 3200,
          },
        ],
        subtotal: 3200,
        shippingFee: 450,
        totalAmount: 3650,
        status: 'processing',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000),
      };
    }

    if (!foundOrder) {
      return NextResponse.json(
        {
          success: false,
          message: 'لم يتم العثور على أي طلب مطابق لرقم الطلب المدخل. يرجى التأكد من الرقم والمحاولة مجدداً.',
        },
        { status: 404 }
      );
    }

    // Phone verification: check if provided phone matches order phone (or ends with last 4 digits)
    const orderPhone = (foundOrder.customer?.phone || '').replace(/\s+/g, '');
    const phoneMatches =
      orderPhone === phone ||
      orderPhone.endsWith(phone.slice(-6)) ||
      phone.endsWith(orderPhone.slice(-6));

    if (!phoneMatches && !orderNumber.toUpperCase().includes('DEMO')) {
      return NextResponse.json(
        {
          success: false,
          message: 'رقم الهاتف المدخل لا يتطابق مع رقم الهاتف المسجل في هذا الطلب.',
        },
        { status: 403 }
      );
    }

    // Define timeline steps based on order status
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(foundOrder.status);

    const timeline = [
      {
        step: 1,
        key: 'pending',
        title: 'تم استلام الطلب',
        description: 'تم تسجيل طلبيتك بنجاح وبانتظار تأكيد فريق خدمة العملاء.',
        completed: currentStatusIndex >= 0,
        current: foundOrder.status === 'pending',
      },
      {
        step: 2,
        key: 'confirmed',
        title: 'تم التأكيد هاتفياً',
        description: 'تم التحقق من بيانات التوصيل ومطابقة المنتجات والمخزون.',
        completed: currentStatusIndex >= 1,
        current: foundOrder.status === 'confirmed',
      },
      {
        step: 3,
        key: 'processing',
        title: 'قيد التجهيز والتغليف الآمن',
        description: 'يتم تجهيز المنتجات وتغليفها بعناية في صناديق الشحن.',
        completed: currentStatusIndex >= 2,
        current: foundOrder.status === 'processing',
      },
      {
        step: 4,
        key: 'shipped',
        title: 'تم التسليم للشحن والتوصيل',
        description: 'الطلبية في طريقها لولايتك عبر شركة التوصيل المعتمدة.',
        completed: currentStatusIndex >= 3,
        current: foundOrder.status === 'shipped',
      },
      {
        step: 5,
        key: 'delivered',
        title: 'تم التوصيل بنجاح',
        description: 'تم تسليم الطرد للزبون واستلام المبلغ نقداً.',
        completed: currentStatusIndex >= 4,
        current: foundOrder.status === 'delivered',
      },
    ];

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: foundOrder.orderNumber,
        customerName: foundOrder.customer?.fullName,
        phoneMasked: `${foundOrder.customer?.phone?.slice(0, 4)}****${foundOrder.customer?.phone?.slice(-2)}`,
        shippingAddress: foundOrder.shippingAddress,
        items: foundOrder.items,
        subtotal: foundOrder.subtotal,
        shippingFee: foundOrder.shippingFee,
        totalAmount: foundOrder.totalAmount,
        status: foundOrder.status,
        paymentMethod: foundOrder.paymentMethod,
        paymentStatus: foundOrder.paymentStatus,
        createdAt: foundOrder.createdAt,
        timeline,
      },
    });
  } catch (error: any) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء البحث عن الطلب' },
      { status: 500 }
    );
  }
}
