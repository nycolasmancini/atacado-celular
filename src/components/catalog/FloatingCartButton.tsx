"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "./CartDrawer";

export function FloatingCartButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { totalItems, totalPrice, isMinOrderMet } = useCart();

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  // Don't show if cart is empty
  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className={cn(
            "relative h-14 px-4 rounded-full shadow-lg hover:shadow-xl",
            "transition-all duration-200 transform hover:scale-105",
            "bg-orange-500 hover:bg-orange-600 text-white",
            "flex items-center gap-3",
            !isMinOrderMet && "animate-pulse"
          )}
        >
          {/* Cart Icon with Badge */}
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
            
            {/* Item Count Badge */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
              {totalItems}
            </div>
          </div>

          {/* Cart Info */}
          <div className="flex flex-col items-start">
            <div className="text-sm font-medium leading-tight">
              {formatPrice(totalPrice)}
            </div>
            <div className="text-xs opacity-90 leading-tight">
              {isMinOrderMet ? (
                "Finalizar pedido"
              ) : (
                `+${30 - totalItems} peças`
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          {!isMinOrderMet && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/40 transition-all duration-300"
                style={{ width: `${Math.min(100, (totalItems / 30) * 100)}%` }}
              />
            </div>
          )}
        </Button>
      </div>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </>
  );
}