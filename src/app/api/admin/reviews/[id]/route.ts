import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        const role = (session?.user as any)?.role;

        if (!session?.user || (role !== 'admin' && role !== 'super-admin')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        await connectDB();

        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Review not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Review deleted successfully',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
