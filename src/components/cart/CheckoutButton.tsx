"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCheckout } from "@/hooks/useCheckout";
import { usePricesUnlocked } from "@/hooks/usePricesUnlocked";
import { SuccessModal } from "@/components/common/SuccessModal";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  quantity: number;
  appliedPrice: number;
  isSpecialPrice: boolean;
}

interface CheckoutButtonProps {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isMinOrderMet: boolean;
  onSuccess?: () => void; // Callback para limpar carrinho e fechar drawer
}

export function CheckoutButton({ 
  items, 
  totalPrice, 
  totalItems, 
  isMinOrderMet,
  onSuccess 
}: CheckoutButtonProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const whatsapp = localStorage.getItem('whatsapp');
  const { submitOrder, isLoading, isError, error, orderId, reset } = useCheckout();

  const handleCheckout = async () => {
    if (!whatsapp) {
      // Isso não deveria acontecer, mas é uma proteção
      alert('WhatsApp não encontrado. Recarregue a página.');
      return;
    }

    if (!isMinOrderMet) {
      alert(`Pedido mínimo de 30 peças. Você tem ${totalItems} peças.`);
      return;
    }

    try {
      await submitOrder({
        whatsapp,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          specialPrice: item.specialPrice,
          specialPriceMinQty: item.specialPriceMinQty,
        }))
      });

      // Sucesso - mostrar modal
      setShowSuccessModal(true);
      
      // Callback para limpar carrinho e fechar drawer
      onSuccess?.();

    } catch (err) {
      // Erro já está sendo tratado pelo hook
      console.error('Erro no checkout:', err);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    reset(); // Reset do estado do hook
  };

  const handleRetry = () => {
    reset();
    handleCheckout();
  };

  // Estados do botão
  if (isLoading) {
    return (
      <Button 
        size="lg" 
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled
      >
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Finalizando Pedido...</span>
        </div>
      </Button>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm font-medium text-center">
          {error}
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            onClick={reset}
          >
            Cancelar
          </Button>
          <Button 
            size="lg" 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleRetry}
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className={`w-full text-white ${
          isMinOrderMet 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
        onClick={handleCheckout}
        disabled={!isMinOrderMet || items.length === 0}
      >
        {isMinOrderMet ? (
          `Finalizar Pedido - R$ ${totalPrice.toFixed(2).replace('.', ',')}`
        ) : (
          `Mín. 30 peças (faltam ${30 - totalItems})`
        )}
      </Button>

      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          orderId={orderId}
          totalValue={totalPrice}
          totalItems={totalItems}
        />
      )}
    </>
  );
}