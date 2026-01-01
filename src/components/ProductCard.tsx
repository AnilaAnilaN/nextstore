'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '../types';
import { CartContext } from '@/context/CartContext';
import ProductActions from './ProductActions';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cartContext = useContext(CartContext);
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);

  if (!cartContext) {
    return null;
  }

  const { addToCart } = cartContext;
  const router = useRouter();

  // Ensure we never pass an empty string to Next/Image; use a public fallback image
  const imageSrc = product.image && product.image.trim() !== '' ? product.image : '/images/hero_1.png';

  const handleAddToCart = () => {
    addToCart(product);
    setShowMessage('Added to cart!');
    setTimeout(() => setShowMessage(null), 2000);
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      // Redirect to login for unauthenticated users
      router.push('/login');
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${product._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsInWishlist(false);
          setShowMessage('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    <div className="bg-white border border-gray-200 rounded shadow-sm group relative">
      {showMessage && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-primary text-white text-sm py-2 px-4 rounded shadow-lg text-center">
          {showMessage}
        </div>
      )}

      <div className="relative h-64 overflow-hidden">
        <Link href={`/shop/${product._id}`}>
          <Image
            src={imageSrc}
            alt={product.name || 'Product image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        {/* Action buttons (moved to reusable component) */}
        <ProductActions product={product} />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link
            href={`/shop/${product._id}`}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-center space-x-2">
          <p className="text-primary font-bold text-lg">${product.price}</p>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs text-orange-600">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;