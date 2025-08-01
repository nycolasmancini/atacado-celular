"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CartItemProps {
  item: {
    productId: number;
    name: string;
    price: number;
    specialPrice: number;
    specialPriceMinQty: number;
    appliedPrice: number;
    quantity: number;
    isSpecialPrice: boolean;
    imageUrl?: string;
    categoryName?: string;
  };
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const qtyToSpecialPrice = Math.max(0, item.specialPriceMinQty - item.quantity);
  const potentialSaving = qtyToSpecialPrice > 0 
    ? (item.price - item.specialPrice) * item.specialPriceMinQty 
    : 0;

  const handleQuickAdd = (amount: number) => {
    onQuantityChange(item.productId, item.quantity + amount);
  };

  const getSuggestedIncrements = () => {
    const increments = [];
    // Only suggest special price increment if criteria is met
    if (qtyToSpecialPrice > 0 && qtyToSpecialPrice <= 100 && 
        item.quantity >= (item.specialPriceMinQty * 0.8)) {
      increments.push(qtyToSpecialPrice); // Exact amount to reach special price
    }
    if (item.quantity < 50) increments.push(10);
    if (item.quantity < 200) increments.push(50);
    return increments.slice(0, 2); // Max 2 suggestions
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                {item.name}
              </h3>
              {item.categoryName && (
                <p className="text-xs text-gray-500 mt-1">
                  {item.categoryName}
                </p>
              )}
            </div>

            {/* Price Badge */}
            {item.isSpecialPrice && (
              <div className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Preço Especial
              </div>
            )}
          </div>
          
          {/* Price Display */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Preço unitário:
              </span>
              <div className="text-right">
                <span className="font-medium text-sm">
                  {formatPrice(item.appliedPrice)}
                </span>
                {item.isSpecialPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    {formatPrice(item.price)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Special Price Opportunity */}
          {!item.isSpecialPrice && qtyToSpecialPrice > 0 && qtyToSpecialPrice <= 100 && 
           item.quantity >= (item.specialPriceMinQty * 0.8) && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <span className="text-yellow-800">
                💡 Adicione <strong>+{qtyToSpecialPrice}</strong> para preço especial
              </span>
              <div className="text-yellow-600 mt-1">
                Economize {formatPrice(potentialSaving)}
              </div>
            </div>
          )}

          {/* Enhanced Quantity Controls */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.productId, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 p-0"
                >
                  −
                </Button>
                
                <span className="font-medium min-w-[3rem] text-center text-sm">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.productId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
              >
                Remover
              </Button>
            </div>

            {/* Quick Add Buttons */}
            {getSuggestedIncrements().length > 0 && (
              <div className="flex gap-1">
                {getSuggestedIncrements().map((increment) => (
                  <Button
                    key={increment}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAdd(increment)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    +{increment}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Item Total & Savings */}
          <div className="mt-3 border-t pt-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Total ({item.quantity}x):
              </span>
              <span className="font-bold text-orange-600">
                {formatPrice(item.appliedPrice * item.quantity)}
              </span>
            </div>

            {item.isSpecialPrice && (
              <div className="flex items-center justify-between text-green-600">
                <span className="text-xs">
                  Economia:
                </span>
                <span className="text-xs font-medium">
                  {formatPrice((item.price - item.specialPrice) * item.quantity)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}