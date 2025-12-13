import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// GET all orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (email) {
      query['customer.email'] = email;
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
    
    const body = await request.json();
    
    const order = await Order.create(body);
    
    return NextResponse.json({
      success: true,
      data: order,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}