'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { Minus, Plus, X } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: 1, name: 'Top Up T-Shirt', price: 49.00, quantity: 1, image: '/images/cloth_1.jpg' },
    { id: 2, name: 'Polo Shirt', price: 49.00, quantity: 1, image: '/images/cloth_2.jpg' },
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Breadcrumb items={[{ label: 'Cart' }]} />

      <section className="site-section">
        <div className="container">
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border border-gray-200">
                  <th className="p-6 text-center border border-gray-200">Image</th>
                  <th className="p-6 text-center border border-gray-200">Product</th>
                  <th className="p-6 text-center border border-gray-200">Price</th>
                  <th className="p-6 text-center border border-gray-200">Quantity</th>
                  <th className="p-6 text-center border border-gray-200">Total</th>
                  <th className="p-6 text-center border border-gray-200">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t-2 border-[#7971ea]">
                    <td className="p-5 text-center">
                      <div className="relative w-32 h-32 mx-auto">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          fill 
                          sizes="128px"
                          className="object-cover" 
                        />
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <h2 className="text-lg text-gray-900">{item.name}</h2>
                    </td>
                    <td className="p-5 text-center text-gray-900">${item.price.toFixed(2)}</td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1 border border-[#7971ea] rounded hover:bg-[#7971ea] hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          className="w-16 text-center border border-gray-300 rounded py-1"
                          readOnly
                        />
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1 border border-[#7971ea] rounded hover:bg-[#7971ea] hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="p-5 text-center text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="p-5 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-[#7971ea] text-white px-3 py-1 rounded hover:bg-[#5a50e5]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex space-x-4 mb-6">
                <button className="btn-primary flex-1">Update Cart</button>
                <Link href="/shop" className="btn-outline-primary flex-1 text-center">
                  Continue Shopping
                </Link>
              </div>

              <div>
                <label className="block text-gray-900 text-xl mb-2">Coupon</label>
                <p className="text-gray-600 mb-4">Enter your coupon code if you have one.</p>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                  />
                  <button className="btn-primary">Apply Coupon</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="border-b border-gray-300 pb-4 mb-4">
                  <h3 className="text-xl uppercase text-gray-900 text-right">Cart Totals</h3>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-900">Subtotal</span>
                  <strong className="text-gray-900">${subtotal.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between mb-8">
                  <span className="text-gray-900">Total</span>
                  <strong className="text-gray-900">${subtotal.toFixed(2)}</strong>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-[#7971ea] text-white text-center py-4 rounded uppercase tracking-wider hover:bg-[#5a50e5] transition"
                >
                  Proceed To Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}