"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTracking } from "@/contexts/TrackingContext";

interface CartItem {
  productId: number;
  name: string;
  price: number;              // Preço normal
  specialPrice: number;       // Preço especial
  specialPriceMinQty: number; // Quantidade para especial
  quantity: number;
  imageUrl?: string;
  appliedPrice: number;       // Preço sendo aplicado
  isSpecialPrice: boolean;    // Se está com preço especial
  categoryName?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  isMinOrderMet: boolean;
  itemsToMinOrder: number;
  addItem: (product: any, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Try to use tracking, but don't break if not available
  let trackEvent: ((event: string, data?: any) => void) | null = null;
  try {
    const tracking = useTracking();
    trackEvent = tracking.trackEvent;
  } catch (error) {
    // Tracking not available, continue without it
    trackEvent = () => {};
  }

  // Calcular totais do carrinho
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.appliedPrice * item.quantity), 0);
  const totalSavings = items.reduce((sum, item) => {
    if (item.isSpecialPrice) {
      return sum + ((item.price - item.specialPrice) * item.quantity);
    }
    return sum;
  }, 0);

  // Validação pedido mínimo (30 peças)
  const isMinOrderMet = totalItems >= 30;
  const itemsToMinOrder = Math.max(0, 30 - totalItems);

  // Função para calcular preço aplicado baseado na quantidade
  const calculatePricing = (item: Omit<CartItem, 'appliedPrice' | 'isSpecialPrice'>) => {
    const isSpecialPrice = item.quantity >= item.specialPriceMinQty;
    const appliedPrice = isSpecialPrice ? item.specialPrice : item.price;

    return {
      ...item,
      appliedPrice,
      isSpecialPrice,
    };
  };

  // Carregar itens do localStorage na inicialização
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart) as CartItem[];
        // Recalcular preços ao carregar (pode ter mudado)
        const recalculatedCart = parsedCart.map(item => calculatePricing(item));
        setItems(recalculatedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Salvar no localStorage sempre que itens mudarem
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('cart');
    }
  }, [items]);

  const addItem = (product: any, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.productId === product.id);

      if (existingItemIndex >= 0) {
        // Item já existe - atualizar quantidade
        const updatedItems = [...prevItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        
        updatedItems[existingItemIndex] = calculatePricing({
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
        });

        return updatedItems;
      } else {
        // Novo item
        const newItem = calculatePricing({
          productId: product.id,
          name: product.name,
          price: product.price,
          specialPrice: product.specialPrice,
          specialPriceMinQty: product.specialPriceMinQty,
          quantity,
          imageUrl: product.imageUrl,
          categoryName: product.category?.name,
        });

        return [...prevItems, newItem];
      }
    });

    // Tracking Meta Pixel - AddToCart
    trackEvent('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: (quantity >= product.specialPriceMinQty ? product.specialPrice : product.price) * quantity,
      currency: 'BRL',
      contents: [{
        id: product.id,
        quantity: quantity,
        item_price: quantity >= product.specialPriceMinQty ? product.specialPrice : product.price
      }]
    });

    // Evento customizado para preço especial
    if (quantity >= product.specialPriceMinQty) {
      trackEvent('SpecialPriceActivated', {
        product_id: product.id,
        product_name: product.name,
        quantity: quantity,
        savings: (product.price - product.specialPrice) * quantity
      });
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.productId === productId) {
          const oldIsSpecialPrice = item.isSpecialPrice;
          const updatedItem = calculatePricing({
            ...item,
            quantity,
          });

          // Track se ativou preço especial
          if (!oldIsSpecialPrice && updatedItem.isSpecialPrice) {
            trackEvent('SpecialPriceActivated', {
              product_id: productId,
              product_name: item.name,
              quantity: quantity,
              savings: (item.price - item.specialPrice) * quantity
            });
          }

          return updatedItem;
        }
        return item;
      });
    });
  };

  const removeItem = (productId: number) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getItemQuantity = (productId: number) => {
    const item = items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    totalSavings,
    isMinOrderMet,
    itemsToMinOrder,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}