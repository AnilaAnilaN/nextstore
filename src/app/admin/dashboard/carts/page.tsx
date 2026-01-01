'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Search, DollarSign, TrendingUp, Users } from 'lucide-react';

interface CartSession {
  sessionId: string;
  userEmail?: string;
  items: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  lastUpdated: string;
}

export default function AdminCartsPage() {
  const [carts, setCarts] = useState<CartSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const response = await fetch('/api/admin/carts');
      const data = await response.json();
      
      if (data.success) {
        setCarts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCarts = carts.filter((cart) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cart.sessionId.toLowerCase().includes(searchLower) ||
      cart.userEmail?.toLowerCase().includes(searchLower) ||
      cart.items.some((item) => item.name.toLowerCase().includes(searchLower))
    );
  });

  const totalActiveCarts = carts.length;
  const totalCartValue = carts.reduce((sum, cart) => sum + cart.total, 0);
  const avgCartValue = totalActiveCarts > 0 ? totalCartValue / totalActiveCarts : 0;
  const totalItems = carts.reduce((sum, cart) => 
    sum + cart.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading active carts...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Active Carts</h1>
        <p className="text-gray-600 mt-2">Monitor customer shopping carts in real-time</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Active Carts</h3>
          <p className="text-2xl font-bold text-gray-900">{totalActiveCarts}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Cart Value</h3>
          <p className="text-2xl font-bold text-gray-900">${totalCartValue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Avg Cart Value</h3>
          <p className="text-2xl font-bold text-gray-900">${avgCartValue.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Items</h3>
          <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by session ID, email, or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Carts List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredCarts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active carts found</p>
            <p className="text-sm text-gray-400 mt-1">
              Carts will appear here when customers add items
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCarts.map((cart) => (
              <div key={cart.sessionId} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {cart.userEmail || 'Guest User'}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {cart.items.length} items
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Session: {cart.sessionId.substring(0, 16)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Last updated: {formatDate(cart.lastUpdated)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Cart Total</p>
                    <p className="text-2xl font-bold text-primary">
                      ${cart.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="relative h-32">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow-sm">
                          <span className="text-xs font-medium">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-500">
                            ${item.price} each
                          </p>
                          <p className="text-sm font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {carts.length > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <p className="font-medium">Cart Abandonment Opportunity</p>
              <p className="text-blue-600 mt-1">
                ${totalCartValue.toFixed(2)} potential revenue from {totalActiveCarts} active carts
              </p>
            </div>
            <div>
              <p className="font-medium">Conversion Tip</p>
              <p className="text-blue-600 mt-1">
                Send reminder emails to recover abandoned carts and boost sales
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}