"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartSection } from "./AddToCartSection";
import { QuickAddButtons } from "./QuickAddButtons";
import { useProductView } from "@/hooks/useProductView";
import { useProductPricing } from "@/hooks/useProductPricing";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductCardProps {
  product: Product;
  pricesUnlocked: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  pricesUnlocked, 
  className 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem, getItemQuantity } = useCart();
  
  // Track product view
  useProductView(cardRef, product);
  
  // Get current cart quantity for this product
  const cartQuantity = getItemQuantity(product.id);
  
  // Calculate pricing for current quantity
  const pricing = useProductPricing(product, quantity);
  
  // Handle quick add buttons
  const handleQuickAdd = (amount: number) => {
    const newQuantity = quantity + amount;
    setQuantity(newQuantity);
  };
  
  // Handle add to cart
  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
        "flex flex-col md:flex-col h-full",
        // Mobile: horizontal layout (max 120px height)
        "md:max-h-none max-h-[120px] md:h-auto",
        // Desktop: vertical layout (max 280px height)
        "md:max-h-[280px]",
        className
      )}
    >
      {/* Mobile Layout - Horizontal */}
      <div className="flex md:hidden h-full">
        {/* Image - Left side on mobile */}
        <div className="flex-shrink-0 w-24 h-full relative">
          <div className="absolute inset-0 bg-gray-100 rounded-l-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Content - Right side on mobile */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          {/* Product Info */}
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-1">
              {product.category.name}
            </p>
          </div>

          {/* Price and Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  specialQty={product.specialPriceMinQty}
                  className="scale-90 origin-left"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <PriceDisplay
                  price={product.price}
                  specialPrice={product.specialPrice}
                  specialQty={product.specialPriceMinQty}
                  currentQty={quantity}
                  pricesUnlocked={pricesUnlocked}
                />
              </div>
            </div>
            
            {/* Quick Add Buttons - Mobile */}
            {pricesUnlocked && (
              <QuickAddButtons
                onAdd={handleQuickAdd}
                specialQty={product.specialPriceMinQty}
                currentQty={quantity}
                className="justify-center"
              />
            )}
            
            {/* Cart indicator if item is in cart */}
            {cartQuantity > 0 && (
              <div className="text-xs text-green-600 text-center">
                {cartQuantity} no carrinho
              </div>
            )}
            
            {/* Special price hint */}
            {pricesUnlocked && pricing.unitsToSpecial > 0 && (
              <div className="text-xs text-orange-600 text-center">
                Faltam {pricing.unitsToSpecial} para preço especial
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - Vertical */}
      <div className="hidden md:flex flex-col h-full">
        {/* Image - Top on desktop */}
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex-shrink-0">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
              {product.category.name}
            </span>
          </div>
        </div>

        {/* Content - Bottom on desktop */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Info */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem]">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-1">
                {product.description}
              </p>
            )}
          </div>

          {/* Price Display */}
          <div className="mb-3 flex-shrink-0">
            <PriceDisplay
              price={product.price}
              specialPrice={product.specialPrice}
              specialQty={product.specialPriceMinQty}
              currentQty={quantity}
              pricesUnlocked={pricesUnlocked}
            />
          </div>

          {/* Quantity Selector */}
          <div className="mb-3 flex-shrink-0">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              specialQty={product.specialPriceMinQty}
            />
          </div>

          {/* Quick Add Buttons - Desktop */}
          {pricesUnlocked && (
            <div className="mb-3 flex-shrink-0">
              <QuickAddButtons
                onAdd={handleQuickAdd}
                specialQty={product.specialPriceMinQty}
                currentQty={quantity}
                className="justify-center"
              />
            </div>
          )}

          {/* Cart indicator if item is in cart */}
          {cartQuantity > 0 && (
            <div className="mb-2 text-xs text-green-600 text-center font-medium">
              {cartQuantity} no carrinho
            </div>
          )}

          {/* Special price hint */}
          {pricesUnlocked && pricing.unitsToSpecial > 0 && (
            <div className="mb-3 text-xs text-orange-600 text-center">
              Faltam {pricing.unitsToSpecial} para preço especial
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="mt-auto">
            <AddToCartSection
              product={product}
              quantity={quantity}
              pricesUnlocked={pricesUnlocked}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}