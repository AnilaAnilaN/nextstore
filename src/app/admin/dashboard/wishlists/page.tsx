'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Search, Users, Star } from 'lucide-react';

interface Wishlist {
  _id: string;
  userEmail: string;
  items: {
    _id: string;
    name: string;
    price: number;
    image: string;
  }[];
  createdAt: string;
}

export default function AdminWishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const response = await fetch('/api/admin/wishlists');
      const data = await response.json();
      
      if (data.success) {
        setWishlists(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWishlists = wishlists.filter((wishlist) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      wishlist.userEmail.toLowerCase().includes(searchLower) ||
      wishlist.items.some((item) => item.name.toLowerCase().includes(searchLower))
    );
  });

  const totalWishlists = wishlists.length;
  const totalItemsInWishlists = wishlists.reduce((sum, wishlist) => sum + wishlist.items.length, 0);
  const mostWishlistedItems = wishlists
    .flatMap(w => w.items)
    .reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

  const topItem = Object.entries(mostWishlistedItems).sort((a,b) => b[1] - a[1])[0];


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading wishlists...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customer Wishlists</h1>
        <p className="text-gray-600 mt-2">Track products customers are hoping for</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-red-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Wishlists</h3>
          <p className="text-2xl font-bold text-gray-900">{totalWishlists}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Total Items Saved</h3>
          <p className="text-2xl font-bold text-gray-900">{totalItemsInWishlists}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">Most Popular Item</h3>
          <p className="text-xl font-bold text-gray-900 truncate">{topItem ? `${topItem[0]} (${topItem[1]} saves)` : 'N/A'}</p>
        </div>
      </div>


      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user email or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Wishlists List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredWishlists.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No wishlists found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredWishlists.map((wishlist) => (
              <div key={wishlist._id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{wishlist.userEmail}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Created on {formatDate(wishlist.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                     <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        {wishlist.items.length} items
                      </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {wishlist.items.map((item) => (
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
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
