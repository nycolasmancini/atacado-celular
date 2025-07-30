'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'

interface Product {
  id: number
  name: string
  price: number
  specialPrice: number
  specialPriceMinQty: number
  imageUrl?: string
}

interface KitProductRowProps {
  product: Product
  isSelected: boolean
  quantity: number
  onToggle: (productId: number, selected: boolean) => void
  onQuantityChange: (productId: number, quantity: number) => void
}

export function KitProductRow({
  product,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange
}: KitProductRowProps) {
  const [localQuantity, setLocalQuantity] = useState(quantity.toString())

  const handleQuantityChange = (value: string) => {
    setLocalQuantity(value)
    const numValue = parseInt(value) || 0
    if (numValue >= 0) {
      onQuantityChange(product.id, numValue)
    }
  }

  const handleQuantityBlur = () => {
    const numValue = Math.max(1, parseInt(localQuantity) || 1)
    setLocalQuantity(numValue.toString())
    onQuantityChange(product.id, numValue)
  }

  const isSpecialPrice = quantity >= product.specialPriceMinQty
  const unitPrice = isSpecialPrice ? product.specialPrice : product.price
  const subtotal = unitPrice * quantity
  const savings = isSpecialPrice ? (product.price - product.specialPrice) * quantity : 0

  return (
    <tr className={`border-b hover:bg-gray-50 transition-colors ${isSelected ? 'bg-orange-50' : ''}`}>
      {/* Checkbox */}
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onToggle(product.id, e.target.checked)}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
      </td>

      {/* Imagem */}
      <td className="p-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
      </td>

      {/* Nome */}
      <td className="p-4">
        <div className="font-medium text-gray-900">
          {product.name}
        </div>
        <div className="text-sm text-gray-500">
          ID: {product.id}
        </div>
      </td>

      {/* Preço Unitário */}
      <td className="p-4">
        <div className="space-y-1">
          <div className={`font-medium ${isSpecialPrice ? 'text-green-600' : 'text-gray-900'}`}>
            R$ {unitPrice.toFixed(2)}
            {isSpecialPrice && (
              <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">
                ESPECIAL
              </span>
            )}
          </div>
          {isSpecialPrice && (
            <div className="text-xs text-gray-500 line-through">
              R$ {product.price.toFixed(2)}
            </div>
          )}
          <div className="text-xs text-gray-400">
            Especial: {product.specialPriceMinQty}+ peças
          </div>
        </div>
      </td>

      {/* Quantidade */}
      <td className="p-4">
        <div className="w-20">
          <Input
            type="number"
            min="1"
            value={localQuantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            onBlur={handleQuantityBlur}
            disabled={!isSelected}
            className="text-center"
          />
        </div>
      </td>

      {/* Subtotal */}
      <td className="p-4">
        <div className="text-right">
          <div className="font-semibold text-gray-900">
            R$ {subtotal.toFixed(2)}
          </div>
          {savings > 0 && (
            <div className="text-sm text-green-600">
              Economia: R$ {savings.toFixed(2)}
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}