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
  whatsapp?: string;
  onChangeWhatsApp?: () => void;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  orderId, 
  totalValue, 
  totalItems,
  whatsapp,
  onChangeWhatsApp
}: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showChangeWhatsAppModal, setShowChangeWhatsAppModal] = useState(false);
  const [isEditingWhatsapp, setIsEditingWhatsapp] = useState(false);
  const [newWhatsapp, setNewWhatsapp] = useState(whatsapp || '');
  const [isUpdating, setIsUpdating] = useState(false);


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

  const handleUpdateWhatsapp = async () => {
    if (!orderId || !newWhatsapp.trim()) return;
    
    // Validação básica do WhatsApp
    const cleanNumber = newWhatsapp.replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      alert('Por favor, informe um número de WhatsApp válido');
      return;
    }

    setIsUpdating(true);
    
    try {
      const response = await fetch('/api/orders/update-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          newWhatsapp: cleanNumber,
          previousWhatsapp: whatsapp
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar WhatsApp');
      }

      // Atualizar localStorage também
      localStorage.setItem('whatsapp', cleanNumber);
      
      // Sair do modo de edição
      setIsEditingWhatsapp(false);
      
      // Mostrar feedback de sucesso
      alert('WhatsApp atualizado com sucesso!');
      
      // Recarregar para refletir as mudanças
      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao atualizar WhatsApp:', error);
      alert('Erro ao atualizar WhatsApp. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setNewWhatsapp(whatsapp || '');
    setIsEditingWhatsapp(false);
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

          {/* Mensagem sobre Vendedor */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
              <span className="mr-2">👥</span>
              Atendimento Personalizado
            </h3>
            <p className="text-sm text-orange-700 mb-2">
              <strong>Um dos nossos vendedores entrará em contato</strong> para finalizar seu pedido e esclarecer qualquer dúvida.
            </p>
            <p className="text-xs text-orange-600">
              💬 <strong>Já tem um vendedor te atendendo?</strong> Chame no WhatsApp que já está em contato para agilizar seu pedido!
            </p>
          </div>

          {/* WhatsApp de Contato */}
          {whatsapp && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="mr-2">📱</span>
                WhatsApp de Contato
              </h3>
              
              {!isEditingWhatsapp ? (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-700">
                    <p className="mb-1">Entraremos em contato pelo número:</p>
                    <p className="font-mono font-bold text-green-800 bg-green-100 px-2 py-1 rounded">
                      {whatsapp}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingWhatsapp(true)}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    ✏️ Editar
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-green-700">
                    <p className="mb-2">Digite o novo número de WhatsApp:</p>
                    <input
                      type="tel"
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      placeholder="Ex: 11987654321"
                      className="w-full px-3 py-2 border border-green-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1 border-gray-300 text-gray-700"
                      disabled={isUpdating}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUpdateWhatsapp}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={isUpdating || !newWhatsapp.trim()}
                    >
                      {isUpdating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Salvando...</span>
                        </div>
                      ) : (
                        '✓ Salvar'
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-green-600 mt-2">
                💡 <strong>Número errado?</strong> Clique em "Editar" para alterar diretamente aqui.
              </p>
            </div>
          )}

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

      {/* Modal de Confirmação para Trocar WhatsApp */}
      {showChangeWhatsAppModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Alteração de WhatsApp
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Ao trocar o WhatsApp, você será redirecionado para o início do processo. 
                O pedido atual será mantido, mas você precisará informar um novo número.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Importante:</strong> O pedido #{orderId?.replace('ORDER-', '') || 'atual'} já foi registrado 
                  com o número {whatsapp}. O novo número será usado apenas para contatos futuros.
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowChangeWhatsAppModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setShowChangeWhatsAppModal(false);
                  if (onChangeWhatsApp) {
                    onChangeWhatsApp();
                  }
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}