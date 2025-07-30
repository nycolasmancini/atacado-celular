"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
}

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  pricesUnlocked: boolean;
  onAddToCart: (product: Product, quantity: number) => void;
  className?: string;
}

export function AddToCartSection({ 
  product, 
  quantity, 
  pricesUnlocked,
  onAddToCart,
  className 
}: AddToCartSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const getApplicablePrice = (product: Product, qty: number) => {
    if (qty >= product.specialPriceMinQty) {
      return product.specialPrice;
    }
    return product.price;
  };

  const applicablePrice = getApplicablePrice(product, quantity);
  const totalPrice = applicablePrice * quantity;

  const handleAddToCart = async () => {
    if (!pricesUnlocked || quantity <= 0) return;

    setIsAdding(true);
    
    try {
      await onAddToCart(product, quantity);
      
      // Show success feedback
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  if (!pricesUnlocked) {
    return (
      <div className={cn("space-y-2", className)}>
        <Button 
          variant="outline" 
          fullWidth 
          disabled
          className="bg-orange-100 text-orange-800 border-orange-200"
        >
          🔒 Libere preços para comprar
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Total Display */}
      {quantity > 0 && (
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-sm text-gray-600 mb-1">
            Total ({quantity} unidades):
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(totalPrice)}
          </div>
          <div className="text-xs text-gray-500">
            {formatPrice(applicablePrice)} por unidade
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={quantity <= 0 || isAdding}
        loading={isAdding}
        fullWidth
        className={cn(
          "transition-all duration-200",
          justAdded && "bg-green-500 hover:bg-green-600 text-white"
        )}
      >
        {justAdded ? (
          <>
            <span className="mr-2">✓</span>
            Adicionado!
          </>
        ) : (
          <>
            {quantity > 0 ? (
              <>Adicionar {quantity} ao carrinho</>
            ) : (
              "Selecione a quantidade"
            )}
          </>
        )}
      </Button>

      {/* Minimum Order Notice */}
      <div className="text-xs text-gray-500 text-center">
        Pedido mínimo: 30 peças no total
      </div>
    </div>
  );
}