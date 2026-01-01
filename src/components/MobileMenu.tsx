'use client';

import { X, User, LogOut, Package, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const MobileMenu = ({ isOpen, onClose, menuItems }: MobileMenuProps) => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut({ callbackUrl: '/' });
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-1999"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-2000 shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xl font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1"
              onClick={onClose}
            >
              StarStore
            </Link>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-8 h-8 text-gray-600 hover:text-gray-900" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-5 py-3 text-gray-900 hover:text-primary text-lg transition-colors font-medium"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-100">
              {session?.user ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  <Link
                    href="/profile/orders"
                    className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    <Package className="w-5 h-5" />
                    <span className="font-medium">My Orders</span>
                  </Link>
                  {(session.user as any).role === 'admin' && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-5 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 px-5">
                  <Link
                    href="/login"
                    className="block w-full text-center py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
                    onClick={onClose}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center py-3 border border-gray-900 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    onClick={onClose}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;