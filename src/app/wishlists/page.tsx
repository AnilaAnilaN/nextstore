"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

export default function WishlistsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load wishlist');
      setItems(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (id: string) => {
    try {
      const res = await fetch(`/api/wishlist?productId=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove');
      setItems(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to remove item');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-12">Loading wishlist...</div>;

  if (error) return <div className="container mx-auto px-4 py-12 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-medium mb-6">Your Wishlist</h1>

      {items.length === 0 && <p>Your wishlist is empty.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p._id} className="border rounded p-4">
            <img src={p.image && p.image.trim() !== '' ? p.image : '/images/hero_1.png'} alt={p.name} className="h-40 w-full object-cover rounded mb-3" />
            <h3 className="font-medium">{p.name}</h3>
            <p className="text-gray-600">${p.price}</p>
            <div className="mt-3 flex space-x-2">
              <button onClick={() => router.push(`/shop/${p._id}`)} className="px-3 py-2 border rounded">View</button>
              <button onClick={() => handleRemove(p._id)} className="px-3 py-2 bg-red-50 text-red-600 rounded">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
