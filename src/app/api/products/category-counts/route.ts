import db from '@/lib/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET() {
  await db();

  try {
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: categoryCounts,
    });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server error while fetching category counts',
      },
      { status: 500 }
    );
  }
}
