import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

// GET all users with their wishlists (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Check if user is authenticated and is admin
    if (!session?.user || (role !== 'admin' && role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // Fetch all users with their wishlists populated
    const users = await User.find()
      .select('firstName lastName email wishlist')
      .populate({
        path: 'wishlist',
        select: 'name price image',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
