import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PageContent from '@/models/PageContent';

export async function GET(
    request: NextRequest,
    { params }: { params: { key: string } }
) {
    try {
        await connectDB();
        const { key } = await params;
        const content = await PageContent.findOne({ key });

        if (!content) {
            return NextResponse.json({
                success: false,
                error: 'Content not found',
            }, { status: 404 });
        }

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
