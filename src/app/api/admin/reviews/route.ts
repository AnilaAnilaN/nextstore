import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const role = (session?.user as any)?.role;

        if (!session?.user || (role !== 'admin' && role !== 'super-admin')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();

        const reviews = await Review.find()
            .populate('user', 'firstName lastName email')
            .populate('product', 'name')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: reviews,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
