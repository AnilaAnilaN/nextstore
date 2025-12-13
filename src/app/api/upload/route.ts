import { NextRequest, NextResponse } from 'next/server';
import imagekit from '@/lib/imagekit';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: base64,
      fileName: file.name,
      folder: '/products',
    });
    
    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Get ImageKit authentication parameters for client-side upload
export async function GET() {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    
    return NextResponse.json({
      success: true,
      data: authenticationParameters,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}