"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { CheckCircle, Package, Mail } from "lucide-react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      // Fetch order details
      fetch(`/api/orders?orderNumber=${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data.length > 0) {
            setOrderDetails(data.data[0]);
          }
        })
        .catch((error) => console.error("Error fetching order:", error));
    }
  }, [orderNumber]);

  return (
    <>
      <Breadcrumb items={[{ label: "Thank You" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-medium text-gray-900 mb-4">
                Thank You For Your Order!
              </h1>
              {orderNumber && (
                <p className="text-lg text-gray-600 mb-2">
                  Order Number:{" "}
                  <span className="font-semibold text-primary">
                    {orderNumber}
                  </span>
                </p>
              )}
              <p className="text-gray-600">
                We've received your order and will process it shortly.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <Package className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Order Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your order is being processed. You'll receive a
                      confirmation email shortly with tracking details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-8 h-8 text-primary shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Confirmation Email
                    </h3>
                    <p className="text-sm text-gray-600">
                      We've sent a confirmation email to your registered email
                      address with order details.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {orderDetails && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 text-left">
                <h2 className="text-xl font-medium text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-600"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span className="text-primary">
                      ${orderDetails.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-primary text-white py-3 px-8 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5 inline-block"
              >
                Continue Shopping
              </Link>
              <Link
                href="/"
                className="py-3 px-8 rounded-sm uppercase tracking-[0.05em] transition-colors duration-200 border border-primary text-primary hover:bg-primary hover:text-white inline-block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    }>
      <ThankYouContent />
    </Suspense>
  );
}