import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-gray-900 text-xl mb-4">Navigations</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Sell online</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Features</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Shopping cart</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Store builder</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 mt-10">
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Mobile commerce</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Dropshipping</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Website development</Link></li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 mt-10">
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Point of sale</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Hardware</Link></li>
                  <li><Link href="#" className="text-gray-600 hover:text-[#7971ea]">Software</Link></li>
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
              <p className="text-sm text-gray-500">Promo from January 15 — 25, 2019</p>
            </Link>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 text-xl mb-4">Contact Info</h3>
            <ul className="space-y-2 mb-8">
              <li className="text-gray-600">203 Fake St. Mountain View, San Francisco, California, USA</li>
              <li><Link href="tel:+23923929210" className="text-gray-600 hover:text-[#7971ea]">+2 392 3929 210</Link></li>
              <li className="text-gray-600">emailaddress@domain.com</li>
            </ul>

            {/* Subscribe Form */}
            <div>
              <label className="text-gray-900 text-xl mb-4 block">Subscribe</label>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:border-[#7971ea]"
                />
                <button className="bg-[#7971ea] text-white px-6 py-3 rounded-r hover:bg-[#5a50e5]">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 text-center border-t border-gray-200">
          <p className="text-gray-600">
            Copyright &copy; {new Date().getFullYear()} All rights reserved | This template is made with ❤️ by{' '}
            <Link href="https://colorlib.com" target="_blank" className="text-[#7971ea]">
              Colorlib
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;