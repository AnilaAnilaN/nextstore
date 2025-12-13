'use client';

import { X } from 'lucide-react';
import Link from 'next/link';

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
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[1999]"
          onClick={onClose}
        />
      )}

      {/* Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[300px] bg-white z-[2000] shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/" 
              className="text-xl font-bold uppercase tracking-wider border-2 border-gray-900 px-3 py-1"
              onClick={onClose}
            >
              Shoppers
            </Link>
            <button onClick={onClose}>
              <X className="w-8 h-8 text-gray-600 hover:text-gray-900" />
            </button>
          </div>

          {/* Menu Items */}
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block px-5 py-3 text-gray-900 hover:text-[#7971ea] text-lg transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;