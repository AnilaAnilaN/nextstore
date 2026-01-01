import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// In-memory cart storage for non-authenticated users (session-based)
const sessionCarts = new Map<string, any[]>();

// GET cart items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart-session')?.value || generateSessionId();

    let cartItems: any[] = [];

    if (session?.user) {
      // Fetch cart from database for authenticated users
      // TODO: Implement database cart storage
      cartItems = sessionCarts.get((session.user as any).id) || [];
    } else {
      // Get cart from session storage for guest users
      cartItems = sessionCarts.get(sessionId) || [];
    }

    return NextResponse.json({
      success: true,
      data: cartItems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST/UPDATE cart items
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items } = body;

    const sessionId = request.cookies.get('cart-session')?.value || generateSessionId();

    if (session?.user) {
      // Save to database for authenticated users
      sessionCarts.set((session.user as any).id, items);
    } else {
      // Save to session storage for guest users
      sessionCarts.set(sessionId, items);
    }

    const response = NextResponse.json({
      success: true,
      data: items,
    });

    // Set session cookie for guest users
    if (!session?.user) {
      response.cookies.set('cart-session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE cart (clear all items)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = request.cookies.get('cart-session')?.value;

    if (session?.user) {
      sessionCarts.delete((session.user as any).id);
    } else if (sessionId) {
      sessionCarts.delete(sessionId);
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
