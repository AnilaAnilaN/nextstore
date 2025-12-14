import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();

  try {
    const menCount = await Product.countDocuments({ category: 'men' });
    const womenCount = await Product.countDocuments({ category: 'women' });
    const childrenCount = await Product.countDocuments({ category: 'children' });

    return NextResponse.json({
      success: true,
      data: {
        men: menCount,
        women: womenCount,
        children: childrenCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching category counts',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
