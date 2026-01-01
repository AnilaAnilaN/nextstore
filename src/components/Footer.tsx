import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<any>({
    locations: [{ address: '203 Fake St. Mountain View, San Francisco, California, USA' }],
    phone: '+2 392 3929 210',
    email: 'emailaddress@domain.com'
  });

  useEffect(() => {
    fetch('/api/content/contact')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContactInfo(data.data.content);
        }
      })
      .catch(err => console.error("Error fetching footer contact info:", err));
  }, []);

  return (
    <footer className="border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-gray-900 text-xl mb-4">Navigations</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Sell online
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Shopping cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Store builder
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 mt-10">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Mobile commerce
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Dropshipping
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Website development
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 mt-10">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Point of sale
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Hardware
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-primary"
                    >
                      Software
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Promo */}
          <div>
            <h3 className="text-gray-900 text-xl mb-4">Promo</h3>
            <Link href="#" className="block">
              <div className="relative h-48 mb-4 rounded overflow-hidden">
                <Image
                  src="/images/hero_1.jpg"
                  alt="Promo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-light mb-0">Finding Your Perfect Shoes</h3>
              <p className="text-sm text-gray-500">
                Promo from January 15 — 25, 2019
              </p>
            </Link>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 text-xl mb-4">Contact Info</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                <p className="text-gray-600">
                  {contactInfo.locations?.[0]?.address || '203 Fake St. Mountain View, San Francisco, California, USA'}
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-600 group-hover:text-primary transition-colors">
                  {contactInfo.phone || '+2 392 3929 210'}
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <p className="text-gray-600 group-hover:text-primary transition-colors">
                  {contactInfo.email || 'emailaddress@domain.com'}
                </p>
              </div>
            </div>

            {/* Subscribe Form */}
            <div>
              <label className="text-gray-900 text-xl mb-4 block">
                Subscribe
              </label>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:border-primary"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-r hover:bg-primary-hover">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 text-center border-t border-gray-200">
          <p className="text-gray-600">
            Copyright &copy; {new Date().getFullYear()} All rights reserved | StarStore
          </p>
        </div>
      </div>
    </footer>
  );
}
