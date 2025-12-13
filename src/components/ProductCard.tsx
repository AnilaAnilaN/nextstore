import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-lg transition-shadow">
      <Link href={`/shop/${product._id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-[#7971ea] font-bold text-lg">${product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;