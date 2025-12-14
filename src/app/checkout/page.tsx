"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "United States",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    email: "",
    phone: "",
    createAccount: false,
    shipDifferent: false,
    orderNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      },
      items: [
        { product: "60d5ecb8d7d4f40015ca7b5a", quantity: 1 }, // Example product ID
        { product: "60d5ecb8d7d4f40015ca7b5b", quantity: 1 }, // Example product ID
      ],
      total: cartTotal,
      notes: formData.orderNotes,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      window.location.href = "/thankyou";
    } catch (error) {
      console.error(error);
    }
  };

  const cartTotal = 98.0; // Example total

  return (
    <>
      <Breadcrumb items={[{ label: "Checkout" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Billing Details */}
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-6">
                  Billing Details
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-900 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-900 mb-2">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number and street name"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-900 mb-2">
                      Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 mb-2">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="createAccount"
                        checked={formData.createAccount}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-gray-900">Create an account?</span>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="shipDifferent"
                        checked={formData.shipDifferent}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-gray-900">
                        Ship to a different address?
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-900 mb-2">
                      Order Notes
                    </label>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write your notes here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h2 className="text-2xl font-medium text-gray-900 mb-6">
                  Your Order
                </h2>

                <div className="border border-gray-200 rounded p-6">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-900 font-medium">Product</span>
                      <span className="text-gray-900 font-medium">Total</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Up T-Shirt × 1</span>
                      <span className="text-gray-900">$49.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Polo Shirt × 1</span>
                      <span className="text-gray-900">$49.00</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-900">Subtotal</span>
                      <span className="text-gray-900">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-900 font-medium">Total</span>
                      <strong className="text-gray-900 text-xl">
                        ${cartTotal.toFixed(2)}
                      </strong>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <h3 className="text-gray-900 font-medium mb-4">
                      Payment Method
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="bank"
                          className="mr-2"
                          defaultChecked
                        />
                        <span className="text-gray-900">
                          Direct Bank Transfer
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="check"
                          className="mr-2"
                        />
                        <span className="text-gray-900">Check Payment</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value="paypal"
                          className="mr-2"
                        />
                        <span className="text-gray-900">PayPal</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded uppercase tracking-wider hover:bg-primary-hover transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
