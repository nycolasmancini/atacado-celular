"use client";

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  specialPrice: number;
  specialQty: number;
  currentQty: number;
  pricesUnlocked: boolean;
}

export function PriceDisplay({ 
  price, 
  specialPrice, 
  specialQty, 
  currentQty, 
  pricesUnlocked 
}: PriceDisplayProps) {
  const isSpecialPriceActive = currentQty >= specialQty;
  const applicablePrice = isSpecialPriceActive ? specialPrice : price;
  const savings = currentQty >= specialQty ? (price - specialPrice) * currentQty : 0;

  if (!pricesUnlocked) {
    return (
      <div className="space-y-2">
        <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-center">
          <p className="text-sm font-medium">🔒 Libere para ver preços</p>
        </div>
      </div>
    );
  }

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  return (
    <div className="space-y-2">
      {/* Always show both prices */}
      <div className="space-y-1">
        {/* Normal wholesale price */}
        <div className={cn(
          "flex items-center justify-between text-sm",
          isSpecialPriceActive && "line-through text-gray-500"
        )}>
          <span>Atacado:</span>
          <span className="font-semibold">{formatPrice(price)}</span>
        </div>

        {/* Special price */}
        <div className={cn(
          "flex items-center justify-between text-sm",
          isSpecialPriceActive 
            ? "text-green-600 font-bold" 
            : "text-gray-600"
        )}>
          <span>+{specialQty} unidades:</span>
          <span className="font-semibold">{formatPrice(specialPrice)}</span>
        </div>
      </div>


    </div>
  );
}