import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import imagekit from '@/lib/imagekit';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET single blog by slug or ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await context.params;
    await connectDB();

    // Try to find by slug first, then by ID
    let blog = await Blog.findOne({ slug: params.slug });

    if (!blog) {
      blog = await Blog.findById(params.slug);
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== 'admin' && role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const params = await context.params;
    await connectDB();

    const body = await request.json();

    // Find by slug or ID
    let blog = await Blog.findOne({ slug: params.slug });
    if (!blog) {
      blog = await Blog.findById(params.slug);
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Update blog
    Object.assign(blog, body);
    await blog.save();

    return NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE blog
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== 'admin' && role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const params = await context.params;
    await connectDB();

    // Find by slug or ID
    let blog = await Blog.findOne({ slug: params.slug });
    if (!blog) {
      blog = await Blog.findById(params.slug);
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete image from ImageKit if imageId exists
    if (blog.imageId) {
      try {
        await imagekit.deleteFile(blog.imageId);
      } catch (error) {
        console.error('Error deleting image from ImageKit:', error);
      }
    }

    await blog.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}