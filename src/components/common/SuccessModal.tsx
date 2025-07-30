"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  totalValue: number;
  totalItems: number;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  orderId, 
  totalValue, 
  totalItems 
}: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Remove confetti após animação
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNewOrder = () => {
    onClose();
    // Recarregar a página para limpar tudo e começar novo pedido
    window.location.reload();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="relative overflow-hidden">
        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center p-6">
          {/* Ícone de Sucesso */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🎉 Pedido Enviado!
          </h2>

          {/* Mensagem Principal */}
          <p className="text-gray-600 mb-4">
            Seu pedido foi enviado com sucesso para nosso WhatsApp!
          </p>

          {/* Detalhes do Pedido */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-700 space-y-1">
              {orderId && (
                <div className="flex justify-between">
                  <span className="font-medium">Pedido:</span>
                  <span className="font-mono text-xs">{orderId.slice(-8)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Total de peças:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Valor total:</span>
                <span className="font-bold text-orange-600">
                  R$ {totalValue.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Próximos passos:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Pedido recebido em nosso WhatsApp</li>
              <li>⏳ Entraremos em contato em até 1 hora</li>
              <li>📦 Confirmação e prazo de entrega</li>
            </ul>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <Button
              onClick={handleNewOrder}
              size="lg"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              🛍️ Fazer Novo Pedido
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              size="lg"
              className="w-full"
            >
              Fechar
            </Button>
          </div>

          {/* Nota Importante */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>💡 Importante:</strong> Mantenha seu WhatsApp disponível para confirmação do pedido.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}