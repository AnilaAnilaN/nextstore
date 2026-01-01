"use client";

import { useState, useContext, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, User, Heart, ShoppingCart, Menu, LogOut, LayoutDashboard, Package, ChevronDown } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { CartContext } from '@/context/CartContext';

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartContext = useContext(CartContext);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!cartContext) {
    return null;
  }

  const { cartCount } = cartContext;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut({ callbackUrl: '/' });
    }
  };

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
                <form onSubmit={handleSearch} className="relative hidden md:block">
                  <button type="submit">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-primary transition-colors cursor-pointer" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-4 py-2 border-0 focus:outline-none focus:ring-0"
                  />
                </form>
              </div>

              {/* Logo */}
              <div className="flex justify-center w-1/2 md:w-1/4">
                <Link
                  href="/"
                  className="text-xl md:text-2xl font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1"
                >
                  StarStore
                </Link>
              </div>

              {/* Icons */}
              <div className="flex items-center justify-end space-x-4 md:space-x-6 w-1/4">
                {session?.user ? (
                  <div className="relative hidden md:block" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary transition-colors focus:outline-none"
                    >
                      <User className="w-5 h-5" />
                      <span className="max-w-[100px] truncate font-medium">{session.user.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/profile/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                        {(session.user as any).role === 'admin' && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors border-t border-gray-50"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="hidden md:block group">
                      <User className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link href="/register" className="hidden md:block text-sm font-bold text-gray-900 hover:text-primary transition-colors uppercase tracking-wider">
                      Register
                    </Link>
                  </>
                )}
                <Link href="/wishlists" className="hidden md:block relative group">
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </Link>
                <Link href="/cart" className="relative group">
                  <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                </Link>
                <button
                  className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
            <ul className="flex items-center justify-center space-x-12 py-5">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-900 hover:text-primary uppercase text-xs font-bold tracking-[0.2em] transition-colors"
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