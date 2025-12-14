import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { CheckCircle } from "lucide-react";

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Thank You" }]} />

      <section className="py-10 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-5xl font-light text-gray-900 mb-4">
              Thank you!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your order was successfully completed.
            </p>
            <Link
              href="/shop"
              className="bg-primary text-white py-3 px-6 rounded-sm tracking-[0.05em] uppercase transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)] hover:-translate-y-0.5 inline-block"
            >
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
