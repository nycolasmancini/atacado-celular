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
    if (value > 0) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permite campo vazio ou valores numéricos
    if (inputValue === '') {
      onChange(0);
      return;
    }
    
    const newValue = parseInt(inputValue);
    
    // Permite qualquer número válido entre 0 e max
    if (!isNaN(newValue) && newValue >= 0 && newValue <= max) {
      onChange(newValue);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Para inputs do tipo number, não é possível usar setSelectionRange
    // O browser já posiciona o cursor adequadamente
    e.target.select();
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
          disabled={value <= 0}
          className="w-8 h-8 p-0 flex-shrink-0 select-none"
        >
          <span className="text-lg leading-none select-none">−</span>
        </Button>

        {/* Quantity Input */}
        <input
          type="number"
          inputMode="numeric"
          value={value === 0 ? '' : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          min={0}
          max={max}
          placeholder="0"
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
          className="w-8 h-8 p-0 flex-shrink-0 select-none"
        >
          <span className="text-lg leading-none select-none">+</span>
        </Button>
      </div>


    </div>
  );
}