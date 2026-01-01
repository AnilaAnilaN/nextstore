import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import PageContent from '@/models/PageContent';

// GET content by key
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        await connectDB();
        const { key } = await params;
        const content = await PageContent.findOne({ key });

        return NextResponse.json({
            success: true,
            data: content,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// POST/PUT update content
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const role = (session?.user as any)?.role;
        if (!session || (role !== 'admin' && role !== 'super-admin')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { key } = await params;
        const body = await request.json();
        const { content } = body;

        const updatedContent = await PageContent.findOneAndUpdate(
            { key },
            { key, content },
            { upsert: true, new: true }
        );

        return NextResponse.json({
            success: true,
            data: updatedContent,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
