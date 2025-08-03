"use client";

import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  specialPrice: number;
  specialQty: number;
  currentQty: number;
  pricesUnlocked: boolean;
  customPriceLabels?: {
    normalLabel?: string;
    specialLabel?: string;
  };
}

export function PriceDisplay({ 
  price, 
  specialPrice, 
  specialQty, 
  currentQty, 
  pricesUnlocked,
  customPriceLabels 
}: PriceDisplayProps) {
  const isSpecialPriceActive = currentQty >= specialQty;
  const applicablePrice = isSpecialPriceActive ? specialPrice : price;
  const savings = currentQty >= specialQty ? (price - specialPrice) * currentQty : 0;

  if (!pricesUnlocked) {
    return (
      <div className="space-y-2">
        {/* Preços bloqueados - sem texto duplicado */}
      </div>
    );
  }

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  // Labels padrão ou customizados
  const normalLabel = customPriceLabels?.normalLabel || "Atacado:";
  const specialLabel = customPriceLabels?.specialLabel || `+${specialQty} unidades:`;

  return (
    <div className="space-y-2">
      {/* Mobile: Horizontal layout, Desktop: Vertical */}
      <div className="flex justify-between items-start md:flex-col md:space-y-1">
        {/* Normal wholesale price */}
        <div className={cn(
          "flex flex-col text-center md:flex-row md:items-center md:justify-between md:text-left text-sm gap-1",
          isSpecialPriceActive && "line-through text-gray-500"
        )}>
          <span className="text-xs md:text-sm">{normalLabel}</span>
          <span className="font-semibold text-lg md:text-base">{formatPrice(price)}</span>
        </div>

        {/* Special price */}
        <div className={cn(
          "flex flex-col text-center md:flex-row md:items-center md:justify-between md:text-left text-sm gap-1",
          isSpecialPriceActive 
            ? "text-green-600 font-bold" 
            : "text-gray-600"
        )}>
          <span className="text-xs md:text-sm">{specialLabel}</span>
          <span className="font-semibold text-lg md:text-base">{formatPrice(specialPrice)}</span>
        </div>
      </div>


    </div>
  );
}