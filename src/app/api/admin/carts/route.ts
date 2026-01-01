import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// This would ideally connect to a Redis or database store
// For now, we'll use the in-memory storage from the cart route
// In production, you'd want to persist this data

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartData {
  items: CartItem[];
  lastUpdated: string;
  userEmail?: string;
}

// Mock storage - replace with actual database/Redis in production
const mockCartStorage = new Map<string, CartData>();

// GET all active carts (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    // Check if user is authenticated and is admin
    if (!session?.user || (role !== 'admin' && role !== 'super-admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // In a real application, you would fetch from database/Redis
    // For now, return mock data structure
    const activeCarts = Array.from(mockCartStorage.entries()).map(([sessionId, data]) => {
      const total = data.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        sessionId,
        userEmail: data.userEmail,
        items: data.items,
        total,
        lastUpdated: data.lastUpdated,
      };
    });

    // Filter out empty carts
    const nonEmptyCarts = activeCarts.filter((cart) => cart.items.length > 0);

    return NextResponse.json({
      success: true,
      data: nonEmptyCarts,
      count: nonEmptyCarts.length,
      message: 'Note: This shows carts from current server session. In production, use Redis/Database for persistent cart storage.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to add cart to mock storage (called from cart API)
export function addToAdminCartMonitoring(
  sessionId: string,
  items: CartItem[],
  userEmail?: string
) {
  mockCartStorage.set(sessionId, {
    items,
    lastUpdated: new Date().toISOString(),
    userEmail,
  });

  // Clean up old carts (older than 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, data] of mockCartStorage.entries()) {
    if (new Date(data.lastUpdated).getTime() < oneDayAgo) {
      mockCartStorage.delete(id);
    }
  }
}
