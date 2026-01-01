import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    const session = await getServerSession(authOptions);

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (orderNumber) {
      query.orderNumber = orderNumber;
      // If orderNumber is provided, we allow fetching without session for the thank you page
      // To improve security, we could also require email in searchParams and verify it
    } else {
      // If not admin, only show user's orders
      const role = (session?.user as any)?.role;
      if (!session?.user || (role !== 'admin' && role !== 'super-admin')) {
        if (!session?.user?.email) {
          return NextResponse.json({ success: true, data: [] });
        }
        query['customer.email'] = session.user.email;
      } else if (email) {
        query['customer.email'] = email;
      }
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('items.product');

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const body = await request.json();
    const { items, customer, shippingAddress, paymentMethod, subtotal, total, notes } = body;

    // Basic validation
    if (!items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Order must contain items' }, { status: 400 });
    }

    // Link to user if logged in
    const orderData: any = {
      ...body,
      user: session?.user ? (session.user as any).id : undefined,
    };

    // Use a transaction if possible, but for simplicity let's do it sequentially
    // First, verify stock and decrement
    const Product = (await import('@/models/Product')).default;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create(orderData);

    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
