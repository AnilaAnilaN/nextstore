"use client";

import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Minus, Plus, X } from "lucide-react";
import { CartContext } from "@/context/CartContext";

export default function CartPage() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    isLoading,
  } = cartContext;

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={[{ label: "Cart" }]} />
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your cart...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: "Cart" }]} />
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/shop"
                className="bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Cart" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border border-gray-200">
                  <th className="p-6 text-center border border-gray-200">
                    Image
                  </th>
                  <th className="p-6 text-center border border-gray-200">
                    Product
                  </th>
                  <th className="p-6 text-center border border-gray-200">
                    Price
                  </th>
                  <th className="p-6 text-center border border-gray-200">
                    Quantity
                  </th>
                  <th className="p-6 text-center border border-gray-200">
                    Total
                  </th>
                  <th className="p-6 text-center border border-gray-200">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-t-2 border-primary">
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
                    <td className="p-5 text-center text-gray-900">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          className="px-3 py-1 border border-primary rounded hover:bg-primary hover:text-white transition-colors"
                          disabled={item.quantity <= 1}
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
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="px-3 py-1 border border-primary rounded hover:bg-primary hover:text-white transition-colors"
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
                        onClick={() => removeFromCart(item._id)}
                        className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-hover transition-colors"
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
                <Link
                  href="/shop"
                  className="py-3 px-6 rounded-sm uppercase tracking-[0.05em] transition-colors duration-200 border border-primary text-primary hover:bg-primary hover:text-white flex-1 text-center"
                >
                  Continue Shopping
                </Link>
              </div>

              <div>
                <label className="block text-gray-900 text-xl mb-2">
                  Coupon
                </label>
                <p className="text-gray-600 mb-4">
                  Enter your coupon code if you have one.
                </p>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                  />
                  <button className="bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5">
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full max-w-md">
                <div className="border-b border-gray-300 pb-4 mb-4">
                  <h3 className="text-xl uppercase text-gray-900 text-right">
                    Cart Totals
                  </h3>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-900">Subtotal</span>
                  <strong className="text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </strong>
                </div>
                <div className="flex justify-between mb-8">
                  <span className="text-gray-900">Total</span>
                  <strong className="text-gray-900 text-xl">
                    ${cartTotal.toFixed(2)}
                  </strong>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-white text-center py-4 rounded uppercase tracking-wider hover:bg-primary-hover transition"
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