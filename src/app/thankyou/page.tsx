import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Thank You' }]} />

      <section className="site-section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-5xl font-light text-gray-900 mb-4">Thank you!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your order was successfully completed.
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}