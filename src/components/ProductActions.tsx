"use client";

import { useState, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { CartContext } from '@/context/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductActions({ product }: Props) {
  const cartContext = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  if (!cartContext) return null;
  const { addToCart } = cartContext;

  useEffect(() => {
    // Optionally fetch wishlist to set initial state in the future
  }, [product._id, session]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowMessage('Added to cart!');
    setTimeout(() => setShowMessage(null), 2000);
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist?productId=${product._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsInWishlist(false);
          setShowMessage('Removed from wishlist');
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product._id }),
        });

        if (response.ok) {
          setIsInWishlist(true);
          setShowMessage('Added to wishlist');
        } else {
          const data = await response.json();
          setShowMessage(data.error || 'Failed to update wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      setShowMessage('Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
      setTimeout(() => setShowMessage(null), 2000);
    }
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {showMessage && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-primary text-white text-sm py-2 px-4 rounded shadow-lg text-center">
          {showMessage}
        </div>
      )}

      <button
        onClick={handleWishlistToggle}
        disabled={isAddingToWishlist}
        className={`p-2 rounded-full shadow-md transition-colors ${
          isInWishlist ? 'bg-primary text-white' : 'bg-white hover:bg-gray-100'
        }`}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : 'text-gray-600'}`} />
      </button>

      <button onClick={handleAddToCart} className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors" aria-label="Add to cart">
        <ShoppingCart className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
