"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { customerName: string; whatsapp: string }) => void;
  totalValue: number;
  totalItems: number;
  currentWhatsapp: string;
  isLoading: boolean;
}

export function CheckoutModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  totalValue, 
  totalItems, 
  currentWhatsapp,
  isLoading
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [whatsapp, setWhatsapp] = useState(currentWhatsapp);
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string }>({});

  if (!isOpen) return null;

  const formatPrice = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);

  const validateForm = () => {
    const newErrors: { name?: string; whatsapp?: string } = {};

    const nameWords = customerName.trim().split(/\s+/);
    if (!customerName.trim()) {
      newErrors.name = "Nome completo é obrigatório";
    } else if (nameWords.length < 2) {
      newErrors.name = "Por favor, digite seu nome completo (nome e sobrenome)";
    } else if (customerName.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    const cleanNumber = whatsapp.replace(/\D/g, '');
    if (!whatsapp.trim()) {
      newErrors.whatsapp = "WhatsApp é obrigatório";
    } else if (cleanNumber.length < 10 || cleanNumber.length > 15) {
      newErrors.whatsapp = "Número de WhatsApp inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm({
        customerName: customerName.trim(),
        whatsapp: whatsapp.trim()
      });
    }
  };

  const handleWhatsappChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    let formatted = '';
    if (numbers.length > 0) {
      if (numbers.length <= 2) {
        formatted = `(${numbers}`;
      } else if (numbers.length <= 7) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else if (numbers.length <= 11) {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      } else {
        formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
      }
    }
    
    setWhatsapp(formatted);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Finalizar Pedido
            </h2>
            <p className="text-gray-600">
              Complete os dados abaixo para enviar seu pedido
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total de peças:</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor total:</span>
                <span className="font-bold text-orange-600">{formatPrice(totalValue)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Digite seu nome completo"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder="(11) 99999-9999"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono ${
                  errors.whatsapp ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.whatsapp && (
                <p className="text-red-600 text-xs mt-1">{errors.whatsapp}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Entraremos em contato através deste número
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-6 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-800 text-sm font-medium">Importante</p>
                <p className="text-blue-700 text-xs mt-1">
                  Seu pedido será salvo e enviado automaticamente. Um de nossos vendedores entrará em contato para finalizar o atendimento.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                'Finalizar Pedido'
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            * Campos obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
}