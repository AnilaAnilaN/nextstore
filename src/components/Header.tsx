"use client";

import { useState, useContext } from 'react';
import Link from 'next/link';
import { Search, User, Heart, ShoppingCart, Menu } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { CartContext } from '@/context/CartContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cartCount } = cartContext;

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        {/* Top Bar */}
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-6 md:py-10">
              {/* Search */}
              <div className="flex items-center space-x-2 w-1/4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-8 pr-4 py-2 border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Logo */}
              <div className="flex justify-center w-1/2 md:w-1/4">
                <Link
                  href="/"
                  className="text-xl md:text-2xl font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1"
                >
                  Shoppers
                </Link>
              </div>

              {/* Icons */}
              <div className="flex items-center justify-end space-x-4 md:space-x-6 w-1/4">
                <Link href="#" className="hidden md:block">
                  <User className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                </Link>
                <Link href="#" className="hidden md:block">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                </Link>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
                <button
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:block border-b border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center space-x-8 py-4">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-900 hover:text-primary uppercase text-sm tracking-wider transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
};

export default Header;