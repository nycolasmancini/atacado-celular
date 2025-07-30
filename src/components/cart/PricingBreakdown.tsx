"use client";

import { cn } from "@/lib/utils";

interface PricingBreakdownProps {
  items: Array<{
    productId: number;
    name: string;
    price: number;
    specialPrice: number;
    appliedPrice: number;
    quantity: number;
    isSpecialPrice: boolean;
  }>;
  className?: string;
}

export function PricingBreakdown({ items, className }: PricingBreakdownProps) {
  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const itemsWithSpecialPrice = items.filter(item => item.isSpecialPrice);
  
  if (itemsWithSpecialPrice.length === 0) {
    return null;
  }

  const totalOriginalPrice = itemsWithSpecialPrice.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );
  
  const totalSpecialPrice = itemsWithSpecialPrice.reduce(
    (sum, item) => sum + (item.appliedPrice * item.quantity), 
    0
  );
  
  const totalSavings = totalOriginalPrice - totalSpecialPrice;

  return (
    <div className={cn("bg-green-50 border border-green-200 rounded-lg p-4", className)}>
      <h3 className="text-sm font-medium text-green-900 mb-3 flex items-center">
        <span className="mr-2">✨</span>
        Detalhamento de Preços Especiais
      </h3>
      
      <div className="space-y-3">
        {itemsWithSpecialPrice.map((item) => {
          const originalTotal = item.price * item.quantity;
          const specialTotal = item.appliedPrice * item.quantity;
          const itemSavings = originalTotal - specialTotal;
          
          return (
            <div key={item.productId} className="bg-white rounded-lg p-3 border border-green-100">
              <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-1">
                {item.name}
              </h4>
              
              <div className="space-y-1 text-xs">
                {/* Original Price */}
                <div className="flex items-center justify-between text-gray-500">
                  <span>Preço normal: {formatPrice(item.price)} × {item.quantity}</span>
                  <span className="line-through">
                    {formatPrice(originalTotal)}
                  </span>
                </div>
                
                {/* Special Price */}
                <div className="flex items-center justify-between text-green-700">
                  <span>Preço especial: {formatPrice(item.appliedPrice)} × {item.quantity}</span>
                  <span className="font-medium">
                    {formatPrice(specialTotal)}
                  </span>
                </div>
                
                {/* Savings */}
                <div className="flex items-center justify-between text-green-600 font-medium border-t border-green-100 pt-1">
                  <span>Economia neste item:</span>
                  <span>{formatPrice(itemSavings)}</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Total Summary */}
        <div className="bg-green-100 rounded-lg p-3 border-t-2 border-green-300">
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between text-gray-700">
              <span>Total sem desconto:</span>
              <span className="line-through">
                {formatPrice(totalOriginalPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-green-700">
              <span>Total com preço especial:</span>
              <span className="font-medium">
                {formatPrice(totalSpecialPrice)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-green-600 font-bold text-base border-t border-green-200 pt-2">
              <span>Economia Total:</span>
              <span>{formatPrice(totalSavings)}</span>
            </div>
            
            <div className="text-center text-green-600 text-xs mt-1">
              Você economizou {((totalSavings / totalOriginalPrice) * 100).toFixed(1)}% nestes itens!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}