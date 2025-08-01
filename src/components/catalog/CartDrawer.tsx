"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useTracking } from "@/contexts/TrackingContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { PricingBreakdown } from "@/components/cart/PricingBreakdown";
import { getSavingSuggestions } from "@/utils/savingSuggestions";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    totalSavings, 
    isMinOrderMet, 
    itemsToMinOrder,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();
  
  const { trackEvent } = useTracking();

  // Calculate saving suggestions
  const savingOpportunities = getSavingSuggestions(items);

  // Track InitiateCheckout when drawer opens
  useEffect(() => {
    if (isOpen && items.length > 0) {
      trackEvent('InitiateCheckout', {
        content_ids: items.map(item => item.productId),
        contents: items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: item.appliedPrice
        })),
        value: totalPrice,
        currency: 'BRL',
        num_items: totalItems
      });
    }
  }, [isOpen, items, totalPrice, totalItems, trackEvent]);

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };


  const handleAddQuantity = (productId: number, quantity: number) => {
    const currentItem = items.find(item => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + quantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Seu Carrinho</h2>
              <p className="text-sm opacity-90">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              /* Empty Cart */
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-gray-500 mb-4">
                  Adicione produtos para começar sua compra
                </p>
                <Button onClick={onClose} variant="outline">
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <>

                {/* Cart Items */}
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>

                {/* Pricing Breakdown for Special Prices */}
                <div className="px-4">
                  <PricingBreakdown items={items} />
                </div>
              </>
            )}
          </div>

          {/* Footer - only show if has items */}
          {items.length > 0 && (
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              totalSavings={totalSavings}
              isMinOrderMet={isMinOrderMet}
              itemsToMinOrder={itemsToMinOrder}
              savingOpportunities={savingOpportunities}
              onContinueShopping={onClose}
              onClearCart={clearCart}
              onAddQuantity={handleAddQuantity}
            />
          )}
        </div>
      </div>
    </>
  );
}