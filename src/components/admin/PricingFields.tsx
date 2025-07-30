'use client'

import { useState, useEffect } from 'react'
import { calculateDiscount, calculateSavings, validatePricing } from '@/lib/pricing'

interface PricingFieldsProps {
  price: number
  specialPrice: number
  specialPriceMinQty: number
  onChange: (field: string, value: number) => void
  errors?: string[]
}

const QUANTITY_SUGGESTIONS = [30, 50, 100, 200]

export default function PricingFields({
  price,
  specialPrice,
  specialPriceMinQty,
  onChange,
  errors = []
}: PricingFieldsProps) {
  const [discount, setDiscount] = useState('0')
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    if (price > 0 && specialPrice > 0) {
      setDiscount(calculateDiscount(price, specialPrice))
      setSavings(calculateSavings(price, specialPrice, specialPriceMinQty))
    }
  }, [price, specialPrice, specialPriceMinQty])

  const formatCurrency = (value: number) => {
    return value.toFixed(2).replace('.', ',')
  }

  const parseCurrency = (value: string) => {
    return parseFloat(value.replace(',', '.')) || 0
  }

  const validation = validatePricing(price, specialPrice, specialPriceMinQty)

  return (
    <div className="space-y-6">
      {/* Preços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Normal *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <input
              type="text"
              value={formatCurrency(price)}
              onChange={(e) => onChange('price', parseCurrency(e.target.value))}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0,00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço Especial *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              R$
            </span>
            <input
              type="text"
              value={formatCurrency(specialPrice)}
              onChange={(e) => onChange('specialPrice', parseCurrency(e.target.value))}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0,00"
            />
          </div>
        </div>
      </div>

      {/* Quantidade Mínima */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantidade Mínima para Preço Especial
        </label>
        
        {/* Sugestões de quantidade */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUANTITY_SUGGESTIONS.map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => onChange('specialPriceMinQty', qty)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                specialPriceMinQty === qty
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {qty} un
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={specialPriceMinQty}
            onChange={(e) => onChange('specialPriceMinQty', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10</span>
            <span className="font-medium text-gray-700">{specialPriceMinQty} unidades</span>
            <span>500</span>
          </div>
        </div>

        {/* Input manual */}
        <div className="mt-3">
          <input
            type="number"
            min="10"
            value={specialPriceMinQty}
            onChange={(e) => onChange('specialPriceMinQty', parseInt(e.target.value) || 10)}
            className="w-24 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-500">unidades</span>
        </div>
      </div>

      {/* Preview da Economia */}
      {price > 0 && specialPrice > 0 && specialPrice < price && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Economia para o Cliente</h4>
            <span className="text-2xl font-bold text-green-600">{discount}% OFF</span>
          </div>
          <p className="text-sm text-green-700">
            Cliente economiza <strong>R$ {formatCurrency(savings)}</strong> comprando {specialPriceMinQty} unidades
          </p>
          <div className="mt-2 text-xs text-green-600">
            Preço unitário: R$ {formatCurrency(specialPrice)} vs R$ {formatCurrency(price)}
          </div>
        </div>
      )}

      {/* Erros de Validação */}
      {!validation.isValid && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Problemas encontrados:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}