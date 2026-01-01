import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

// GET all contact messages
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    const messages = await Contact.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create contact message
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const message = await Contact.create(body);
    
    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message sent successfully',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
