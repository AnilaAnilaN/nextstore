'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from API or session on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        // First, check localStorage for initial immediate load
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }

        // Then try to fetch cart from API if user is logged in
        const response = await fetch('/api/cart');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            // If API cart exists, it overrides local cart for logged in users
            setCartItems(data.data);
            localStorage.setItem('cart', JSON.stringify(data.data));
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Sync cart with API and localStorage whenever it changes
  const syncCart = async (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      const newItems = existingItem
        ? prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        : [...prevItems, { ...product, quantity: 1 }];

      syncCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item._id !== productId);
      syncCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      syncCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    syncCart([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};