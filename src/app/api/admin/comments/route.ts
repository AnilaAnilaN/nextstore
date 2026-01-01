import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

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

        const comments = await Comment.find()
            .populate('user', 'firstName lastName email')
            .populate('blog', 'title slug')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: comments,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
