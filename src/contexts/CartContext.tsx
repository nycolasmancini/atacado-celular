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
  kitId?: number;             // ID do kit se item faz parte de um kit
  kitName?: string;           // Nome do kit
  kitOriginalQuantity?: number; // Quantidade original no kit
}

interface KitDiscount {
  kitId: number;
  kitName: string;
  discountAmount: number;
  originalItemsCount: number;
  currentItemsCount: number;
  isActive: boolean;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  kitDiscounts: KitDiscount[];
  totalKitDiscounts: number;
  isMinOrderMet: boolean;
  itemsToMinOrder: number;
  addItem: (product: any, quantity: number, kitInfo?: { kitId: number; kitName: string; kitDiscount: number; originalQuantity: number }) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  addKitToCart: (kit: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [kitDiscounts, setKitDiscounts] = useState<KitDiscount[]>([]);
  
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
  const basePrice = items.reduce((sum, item) => sum + (item.appliedPrice * item.quantity), 0);
  const totalKitDiscounts = kitDiscounts.reduce((sum, discount) => discount.isActive ? sum + discount.discountAmount : sum, 0);
  const totalPrice = basePrice - totalKitDiscounts;
  const totalSavings = items.reduce((sum, item) => {
    if (item.isSpecialPrice) {
      return sum + ((item.price - item.specialPrice) * item.quantity);
    }
    return sum;
  }, 0) + totalKitDiscounts;

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
    const savedKitDiscounts = localStorage.getItem('kitDiscounts');
    
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
    
    if (savedKitDiscounts) {
      try {
        const parsedKitDiscounts = JSON.parse(savedKitDiscounts) as KitDiscount[];
        setKitDiscounts(parsedKitDiscounts);
      } catch (error) {
        console.error('Erro ao carregar descontos de kits:', error);
        localStorage.removeItem('kitDiscounts');
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

  // Salvar descontos de kits no localStorage
  useEffect(() => {
    if (kitDiscounts.length > 0) {
      localStorage.setItem('kitDiscounts', JSON.stringify(kitDiscounts));
    } else {
      localStorage.removeItem('kitDiscounts');
    }
  }, [kitDiscounts]);

  // Função para verificar e atualizar descontos de kits baseado nas quantidades dos itens
  const updateKitDiscounts = (updatedItems: CartItem[]) => {
    setKitDiscounts(prevDiscounts => {
      return prevDiscounts.map(discount => {
        const kitItems = updatedItems.filter(item => item.kitId === discount.kitId);
        const currentItemsCount = kitItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // Se removeu mais de 50% dos itens originais, desativar desconto
        const isActive = currentItemsCount >= (discount.originalItemsCount * 0.5);
        
        return {
          ...discount,
          currentItemsCount,
          isActive
        };
      }).filter(discount => {
        // Remover descontos de kits que não têm mais nenhum item no carrinho
        const hasKitItems = updatedItems.some(item => item.kitId === discount.kitId);
        return hasKitItems;
      });
    });
  };

  const addItem = (product: any, quantity: number, kitInfo?: { kitId: number; kitName: string; kitDiscount: number; originalQuantity: number }) => {
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
          kitId: kitInfo?.kitId,
          kitName: kitInfo?.kitName,
          kitOriginalQuantity: kitInfo?.originalQuantity,
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
      const updatedItems = prevItems.map(item => {
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
      
      // Atualizar descontos de kits se necessário
      updateKitDiscounts(updatedItems);
      
      return updatedItems;
    });
  };

  const removeItem = (productId: number) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.productId !== productId);
      // Atualizar descontos de kits se necessário
      updateKitDiscounts(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    setKitDiscounts([]);
    localStorage.removeItem('cart');
    localStorage.removeItem('kitDiscounts');
  };

  const addKitToCart = (kit: any) => {
    // Calcular total original dos itens do kit
    const originalItemsCount = kit.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const kitDiscount = Number(kit.discount) || 0;

    // Adicionar todos os produtos do kit ao carrinho
    kit.items.forEach((item: any) => {
      addItem(item.product, item.quantity, {
        kitId: kit.id,
        kitName: kit.name,
        kitDiscount,
        originalQuantity: item.quantity
      });
    });

    // Adicionar o desconto do kit se houver
    if (kitDiscount > 0) {
      setKitDiscounts(prevDiscounts => {
        // Verificar se já existe desconto para este kit
        const existingIndex = prevDiscounts.findIndex(d => d.kitId === kit.id);
        
        if (existingIndex >= 0) {
          // Atualizar desconto existente
          const updated = [...prevDiscounts];
          updated[existingIndex] = {
            ...updated[existingIndex],
            currentItemsCount: originalItemsCount,
            isActive: true
          };
          return updated;
        } else {
          // Criar novo desconto
          return [...prevDiscounts, {
            kitId: kit.id,
            kitName: kit.name,
            discountAmount: kitDiscount,
            originalItemsCount,
            currentItemsCount: originalItemsCount,
            isActive: true
          }];
        }
      });
    }
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
    kitDiscounts,
    totalKitDiscounts,
    isMinOrderMet,
    itemsToMinOrder,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    addKitToCart,
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