"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useTracking } from "@/contexts/TrackingContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { SpecialPriceAlert } from "@/components/cart/SpecialPriceAlert";
import { PricingBreakdown } from "@/components/cart/PricingBreakdown";
import { getSavingSuggestions } from "@/utils/savingSuggestions";
import { useEffect } from "react";

export default function CarrinhoPage() {
  const router = useRouter();
  const { 
    items, 
    totalItems, 
    totalPrice, 
    totalSavings, 
    isMinOrderMet, 
    itemsToMinOrder,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();
  
  const { trackEvent } = useTracking();

  // Calculate saving suggestions
  const savingOpportunities = getSavingSuggestions(items);

  // Track ViewCart when page loads
  useEffect(() => {
    if (items.length > 0) {
      trackEvent('ViewCart', {
        content_ids: items.map(item => item.productId),
        contents: items.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: item.appliedPrice
        })),
        value: totalPrice,
        currency: 'BRL',
        num_items: totalItems
      });
    }
  }, [items, totalPrice, totalItems, trackEvent]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  const handleAddQuantity = (productId: number, quantity: number) => {
    const currentItem = items.find(item => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + quantity);
    }
  };

  const handleContinueShopping = () => {
    router.push('/catalogo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/catalogo" className="text-orange-600 hover:text-orange-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Carrinho de Compras
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'itens'}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {items.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Seu carrinho está vazio
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Adicione produtos ao seu carrinho para começar sua compra. 
                Explore nossos kits prontos ou navegue pelo catálogo completo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto">
                    🎁 Ver Kits Prontos
                  </Button>
                </Link>
                <Link href="/catalogo">
                  <Button className="w-full sm:w-auto">
                    Ver Catálogo Completo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Special Price Alerts */}
              {savingOpportunities.length > 0 && (
                <SpecialPriceAlert
                  opportunities={savingOpportunities}
                  onApplyQuantity={handleAddQuantity}
                />
              )}

              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Itens no Carrinho
                  </h2>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <CartItem
                        key={item.productId}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <PricingBreakdown items={items} />
              </div>

              {/* Continue Shopping */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Continuar Comprando</h3>
                    <p className="text-sm text-gray-600">
                      Explore mais produtos em nosso catálogo
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleContinueShopping}
                  >
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <CartSummary
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  totalSavings={totalSavings}
                  isMinOrderMet={isMinOrderMet}
                  itemsToMinOrder={itemsToMinOrder}
                  savingOpportunities={savingOpportunities}
                  onContinueShopping={handleContinueShopping}
                  onClearCart={clearCart}
                  onAddQuantity={handleAddQuantity}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}