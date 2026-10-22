'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface CartItem {
  id: string; // unique key: `${productId}_${variant || 'default'}`
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedVariant?: string;
  quantity: number;
  stock?: number;
}

interface AddItemParams {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  selectedVariant?: string;
  stock?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddItemParams, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  subtotal: number;
  totalItemsCount: number;
  isFreeShippingEnabled: boolean;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  freeShippingProgress: number;
  updateFreeShippingConfig: (config: { isEnabled: boolean; threshold: number }) => void;
  hasHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'pharmaclick_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Dynamic Free Shipping Settings (Configured by Admin)
  const [isFreeShippingEnabled, setIsFreeShippingEnabled] = useState(false);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(10000);

  // Fetch Admin Shipping Settings on Mount
  useEffect(() => {
    fetch('/api/shipping-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          setIsFreeShippingEnabled(Boolean(data.isFreeShippingEnabled));
          if (typeof data.freeShippingThreshold === 'number') {
            setFreeShippingThreshold(data.freeShippingThreshold);
          }
        }
      })
      .catch((err) => console.warn('Could not load shipping settings:', err));
  }, []);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Save to localStorage whenever items change (only after initial hydration)
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [items, hasHydrated]);

  const addItem = (newItem: AddItemParams, quantity = 1) => {
    const itemId = `${newItem.productId}_${newItem.selectedVariant || 'default'}`;
    const qtyToAdd = Math.max(1, quantity);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const maxStock = newItem.stock ?? 99;
        const newQty = Math.min(existing.quantity + qtyToAdd, maxStock);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: newItem.productId,
          name: newItem.name,
          slug: newItem.slug,
          image: newItem.image,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          selectedVariant: newItem.selectedVariant,
          quantity: qtyToAdd,
          stock: newItem.stock ?? 99,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          const maxStock = i.stock ?? 99;
          return { ...i, quantity: Math.min(quantity, maxStock) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear cart storage:', e);
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const updateFreeShippingConfig = ({ isEnabled, threshold }: { isEnabled: boolean; threshold: number }) => {
    setIsFreeShippingEnabled(isEnabled);
    setFreeShippingThreshold(threshold);
  };

  const amountToFreeShipping = useMemo(() => {
    if (!isFreeShippingEnabled || freeShippingThreshold <= 0) return 0;
    return Math.max(0, freeShippingThreshold - subtotal);
  }, [isFreeShippingEnabled, freeShippingThreshold, subtotal]);

  const freeShippingProgress = useMemo(() => {
    if (!isFreeShippingEnabled || freeShippingThreshold <= 0) return 0;
    if (subtotal >= freeShippingThreshold) return 100;
    return Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  }, [isFreeShippingEnabled, freeShippingThreshold, subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        subtotal,
        totalItemsCount,
        isFreeShippingEnabled,
        freeShippingThreshold,
        amountToFreeShipping,
        freeShippingProgress,
        updateFreeShippingConfig,
        hasHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
