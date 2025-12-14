'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { Product } from '../types';
import { CartContext } from '@/context/CartContext';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { addToCart } = cartContext;

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm group">
      <div className="relative h-64 overflow-hidden">
        <Link href={`/shop/${product._id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              
            }}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => addToCart(product)}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link href={`/shop/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <p className="text-[#7971ea] font-bold text-lg">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;