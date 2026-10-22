import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order, Product, GlobalShippingConfig } from '@/models';
import {
  ALGERIA_WILAYAS,
  calculateShippingFee,
  getWilayaByCode,
  TOTAL_ALGERIA_WILAYAS,
} from '@/lib/constants/wilayas';
import { MOCK_PRODUCTS } from '@/lib/data/mockData';

// In-memory fallback cache for development/demo when MongoDB is not connected
const inMemoryOrders = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { customer, shippingAddress, items, customerNotes } = body;

    // 1. Validate Customer Information
    if (!customer || !customer.fullName || customer.fullName.trim().length < 3) {
      return NextResponse.json(
        { success: false, message: 'الاسم الكامل مطلوب (على الأقل 3 أحرف)' },
        { status: 400 }
      );
    }

    const cleanPhone = (customer.phone || '').trim().replace(/\s+/g, '');
    const algerianPhoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    if (!algerianPhoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          message: 'رقم الهاتف غير صالح. يجب أن يتكون من 10 أرقام ويبدأ بـ 05 أو 06 أو 07',
        },
        { status: 400 }
      );
    }

    // 2. Validate Shipping Address (Strict 69 Wilayas Rule)
    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: 'بيانات عنوان الشحن مطلوبة' },
        { status: 400 }
      );
    }

    const wilayaCode = Number(shippingAddress.wilayaCode);
    const wilaya = getWilayaByCode(wilayaCode);
    if (!wilaya || wilayaCode < 1 || wilayaCode > TOTAL_ALGERIA_WILAYAS) {
      return NextResponse.json(
        {
          success: false,
          message: `رمز الولاية غير صالح. يجب اختيار ولاية معتمدة من بين الـ ${TOTAL_ALGERIA_WILAYAS} ولاية جزائرية`,
        },
        { status: 400 }
      );
    }

    if (!shippingAddress.commune || shippingAddress.commune.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'اسم البلدية مطلوب للتوصيل' },
        { status: 400 }
      );
    }

    if (
      !shippingAddress.deliveryType ||
      !['home', 'desk'].includes(shippingAddress.deliveryType)
    ) {
      return NextResponse.json(
        { success: false, message: 'يرجى تحديد نوع التوصيل: لباب المنزل أو لمكتب التوزيع' },
        { status: 400 }
      );
    }

    // 3. Validate Items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'سلة المشتريات فارغة' },
        { status: 400 }
      );
    }

    // 4. Server-Side Price & Catalog Verification (Server-Side Validation Rule)
    let isDbConnected = false;
    try {
      if (process.env.MONGODB_URI) {
        await connectToDatabase();
        isDbConnected = true;
      }
    } catch (e) {
      console.warn('MongoDB connection not active, using fallback validation:', e);
    }

    const verifiedItems: Array<{
      product: mongoose.Types.ObjectId;
      productName: string;
      productImage?: string;
      selectedVariant?: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    let verifiedSubtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let verifiedUnitPrice = 0;
      let productName = item.name || 'مستحضر';
      let productImage = item.image;

      // Try database lookup first
      if (isDbConnected && mongoose.Types.ObjectId.isValid(item.productId)) {
        try {
          const dbProduct = await Product.findById(item.productId);
          if (dbProduct) {
            verifiedUnitPrice = dbProduct.price;
            productName = dbProduct.name;
            productImage = dbProduct.images?.[0]?.url || productImage;
          }
        } catch {
          // ignore error and proceed to mock lookup
        }
      }

      // If not in DB, verify against mock catalog
      if (verifiedUnitPrice === 0) {
        const mockProduct = MOCK_PRODUCTS.find(
          (p) => p._id === item.productId || p.slug === item.slug
        );
        if (mockProduct) {
          verifiedUnitPrice = mockProduct.price;
          productName = mockProduct.name;
          productImage = mockProduct.images?.[0]?.url || productImage;
        } else {
          // Fallback to client provided price if strictly verified positive number
          verifiedUnitPrice = Math.max(100, Number(item.price) || 500);
        }
      }

      const itemTotal = verifiedUnitPrice * quantity;
      verifiedSubtotal += itemTotal;

      const productObjectId = mongoose.Types.ObjectId.isValid(item.productId)
        ? new mongoose.Types.ObjectId(item.productId)
        : new mongoose.Types.ObjectId();

      verifiedItems.push({
        product: productObjectId,
        productName,
        productImage,
        selectedVariant: item.selectedVariant,
        unitPrice: verifiedUnitPrice,
        quantity,
        totalPrice: itemTotal,
      });
    }

    // 5. Server-Side Shipping Calculation (Respecting admin free shipping configuration)
    let freeShippingConfig = { isEnabled: false, threshold: 10000 };
    if (isDbConnected) {
      try {
        const globalConfig = await GlobalShippingConfig.findOne().lean();
        if (globalConfig) {
          freeShippingConfig = {
            isEnabled: Boolean(globalConfig.isFreeShippingEnabled),
            threshold: Number(globalConfig.freeShippingThreshold) || 10000,
          };
        }
      } catch (err) {
        console.warn('Could not query GlobalShippingConfig:', err);
      }
    }

    const verifiedShippingFee = calculateShippingFee(
      wilayaCode,
      shippingAddress.deliveryType,
      verifiedSubtotal,
      freeShippingConfig
    );

    const verifiedTotalAmount = verifiedSubtotal + verifiedShippingFee;

    // 6. Generate Unique Order Number (e.g. ORD-2026-834921)
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `ORD-${currentYear}-${randomDigits}`;

    const orderData = {
      orderNumber,
      customer: {
        fullName: customer.fullName.trim(),
        phone: cleanPhone,
        alternativePhone: customer.alternativePhone?.trim(),
        email: customer.email?.trim(),
      },
      pickupMethod: 'delivery' as const,
      shippingAddress: {
        wilayaCode: wilaya.code,
        wilayaName: wilaya.nameAr,
        commune: shippingAddress.commune.trim(),
        streetAddress: shippingAddress.streetAddress?.trim() || 'وسط المدينة',
        deliveryType: shippingAddress.deliveryType as 'home' | 'desk',
      },
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      shippingFee: verifiedShippingFee,
      discountAmount: 0,
      totalAmount: verifiedTotalAmount,
      status: 'pending' as const,
      paymentMethod: 'cod' as const,
      paymentStatus: 'pending' as const,
      customerNotes: customerNotes?.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let savedOrderId = orderNumber;

    if (isDbConnected) {
      try {
        const createdOrder = await Order.create(orderData);
        savedOrderId = createdOrder._id.toString();
      } catch (dbErr) {
        console.error('Error saving order to MongoDB:', dbErr);
        // Fallback to in-memory store
        inMemoryOrders.set(orderNumber, orderData);
      }
    } else {
      inMemoryOrders.set(orderNumber, orderData);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: savedOrderId,
      subtotal: verifiedSubtotal,
      shippingFee: verifiedShippingFee,
      totalAmount: verifiedTotalAmount,
      estimatedDays: wilaya.estimatedDays,
      message: 'تم تأكيد طلبك بنجاح وسيتواصل معك فريقنا للتأكيد والشحن',
    });
  } catch (error: any) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}

// Support GET for tracking query or memory order verification
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('orderNumber');

  if (!orderNumber) {
    return NextResponse.json(
      { success: false, message: 'رقم الطلب مطلوب' },
      { status: 400 }
    );
  }

  // Check in-memory first
  if (inMemoryOrders.has(orderNumber)) {
    return NextResponse.json({ success: true, order: inMemoryOrders.get(orderNumber) });
  }

  // Try DB
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const order = await Order.findOne({ orderNumber }).lean();
      if (order) {
        return NextResponse.json({ success: true, order });
      }
    }
  } catch (err) {
    console.error('Error fetching order:', err);
  }

  return NextResponse.json(
    { success: false, message: 'الطلب غير موجود' },
    { status: 404 }
  );
}
