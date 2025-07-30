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


  const isAtSpecialQty = value >= specialQty;

  return (
    <div className={cn(className)}>
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
          inputMode="numeric"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={cn(
            "w-14 h-8 text-center border border-gray-300 rounded text-sm font-medium",
            "focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
            isAtSpecialQty && "ring-2 ring-green-500 border-green-500 bg-green-50"
          )}
          style={{ fontSize: '16px' }}
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


    </div>
  );
}