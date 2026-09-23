import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CustomBoxItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  addCustomBox: (boxSize: number, boxItems: CustomBoxItem[], title?: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  discount: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  emirate: string;
  setEmirate: (em: string) => void;
  fulfillmentType: 'DELIVERY' | 'PICKUP';
  setFulfillmentType: (type: 'DELIVERY' | 'PICKUP') => void;
  pickupStoreId: string;
  setPickupStoreId: (storeId: string) => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [emirate, setEmirate] = useState('Dubai');
  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [pickupStoreId, setPickupStoreId] = useState('store-dubai-mall');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('hop_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('hop_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.type === 'single' && i.productId === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = next[existingIdx].quantity + quantity;
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: newQty,
          totalPrice: newQty * next[existingIdx].unitPrice,
        };
        return next;
      } else {
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          type: 'single',
          productId: product.id,
          product,
          quantity,
          unitPrice: product.price,
          totalPrice: product.price * quantity,
        };
        return [...prev, newItem];
      }
    });
    setIsCartOpen(true);
  };

  const addCustomBox = (boxSize: number, boxItems: CustomBoxItem[], title?: string) => {
    // Calculate raw pop sum
    const rawTotal = boxItems.reduce((sum, item) => sum + item.quantity * 22, 0); // approx avg pop AED 22
    let discountRate = 0;
    if (boxSize >= 12) discountRate = 0.20;
    else if (boxSize >= 10) discountRate = 0.15;
    else if (boxSize >= 6) discountRate = 0.10;

    const finalBoxPrice = Math.round(rawTotal * (1 - discountRate));

    const newItem: CartItem = {
      id: `box-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'custom_box',
      boxSize,
      boxItems,
      quantity: 1,
      unitPrice: finalBoxPrice,
      totalPrice: finalBoxPrice,
    };

    setItems((prev) => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: nextQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setPromoDiscount(0);
    localStorage.removeItem('hop_cart');
  };

  // Calculations
  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'NATURAL15') {
      const disc = Math.round(subtotal * 0.15);
      setPromoCode('NATURAL15');
      setPromoDiscount(disc);
      return { success: true, message: '15% Off Applied! 100% Natural goodness savings.' };
    }
    if (cleanCode === 'POPSUMMER') {
      setPromoCode('POPSUMMER');
      setPromoDiscount(20);
      return { success: true, message: 'AED 20 Summer Refresh Discount Applied!' };
    }
    if (cleanCode === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.10);
      setPromoCode('WELCOME10');
      setPromoDiscount(disc);
      return { success: true, message: '10% Welcome Discount Applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try NATURAL15 or POPSUMMER.' };
  };

  const deliveryFee = fulfillmentType === 'PICKUP' || subtotal >= 150 ? 0 : 15;
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee);

  const totalItemCount = items.reduce((sum, item) => {
    if (item.type === 'single') return sum + item.quantity;
    if (item.type === 'custom_box') return sum + item.quantity * (item.boxSize || 10);
    return sum + item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addCustomBox,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        discount: promoDiscount,
        promoCode,
        setPromoCode,
        promoDiscount,
        deliveryFee,
        total,
        emirate,
        setEmirate,
        fulfillmentType,
        setFulfillmentType,
        pickupStoreId,
        setPickupStoreId,
        applyPromoCode,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
