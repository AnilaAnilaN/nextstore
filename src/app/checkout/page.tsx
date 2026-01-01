"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Breadcrumb from "@/components/Breadcrumb";
import { CartContext } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const cartContext = useContext(CartContext);

  const { data: session } = useSession();

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
    password: "",
    createAccount: false,
    shipDifferent: false,
    orderNotes: "",
    paymentMethod: "bank",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      // Split name if possible
      const nameParts = session.user.name?.split(' ') || ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || nameParts[0] || "",
        lastName: prev.lastName || nameParts[1] || "",
        email: prev.email || session.user?.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    // Redirect if cart is empty
    if (cartContext && !cartContext.isLoading && cartContext.cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartContext, router]);

  if (!cartContext) {
    return null;
  }

  const { cartItems, cartTotal, clearCart, isLoading } = cartContext;

  if (isLoading) {
    return (
      <>
        <Breadcrumb items={[{ label: "Checkout" }]} />
        <section className="py-10 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading checkout...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

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
    setError("");
    setIsSubmitting(true);

    try {
      // If user chose to create account and is not logged in, create an account first
      if (formData.createAccount) {
        try {
          const regRes = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: formData.phone,
            }),
          });
          const regData = await regRes.json();
          if (!regRes.ok) {
            throw new Error(regData.error || 'Failed to create account');
          }

          // Auto sign-in the user
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const signInResult = await (await import('next-auth/react')).signIn('credentials', {
            redirect: false,
            email: formData.email,
            password: formData.password,
          });
          // @ts-ignore
          if (signInResult?.error) {
            // Not fatal, continue as guest but inform the user
            setError('Account created but sign in failed. You can sign in from the login page.');
          }
        } catch (err: any) {
          setError(err.message || 'Failed to create account');
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare order data
      const orderData = {
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        subtotal: cartTotal,
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        notes: formData.orderNotes,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an unexpected response. Please try again later.");
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to place order");
      }

      // Clear cart after successful order
      clearCart();

      // Redirect to thank you page
      router.push(`/thankyou?order=${data.data.orderNumber}`);
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Checkout" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600">{error}</p>
            </div>
          )}

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

                  {!session && (
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

                      {formData.createAccount && (
                        <div className="mt-3">
                          <label className="block text-gray-900 mb-2">Password <span className="text-red-500">*</span></label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                      )}
                    </div>
                  )}

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
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between">
                        <span className="text-gray-600">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
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
                          name="paymentMethod"
                          value="bank"
                          checked={formData.paymentMethod === "bank"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-gray-900">
                          Direct Bank Transfer
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="check"
                          checked={formData.paymentMethod === "check"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-gray-900">Check Payment</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === "paypal"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-gray-900">PayPal</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded uppercase tracking-wider hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
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