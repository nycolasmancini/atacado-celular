"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  specialQty: number;
  className?: string;
}

export function QuantitySelector({ 
  value, 
  onChange, 
  min = 1, 
  max = 9999,
  specialQty,
  className 
}: QuantitySelectorProps) {
  
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleQuickAdd = (amount: number) => {
    const newValue = value + amount;
    if (newValue <= max) {
      onChange(newValue);
    }
  };

  const isAtSpecialQty = value >= specialQty;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Quantity Controls */}
      <div className="flex items-center gap-2">
        {/* Decrease Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDecrease}
          disabled={value <= min}
          className="w-8 h-8 p-0 flex-shrink-0"
        >
          <span className="text-lg leading-none">−</span>
        </Button>

        {/* Quantity Input */}
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={cn(
            "w-14 h-8 text-center border border-gray-300 rounded text-sm font-medium",
            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
            isAtSpecialQty && "ring-2 ring-green-500 border-green-500 bg-green-50"
          )}
        />

        {/* Increase Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleIncrease}
          disabled={value >= max}
          className="w-8 h-8 p-0 flex-shrink-0"
        >
          <span className="text-lg leading-none">+</span>
        </Button>
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-1">
        {[5, 10, 20, 50].map(amount => (
          <Button
            key={amount}
            variant="ghost"
            size="sm"
            onClick={() => handleQuickAdd(amount)}
            disabled={value + amount > max}
            className={cn(
              "text-xs px-2 py-1 h-6 min-w-[32px]",
              "hover:bg-orange-100 hover:text-orange-700",
              value + amount > max && "opacity-30"
            )}
          >
            +{amount}
          </Button>
        ))}
      </div>

      {/* Special Quantity Indicator */}
      {isAtSpecialQty && (
        <div className="text-xs text-green-600 text-center font-medium">
          ✨ Preço especial ativo!
        </div>
      )}

      {/* Progress to Special Quantity */}
      {!isAtSpecialQty && specialQty > 0 && (
        <div className="text-xs text-gray-500 text-center">
          +{specialQty - value} para preço especial
        </div>
      )}
    </div>
  );
}