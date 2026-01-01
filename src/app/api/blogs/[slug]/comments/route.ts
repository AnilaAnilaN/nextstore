import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Comment from '@/models/Comment';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all comments for a blog post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        // Find the blog by slug or ID in a type-safe way
        let blog = null;

        // Try as ID first if it looks like one
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
            blog = await Blog.findById(slug);
        }

        // If not found by ID, try by slug
        if (!blog) {
            blog = await Blog.findOne({ slug: slug });
        }

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Blog not found' },
                { status: 404 }
            );
        }

        const comments = await Comment.find({ blog: blog._id })
            .populate('user', 'firstName lastName')
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

// POST a new comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        await connectDB();
        const { slug } = await params;
        const body = await request.json();

        if (!body.content) {
            return NextResponse.json(
                { success: false, error: 'Comment content is required' },
                { status: 400 }
            );
        }

        // Find the blog by slug or ID in a type-safe way
        let blog = null;

        // Try as ID first if it looks like one
        if (/^[0-9a-fA-F]{24}$/.test(slug)) {
            blog = await Blog.findById(slug);
        }

        // If not found by ID, try by slug
        if (!blog) {
            blog = await Blog.findOne({ slug: slug });
        }

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Blog not found' },
                { status: 404 }
            );
        }

        const comment = await Comment.create({
            content: body.content,
            blog: blog._id,
            user: (session.user as any).id,
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            'user',
            'firstName lastName'
        );

        return NextResponse.json({
            success: true,
            data: populatedComment,
            message: 'Comment posted successfully',
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
