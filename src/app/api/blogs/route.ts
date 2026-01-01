import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page') || '1';

    let query: any = {};

    // Only show published blogs on frontend by default
    if (published !== 'false') {
      query.published = true;
    }

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const pageNumber = parseInt(page);
    const limitNumber = limit ? parseInt(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limitNumber)
      .skip(skip);

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      success: true,
      count: blogs.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      data: blogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create blog (admin only)
export async function POST(request: NextRequest) {
  console.log('--- POST /api/blogs started ---');
  try {
    const session = await getServerSession(authOptions);
    console.log('Session retrieved:', !!session);

    if (session) {
      console.log('User role:', (session.user as any)?.role);
    }

    const role = (session?.user as any)?.role;

    if (!session || (role !== 'admin' && role !== 'super-admin')) {
      console.log('Unauthorized creating blog');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, content, and excerpt are required',
        },
        { status: 400 }
      );
    }

    const blog = await Blog.create(body);

    return NextResponse.json(
      {
        success: true,
        data: blog,
        message: 'Blog created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
