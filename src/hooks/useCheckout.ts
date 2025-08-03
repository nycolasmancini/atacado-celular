"use client";

import { useState } from "react";
import { useTracking } from "@/contexts/TrackingContext";

interface CheckoutState {
  status: 'idle' | 'loading' | 'success' | 'error';
  orderId?: string;
  error?: string;
}

interface CheckoutData {
  whatsapp: string;
  items: Array<{
    productId: number;
    quantity: number;
    name: string;
    price: number;
    specialPrice?: number;
    specialPriceMinQty?: number;
  }>;
  sessionId: string;
}

export function useCheckout() {
  const [state, setState] = useState<CheckoutState>({ status: 'idle' });
  const { trackEvent, trackCustomEvent, sessionId } = useTracking();

  const submitOrder = async (data: Omit<CheckoutData, 'sessionId'>) => {
    setState({ status: 'loading' });

    try {
      // Ensure we have a valid sessionId
      if (!sessionId) {
        throw new Error('Sessão não inicializada. Recarregue a página.');
      }
      // Tracking - InitiateCheckout
      trackEvent('InitiateCheckout', {
        value: data.items.reduce((sum, item) => {
          const isSpecial = item.specialPrice && item.specialPriceMinQty && 
                           item.quantity >= item.specialPriceMinQty;
          const price = isSpecial ? item.specialPrice! : item.price;
          return sum + (price * item.quantity);
        }, 0),
        currency: 'BRL',
        content_ids: data.items.map(item => item.productId),
        contents: data.items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: (() => {
            const isSpecial = item.specialPrice && item.specialPriceMinQty && 
                             item.quantity >= item.specialPriceMinQty;
            return isSpecial ? item.specialPrice! : item.price;
          })()
        }))
      });

      const response = await fetch('/api/order/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sessionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Erro ao processar pedido');
      }

      if (!result.success) {
        throw new Error(result.error?.message || 'Falha ao finalizar pedido');
      }

      // Sucesso - Tracking Purchase
      const totalValue = data.items.reduce((sum, item) => {
        const isSpecial = item.specialPrice && item.specialPriceMinQty && 
                         item.quantity >= item.specialPriceMinQty;
        const price = isSpecial ? item.specialPrice! : item.price;
        return sum + (price * item.quantity);
      }, 0);

      trackEvent('Purchase', {
        value: totalValue,
        currency: 'BRL',
        transaction_id: result.orderId,
        content_ids: data.items.map(item => item.productId),
        contents: data.items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: (() => {
            const isSpecial = item.specialPrice && item.specialPriceMinQty && 
                             item.quantity >= item.specialPriceMinQty;
            return isSpecial ? item.specialPrice! : item.price;
          })()
        }))
      });

      // Evento customizado
      trackCustomEvent('OrderCompleted', {
        order_id: result.orderId,
        total_items: data.items.reduce((sum, item) => sum + item.quantity, 0),
        total_value: totalValue,
        whatsapp_hash: btoa(data.whatsapp).slice(0, 10), // Hash para privacidade
        products: data.items.map(item => ({
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
          has_special_price: item.specialPrice && item.specialPriceMinQty && 
                           item.quantity >= item.specialPriceMinQty
        }))
      });

      setState({ 
        status: 'success', 
        orderId: result.orderId 
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState({ 
        status: 'error', 
        error: errorMessage 
      });
      throw error;
    }
  };

  const reset = () => {
    setState({ status: 'idle' });
  };

  return {
    ...state,
    submitOrder,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}