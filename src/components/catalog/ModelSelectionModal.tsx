"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getCustomPriceLabels } from "@/utils/productUtils";

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
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ModelSelectionModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  pricesUnlocked: boolean;
}

export function ModelSelectionModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  pricesUnlocked
}: ModelSelectionModalProps) {
  const [willAdd, setWillAdd] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    onAddToCart(product, 1);
    onClose();
  };

  const handleDecision = (add: boolean) => {
    setWillAdd(add);
    if (add) {
      handleAddToCart();
    } else {
      onClose();
    }
  };

  // Get custom price labels if available
  const customPriceLabels = getCustomPriceLabels(product.category.slug, product.specialPriceMinQty);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Modelos Disponíveis
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm">
              Confira os modelos compatíveis disponíveis:
            </p>
          </div>

          {/* Models Image */}
          {product.modelsImageUrl && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Image
                  src={product.modelsImageUrl}
                  alt={`Lista de modelos compatíveis para ${product.name}`}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-sm"
                  priority
                />
              </div>
            </div>
          )}

          {/* Price Info */}
          {pricesUnlocked && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">
                    {customPriceLabels?.normalLabel || "Preço atacado:"}
                  </span>
                  <p className="text-lg font-semibold text-blue-600">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
                {product.specialPrice < product.price && (
                  <div>
                    <span className="text-sm text-gray-600">
                      {customPriceLabels?.specialLabel || `Preço especial (a partir de ${product.specialPriceMinQty} un):`}
                    </span>
                    <p className="text-lg font-semibold text-green-600">
                      R$ {product.specialPrice.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Como funciona:</strong> Ao finalizar seu pedido, nosso vendedor
              entrará em contato para confirmar exatamente quais modelos você precisa
              desta categoria. Você poderá especificar as quantidades de cada modelo
              durante essa conversa.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => handleDecision(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
            
            <Button
              onClick={() => handleDecision(false)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-3 text-base font-medium"
            >
              <Minus className="w-4 h-4 mr-2" />
              Não Adicionar
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Escolheremos os modelos específicos após a confirmação do pedido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}