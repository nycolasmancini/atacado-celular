"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface QuickAddButtonsProps {
  onAdd: (quantity: number) => void;
  specialQty: number;
  currentQty?: number;
  className?: string;
}

export function QuickAddButtons({ 
  onAdd, 
  specialQty, 
  currentQty = 0,
  className 
}: QuickAddButtonsProps) {
  const quickAmounts = [5, 10, 20, 50];

  const getButtonVariant = (amount: number) => {
    const newTotal = currentQty + amount;
    
    // Se com essa quantidade ativa o preço especial
    if (currentQty < specialQty && newTotal >= specialQty) {
      return "special"; // Destaque especial
    }
    
    return "outline";
  };

  const getTooltipText = (amount: number) => {
    const newTotal = currentQty + amount;
    
    if (currentQty < specialQty && newTotal >= specialQty) {
      return `Adicione +${amount} para preço especial!`;
    }
    
    if (currentQty < specialQty) {
      const stillNeeded = specialQty - newTotal;
      if (stillNeeded > 0) {
        return `Faltam ${stillNeeded} para preço especial`;
      }
    }
    
    return `Adicionar ${amount} unidades`;
  };

  return (
    <div className={cn("flex gap-1 flex-wrap", className)}>
      {quickAmounts.map(amount => {
        const newTotal = currentQty + amount;
        const isSpecialTrigger = currentQty < specialQty && newTotal >= specialQty;
        
        return (
          <div key={amount} className="relative group">
            <Button
              variant={getButtonVariant(amount)}
              size="sm"
              onClick={() => onAdd(amount)}
              className={cn(
                "text-xs px-3 py-1.5 h-7 min-w-[48px] relative",
                isSpecialTrigger && [
                  "bg-gradient-to-r from-green-500 to-green-600",
                  "text-white border-green-500",
                  "hover:from-green-600 hover:to-green-700",
                  "shadow-md hover:shadow-lg",
                  "animate-pulse"
                ]
              )}
            >
              +{amount}
              {isSpecialTrigger && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              )}
            </Button>
            
            {/* Tooltip */}
            <div className={cn(
              "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2",
              "bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "pointer-events-none z-50"
            )}>
              {getTooltipText(amount)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        );
      })}
    </div>
  );
}