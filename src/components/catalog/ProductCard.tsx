"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartSection } from "./AddToCartSection";
import { useProductView } from "@/hooks/useProductView";
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
  onRequestWhatsApp?: () => void;
  className?: string;
}

export function ProductCard({ 
  product, 
  pricesUnlocked,
  onRequestWhatsApp,
  className 
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem, getItemQuantity } = useCart();
  
  // Track product view
  useProductView(cardRef, product);
  
  // Get current cart quantity for this product
  const cartQuantity = getItemQuantity(product.id);
  
  
  
  // Handle add to cart
  const handleAddToCart = async (product: Product, quantity: number) => {
    addItem(product, quantity);
    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
        "flex flex-col md:flex-col h-full",
        // Mobile: horizontal layout with auto height
        "md:max-h-none min-h-[140px] md:h-auto",
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
        <div className="flex-1 p-3 flex flex-col min-w-0">
          {/* Product Name - Top */}
          <div className="mb-3 text-center">
            <h3 className="font-semibold text-base text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
              {product.name}
            </h3>
          </div>

          {/* Prices - Horizontal layout */}
          <div className="mb-3">
            <PriceDisplay
              price={product.price}
              specialPrice={product.specialPrice}
              specialQty={product.specialPriceMinQty}
              currentQty={quantity}
              pricesUnlocked={pricesUnlocked}
            />
          </div>

          {/* Quantity Selector - Centered */}
          <div className="mb-3 flex justify-center">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              specialQty={product.specialPriceMinQty}
            />
          </div>
            
            
          {/* Add to Cart Section - Mobile */}
          <div className="mt-auto">
            <AddToCartSection
              product={product}
              quantity={quantity}
              pricesUnlocked={pricesUnlocked}
              onAddToCart={handleAddToCart}
              onRequestWhatsApp={onRequestWhatsApp}
            />
            
            {/* Cart indicator if item is in cart */}
            {cartQuantity > 0 && (
              <div className="text-xs text-green-600 text-center mt-1">
                {cartQuantity} no carrinho
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
          
        </div>

        {/* Content - Bottom on desktop */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Info */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 text-center whitespace-nowrap overflow-hidden text-ellipsis mb-1">
              {product.name}
            </h3>
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


          {/* Cart indicator if item is in cart */}
          {cartQuantity > 0 && (
            <div className="mb-2 text-xs text-green-600 text-center font-medium">
              {cartQuantity} no carrinho
            </div>
          )}


          {/* Add to Cart Section */}
          <div className="mt-auto">
            <AddToCartSection
              product={product}
              quantity={quantity}
              pricesUnlocked={pricesUnlocked}
              onAddToCart={handleAddToCart}
              onRequestWhatsApp={onRequestWhatsApp}
            />
          </div>
        </div>
      </div>
    </div>
  );
}