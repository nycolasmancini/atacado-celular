"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartSection } from "./AddToCartSection";
import { ProductDetailModal } from "./ProductDetailModal";
import { ModelSelectionModal } from "./ModelSelectionModal";
import { useProductView } from "@/hooks/useProductView";
import { useCart } from "@/contexts/CartContext";
import { isModelSelectionProduct, getModelSelectionButtonText, getCustomPriceLabels } from "@/utils/productUtils";

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  imageUrl?: string;
  modelsImageUrl?: string;
  images?: string[];
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem, getItemQuantity } = useCart();
  
  // Check if this is a model selection product (película/capa)
  const isModelProduct = isModelSelectionProduct(product);
  
  // Get custom price labels if available
  const customPriceLabels = getCustomPriceLabels(product.category.slug, product.specialPriceMinQty);
  
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

  // Handle image click - show detail modal
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailModal(true);
  };

  // Handle eye icon click - show detail modal
  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDetailModal(true);
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
        <div className="flex-shrink-0 w-24 h-full relative group">
          <div 
            className="absolute inset-0 bg-gray-100 rounded-l-lg overflow-hidden cursor-pointer"
            onClick={handleImageClick}
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
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
          
          {/* Eye icon - Mobile */}
          <button
            onClick={handleEyeClick}
            className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            title="Ver detalhes do produto"
          >
            <Eye className="w-3 h-3 text-gray-700" />
          </button>
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
              customPriceLabels={customPriceLabels}
            />
          </div>

          {/* Quantity Selector or Model Selection Button - Centered */}
          <div className="mb-3 flex justify-center">
            {isModelProduct ? (
              pricesUnlocked ? (
                <button
                  onClick={() => setShowModelModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {getModelSelectionButtonText(product.category.slug)}
                </button>
              ) : (
                <div className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg text-center">
                  Insira seu WhatsApp para ver modelos
                </div>
              )
            ) : (
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                specialQty={product.specialPriceMinQty}
              />
            )}
          </div>
            
            
          {/* Add to Cart Section - Mobile */}
          {!isModelProduct && (
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
          )}
          
          {/* Add to Cart Section for Model Products - Mobile */}
          {isModelProduct && (
            <div className="mt-auto">
              {!pricesUnlocked && (
                <AddToCartSection
                  product={product}
                  quantity={1}
                  pricesUnlocked={pricesUnlocked}
                  onAddToCart={handleAddToCart}
                  onRequestWhatsApp={onRequestWhatsApp}
                />
              )}
              
              {/* Cart indicator for model products */}
              {cartQuantity > 0 && (
                <div className="text-xs text-green-600 text-center mt-2">
                  {cartQuantity} no carrinho
                </div>
              )}
            </div>
          )}
            
        </div>
      </div>

      {/* Desktop Layout - Vertical */}
      <div className="hidden md:flex flex-col h-full">
        {/* Image - Top on desktop */}
        <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex-shrink-0 group cursor-pointer" onClick={handleImageClick}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Eye icon - Desktop */}
          <button
            onClick={handleEyeClick}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
            title="Ver detalhes do produto"
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </button>
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
              customPriceLabels={customPriceLabels}
            />
          </div>

          {/* Quantity Selector or Model Selection Button */}
          <div className="mb-3 flex-shrink-0">
            {isModelProduct ? (
              pricesUnlocked ? (
                <button
                  onClick={() => setShowModelModal(true)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {getModelSelectionButtonText(product.category.slug)}
                </button>
              ) : (
                <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 text-sm font-medium rounded-lg text-center">
                  Insira seu WhatsApp para ver modelos
                </div>
              )
            ) : (
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                specialQty={product.specialPriceMinQty}
              />
            )}
          </div>


          {/* Cart indicator if item is in cart */}
          {cartQuantity > 0 && (
            <div className="mb-2 text-xs text-green-600 text-center font-medium">
              {cartQuantity} no carrinho
            </div>
          )}


          {/* Add to Cart Section */}
          {!isModelProduct && (
            <div className="mt-auto">
              <AddToCartSection
                product={product}
                quantity={quantity}
                pricesUnlocked={pricesUnlocked}
                onAddToCart={handleAddToCart}
                onRequestWhatsApp={onRequestWhatsApp}
              />
            </div>
          )}
          
          {/* Add to Cart Section for Model Products - Desktop */}
          {isModelProduct && !pricesUnlocked && (
            <div className="mt-auto">
              <AddToCartSection
                product={product}
                quantity={1}
                pricesUnlocked={pricesUnlocked}
                onAddToCart={handleAddToCart}
                onRequestWhatsApp={onRequestWhatsApp}
              />
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Model Selection Modal */}
      {isModelProduct && (
        <ModelSelectionModal
          product={product}
          isOpen={showModelModal}
          onClose={() => setShowModelModal(false)}
          onAddToCart={handleAddToCart}
          pricesUnlocked={pricesUnlocked}
        />
      )}
    </div>
  );
}