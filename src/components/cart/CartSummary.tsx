"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CheckoutButton } from "./CheckoutButton";
import { useCart } from "@/contexts/CartContext";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  isMinOrderMet: boolean;
  itemsToMinOrder: number;
  savingOpportunities: Array<{
    productId: number;
    productName: string;
    currentQty: number;
    qtyNeeded: number;
    potentialSaving: number;
  }>;
  onContinueShopping: () => void;
  onClearCart: () => void;
  onAddQuantity: (productId: number, quantity: number) => void;
}

export function CartSummary({
  totalItems,
  totalPrice,
  totalSavings,
  isMinOrderMet,
  itemsToMinOrder,
  savingOpportunities,
  onContinueShopping,
  onClearCart,
  onAddQuantity
}: CartSummaryProps) {
  const { items, clearCart } = useCart();
  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const totalPotentialSavings = savingOpportunities.reduce(
    (sum, opp) => sum + opp.potentialSaving, 
    0
  );

  const savingsPercentage = totalSavings > 0 
    ? ((totalSavings / (totalPrice + totalSavings)) * 100).toFixed(1)
    : 0;

  return (
    <div className="border-t bg-white p-4 space-y-4">
      {/* Order Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Pedido mínimo:</span>
          <span className={cn(
            "font-medium",
            isMinOrderMet ? "text-green-600" : "text-orange-600"
          )}>
            {totalItems}/30 peças
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isMinOrderMet ? "bg-green-500" : "bg-orange-500"
            )}
            style={{ width: `${Math.min(100, (totalItems / 30) * 100)}%` }}
          />
        </div>
        
        {!isMinOrderMet && (
          <p className="text-xs text-gray-600 text-center">
            Faltam {itemsToMinOrder} peças para o pedido mínimo
          </p>
        )}
      </div>

      {/* Savings Opportunities */}
      {savingOpportunities.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            💡 Oportunidades de Economia
          </h4>
          <div className="space-y-2">
            {savingOpportunities.slice(0, 2).map((opportunity) => (
              <div key={opportunity.productId} className="flex items-center justify-between text-xs">
                <div className="flex-1 pr-2">
                  <span className="text-blue-800">
                    <strong>{opportunity.productName}</strong>
                  </span>
                  <div className="text-blue-600">
                    Adicione +{opportunity.qtyNeeded} unidades
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">
                    {formatPrice(opportunity.potentialSaving)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddQuantity(opportunity.productId, opportunity.qtyNeeded)}
                    className="text-xs px-2 py-1 h-auto mt-1"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            ))}
            
            {totalPotentialSavings > 0 && (
              <div className="border-t border-blue-200 pt-2 text-xs text-blue-800">
                <strong>Total de economia possível: {formatPrice(totalPotentialSavings)}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Economics Section */}
      {totalSavings > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            🎉 Economia Total
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-800">
              Você está economizando:
            </span>
            <div className="text-right">
              <div className="font-bold text-green-600">
                {formatPrice(totalSavings)}
              </div>
              <div className="text-xs text-green-600">
                ({savingsPercentage}% de desconto)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 border-t pt-4">
        {totalSavings > 0 && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Preço sem desconto:</span>
              <span className="text-gray-500 line-through">
                {formatPrice(totalPrice + totalSavings)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Desconto aplicado:</span>
              <span className="font-medium text-green-600">
                -{formatPrice(totalSavings)}
              </span>
            </div>
          </>
        )}
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold text-lg">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <CheckoutButton
          items={items}
          totalPrice={totalPrice}
          totalItems={totalItems}
          isMinOrderMet={isMinOrderMet}
          onSuccess={() => {
            clearCart();
            onContinueShopping();
          }}
        />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onContinueShopping}
            className="flex-1"
          >
            Continuar comprando
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClearCart}
            className="px-4 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}