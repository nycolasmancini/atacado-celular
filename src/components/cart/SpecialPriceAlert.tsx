"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface SavingOpportunity {
  productId: number;
  productName: string;
  currentQty: number;
  qtyNeeded: number;
  potentialSaving: number;
}

interface SpecialPriceAlertProps {
  opportunities: SavingOpportunity[];
  onApplyQuantity: (productId: number, quantity: number) => void;
  onDismiss?: () => void;
}

export function SpecialPriceAlert({ opportunities, onApplyQuantity, onDismiss }: SpecialPriceAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const topOpportunity = opportunities[0];
  const totalPotentialSavings = opportunities.reduce((sum, opp) => sum + opp.potentialSaving, 0);

  const handleApply = (opportunity: SavingOpportunity) => {
    onApplyQuantity(opportunity.productId, opportunity.qtyNeeded);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed || opportunities.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-4 m-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Dica de Economia Inteligente
          </h3>
          
          {opportunities.length === 1 ? (
            <div className="space-y-2">
              <p className="text-sm text-yellow-700">
                Adicione mais <strong>{topOpportunity.qtyNeeded} unidades</strong> de{' '}
                <strong>{topOpportunity.productName}</strong> e economize{' '}
                <strong className="text-green-600">{formatPrice(topOpportunity.potentialSaving)}</strong>!
              </p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleApply(topOpportunity)}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
                >
                  Aplicar (+{topOpportunity.qtyNeeded})
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-yellow-700">
                Você tem <strong>{opportunities.length} oportunidades</strong> de economia.
                Economia total possível: <strong className="text-green-600">{formatPrice(totalPotentialSavings)}</strong>
              </p>
              
              <div className="space-y-1">
                {opportunities.slice(0, 2).map((opportunity) => (
                  <div key={opportunity.productId} className="flex items-center justify-between text-xs bg-white/50 rounded px-2 py-1">
                    <span className="text-yellow-800">
                      <strong>{opportunity.productName}</strong>: +{opportunity.qtyNeeded} = {formatPrice(opportunity.potentialSaving)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApply(opportunity)}
                      className="text-xs px-2 py-1 h-auto bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
                    >
                      Aplicar
                    </Button>
                  </div>
                ))}
                
                {opportunities.length > 2 && (
                  <div className="text-xs text-yellow-600 text-center pt-1">
                    +{opportunities.length - 2} outras oportunidades
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100 w-6 h-6 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}