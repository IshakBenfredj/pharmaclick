import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models';

// Fallback in-memory store for development/demo
let inMemoryOrdersList: any[] = [
  {
    _id: 'ord_1',
    orderNumber: 'ORD-2026-948123',
    customer: {
      fullName: 'أحمد بن علي',
      phone: '0550123456',
      alternativePhone: '0770987654',
    },
    shippingAddress: {
      wilayaName: 'الجزائر العاصمة',
      wilayaCode: 16,
      commune: 'دالي إبراهيم',
      streetAddress: 'حي 500 مسكن، عمارة 4، شقة 12',
      deliveryType: 'home',
    },
    subtotal: 11800,
    shippingFee: 600,
    totalAmount: 12400,
    status: 'pending',
    createdAt: new Date().toISOString(),
    customerNotes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
    items: [
      { productName: 'سيروم حمض الهيالورونيك المرطب Hyalu B5', selectedVariant: '30 مل', quantity: 2, unitPrice: 3800 },
      { productName: 'جل منظف للبشرة الدهنية Effaclar Purifying', selectedVariant: '200 مل', quantity: 1, unitPrice: 4200 },
    ],
  },
  {
    _id: 'ord_2',
    orderNumber: 'ORD-2026-948122',
    customer: {
      fullName: 'فاطمة الزهراء قاسمي',
      phone: '0661987654',
    },
    shippingAddress: {
      wilayaName: 'وهران',
      wilayaCode: 31,
      commune: 'وهران وسط',
      deliveryType: 'desk',
    },
    subtotal: 7200,
    shippingFee: 400,
    totalAmount: 7600,
    status: 'processing',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    items: [
      { productName: 'كريم مهدئ ومصلح للبشرة Cicaplast Baume B5+', selectedVariant: '40 مل', quantity: 3, unitPrice: 2400 },
    ],
  },
  {
    _id: 'ord_3',
    orderNumber: 'ORD-2026-948121',
    customer: {
      fullName: 'محمد لمين بوزيد',
      phone: '0772345678',
    },
    shippingAddress: {
      wilayaName: 'قسنطينة',
      wilayaCode: 25,
      commune: 'الخروب',
      streetAddress: 'حي الزيادية فيلا 18',
      deliveryType: 'home',
    },
    subtotal: 17600,
    shippingFee: 600,
    totalAmount: 18200,
    status: 'shipped',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    items: [
      { productName: 'واقي شمس سائل حماية قصوى Oil Control SPF50+', selectedVariant: '50 مل', quantity: 2, unitPrice: 2950 },
      { productName: 'جهاز قياس نسبة السكر الفوري Accu-Chek', selectedVariant: 'طقم متكامل', quantity: 1, unitPrice: 4900 },
      { productName: 'سيروم فيتامين سي النقي C10', selectedVariant: '30 مل', quantity: 1, unitPrice: 6800 },
    ],
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const count = await Order.countDocuments();
      if (count === 0) {
        // Seed default orders to DB
        for (const o of inMemoryOrdersList) {
          await Order.create({
            orderNumber: o.orderNumber,
            customer: o.customer,
            pickupMethod: 'delivery',
            shippingAddress: o.shippingAddress,
            subtotal: o.subtotal,
            shippingFee: o.shippingFee,
            totalAmount: o.totalAmount,
            status: o.status,
            customerNotes: o.customerNotes,
            items: (o.items || []).map((it: any) => ({
              product: new mongoose.Types.ObjectId(),
              productName: it.productName,
              selectedVariant: it.selectedVariant,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              totalPrice: it.unitPrice * it.quantity,
            })),
          });
        }
      }

      const query: Record<string, any> = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'customer.fullName': { $regex: search, $options: 'i' } },
          { 'customer.phone': { $regex: search, $options: 'i' } },
          { 'shippingAddress.wilayaName': { $regex: search, $options: 'i' } },
        ];
      }

      const dbOrders = await Order.find(query).sort({ createdAt: -1 }).lean();

      return NextResponse.json({
        success: true,
        orders: dbOrders.map((o) => ({
          id: o._id.toString(),
          orderNumber: o.orderNumber,
          customerName: o.customer?.fullName || 'زبون',
          phone: o.customer?.phone || '',
          altPhone: o.customer?.alternativePhone || '',
          wilaya: o.shippingAddress?.wilayaName || '',
          wilayaCode: o.shippingAddress?.wilayaCode || 16,
          commune: o.shippingAddress?.commune || '',
          streetAddress: o.shippingAddress?.streetAddress || '',
          deliveryType: o.shippingAddress?.deliveryType || 'home',
          subtotal: o.subtotal,
          shippingFee: o.shippingFee,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
          notes: o.customerNotes || '',
          items: (o.items || []).map((it: any) => ({
            name: it.productName,
            variant: it.selectedVariant || '',
            quantity: it.quantity,
            price: it.unitPrice,
          })),
        })),
      });
    }
  } catch (err) {
    console.warn('MongoDB orders query error, falling back to in-memory list:', err);
  }

  // Memory fallback
  return NextResponse.json({
    success: true,
    orders: inMemoryOrdersList.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      customerName: o.customer?.fullName,
      phone: o.customer?.phone,
      altPhone: o.customer?.alternativePhone,
      wilaya: o.shippingAddress?.wilayaName,
      wilayaCode: o.shippingAddress?.wilayaCode,
      commune: o.shippingAddress?.commune,
      streetAddress: o.shippingAddress?.streetAddress,
      deliveryType: o.shippingAddress?.deliveryType,
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
      notes: o.customerNotes,
      items: (o.items || []).map((it: any) => ({
        name: it.productName,
        variant: it.selectedVariant,
        quantity: it.quantity,
        price: it.unitPrice,
      })),
    })),
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, notes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'معرف الطلب مطلوب' }, { status: 400 });
    }

    if (process.env.MONGODB_URI) {
      try {
        await connectToDatabase();
        const updateData: Record<string, any> = {};
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.adminNotes = notes;

        let updated = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
          updated = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
        } else {
          updated = await Order.findOneAndUpdate({ orderNumber: orderId }, updateData, { new: true });
        }

        if (updated) {
          return NextResponse.json({
            success: true,
            message: 'تم تحديث حالة الطلب بنجاح في قاعدة البيانات',
            order: updated,
          });
        }
      } catch (dbErr) {
        console.warn('MongoDB order status update error:', dbErr);
      }
    }

    // Memory update
    const found = inMemoryOrdersList.find((o) => o._id === orderId || o.orderNumber === orderId);
    if (found) {
      if (status) found.status = status;
      if (notes !== undefined) found.adminNotes = notes;
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
