'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductPage() {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

      <section className="site-section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="rounded"
              />
            </div>

            {/* Product Details */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-medium text-gray-900 mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">${product.price}</p>

              <div className="flex items-center mb-6">
                <label htmlFor="quantity" className="mr-4">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <button className="bg-[#7971ea] text-white px-8 py-3 rounded hover:bg-[#5f57c2] transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}