import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        const comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return NextResponse.json(
                { success: false, error: 'Comment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
