"use client";

import { forwardRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string;
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

// Simple phone mask for Brazilian format: (XX) XXXXX-XXXX
const applyPhoneMask = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", mask, error, label, helperText, icon, onChange, ...props }, ref) => {
    const baseClasses = "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50";
    
    const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
    
    const handleMaskedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (mask && mask.includes('(99) 99999-9999')) {
        const maskedValue = applyPhoneMask(e.target.value);
        e.target.value = maskedValue;
      }
      onChange?.(e);
    }, [mask, onChange]);
    
    const inputElement = (
      <input
        type={type}
        className={cn(baseClasses, errorClasses, icon && "pl-10", className)}
        ref={ref}
        onChange={mask ? handleMaskedChange : onChange}
        {...props}
      />
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          {inputElement}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;