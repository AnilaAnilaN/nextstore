import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import imagekit from '@/lib/imagekit';

// GET single product

export async function GET(

  request: NextRequest,

  context: { params: Promise<{ id: string }> }

) {

  try {

    const params = await context.params;

    await connectDB();



    if (!mongoose.Types.ObjectId.isValid(params.id)) {

      return NextResponse.json(

        { success: false, error: 'Invalid product ID format' },

        { status: 400 }

      );

    }

    

    const product = await Product.findById(params.id);

    

    if (!product) {

      return NextResponse.json(

        { success: false, error: 'Product not found' },

        { status: 404 }

      );

    }



    return NextResponse.json({

      success: true,

      data: product,

    });

    

  } catch (error: unknown) {

    console.error('Error fetching product:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

    return NextResponse.json(

      { success: false, error: errorMessage },

      { status: 500 }

    );

  }

}



// PUT update product

export async function PUT(

  request: NextRequest,

  context: { params: Promise<{ id: string }> }

) {

  try {

    const params = await context.params;

    await connectDB();

    

    const body = await request.json();

    

    const product = await Product.findByIdAndUpdate(

      params.id,

      body,

      { new: true, runValidators: true }

    );

    

    if (!product) {

      return NextResponse.json(

        { success: false, error: 'Product not found' },

        { status: 404 }

      );

    }

    

    return NextResponse.json({

      success: true,

      data: product,

    });

  } catch (error: any) {

    return NextResponse.json(

      { success: false, error: error.message },

      { status: 400 }

    );

  }

}



// DELETE product

export async function DELETE(

  request: NextRequest,

  context: { params: Promise<{ id: string }> }

) {

  try {

    const params = await context.params;

    await connectDB();

    

    const product = await Product.findById(params.id);

    

    if (!product) {

      return NextResponse.json(

        { success: false, error: 'Product not found' },

        { status: 404 }

      );

    }

    

    // Delete image from ImageKit if imageId exists

    if (product.imageId) {

      try {

        await imagekit.deleteFile(product.imageId);

      } catch (error) {

        console.error('Error deleting image from ImageKit:', error);

      }

    }

    

    await product.deleteOne();

    

    return NextResponse.json({

      success: true,

      message: 'Product deleted successfully',

    });

  } catch (error: any) {

    return NextResponse.json(

      { success: false, error: error.message },

      { status: 500 }

    );

  }

}