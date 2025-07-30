'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { KitProductRow } from './KitProductRow'
import { useKitCalculator } from '@/hooks/useKitCalculator'

interface Product {
  id: number
  name: string
  price: number
  specialPrice: number
  specialPriceMinQty: number
  imageUrl?: string
  category: {
    name: string
  }
}

interface Kit {
  id: number
  name: string
  description?: string
  discount?: number
  items: Array<{
    productId: number
    quantity: number
  }>
}

interface KitEditorProps {
  kit: Kit
  products: Product[]
  onSave: (kitData: {
    name: string
    description: string
    discount: number
    items: Array<{ productId: number; quantity: number }>
  }) => Promise<void>
}

export function KitEditor({ kit, products, onSave }: KitEditorProps) {
  const [name, setName] = useState(kit.name)
  const [description, setDescription] = useState(kit.description || '')
  const [discount, setDiscount] = useState(kit.discount || 0)
  const [searchTerm, setSearchTerm] = useState('')
  const [kitItems, setKitItems] = useState(kit.items)
  const [saving, setSaving] = useState(false)

  // Filtrar produtos por busca
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    
    const term = searchTerm.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.name.toLowerCase().includes(term)
    )
  }, [products, searchTerm])

  // Calcular totais usando o hook
  const calculation = useKitCalculator(products, kitItems)

  const handleToggleProduct = (productId: number, selected: boolean) => {
    if (selected) {
      // Adicionar produto se não existir
      if (!kitItems.find(item => item.productId === productId)) {
        setKitItems(prev => [...prev, { productId, quantity: 1 }])
      }
    } else {
      // Remover produto
      setKitItems(prev => prev.filter(item => item.productId !== productId))
    }
  }

  const handleQuantityChange = (productId: number, quantity: number) => {
    setKitItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const handleSave = async () => {
    if (!calculation.isValid) return
    
    setSaving(true)
    try {
      await onSave({
        name,
        description,
        discount,
        items: kitItems
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Dados Básicos */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Básicos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Kit *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome do kit..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do kit..."
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-orange-800">
                Desconto Manual
              </h3>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-orange-700 mb-2">
                Desconto em Reais (R$)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-orange-600 text-sm font-medium">R$</span>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  placeholder="0,00"
                  className="pl-10 border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
              <div className="text-sm text-orange-700">
                <div className="font-medium mb-2">💡 Exemplo de uso:</div>
                <div className="text-xs space-y-1 mb-3">
                  <div>• Valor calculado: R$ {calculation.totalPrice.toFixed(2)}</div>
                  <div>• Desconto: - R$ {discount.toFixed(2)}</div>
                  <div className="font-medium border-t border-orange-200 pt-1 mt-1">
                    = Preço final: R$ {(calculation.totalPrice - discount).toFixed(2)}
                  </div>
                </div>
                
                {calculation.totalPrice > 0 && (
                  <div className="border-t border-orange-200 pt-2">
                    <div className="text-xs font-medium mb-2">⚡ Atalhos rápidos:</div>
                    <div className="flex gap-1 flex-wrap">
                      {[5, 10, 15, 20].map(percent => {
                        const discountValue = (calculation.totalPrice * percent) / 100
                        return (
                          <button
                            key={percent}
                            type="button"
                            onClick={() => setDiscount(Number(discountValue.toFixed(2)))}
                            className="px-2 py-1 text-xs bg-orange-200 hover:bg-orange-300 text-orange-800 rounded transition-colors"
                          >
                            {percent}% (R$ {discountValue.toFixed(2)})
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Produtos do Kit
            </h2>
            
            <div className="w-full md:w-80">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Selecionar todos os produtos filtrados
                        const newItems = filteredProducts.map(product => ({
                          productId: product.id,
                          quantity: kitItems.find(item => item.productId === product.id)?.quantity || 1
                        }))
                        setKitItems(newItems)
                      } else {
                        // Deselecionar todos
                        setKitItems([])
                      }
                    }}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Imagem</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Produto</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Preço</th>
                <th className="p-4 text-left text-sm font-medium text-gray-700">Qtd</th>
                <th className="p-4 text-right text-sm font-medium text-gray-700">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const kitItem = kitItems.find(item => item.productId === product.id)
                const isSelected = !!kitItem
                const quantity = kitItem?.quantity || 1

                return (
                  <KitProductRow
                    key={product.id}
                    product={product}
                    isSelected={isSelected}
                    quantity={quantity}
                    onToggle={handleToggleProduct}
                    onQuantityChange={handleQuantityChange}
                  />
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum produto encontrado
          </div>
        )}
      </div>

      {/* Preview do Total */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resumo do Kit
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Produtos</div>
            <div className="text-2xl font-bold text-gray-900">
              {kitItems.length}
            </div>
            <div className="text-xs text-gray-500">
              Mínimo: 5 produtos
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Peças Totais</div>
            <div className="text-2xl font-bold text-gray-900">
              {calculation.totalQuantity}
            </div>
            <div className="text-xs text-gray-500">
              Mínimo: 30 peças
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-orange-800">Valor Calculado</div>
            <div className="text-xl font-bold text-orange-900">
              R$ {calculation.totalPrice.toFixed(2)}
            </div>
            {discount > 0 && (
              <div className="text-xs text-red-600">
                - R$ {discount.toFixed(2)} desconto
              </div>
            )}
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-800">Economia Total</div>
            <div className="text-xl font-bold text-green-900">
              R$ {(calculation.totalSavings + discount).toFixed(2)}
            </div>
            <div className="text-xs text-green-600">
              {calculation.totalSavings > 0 && `Qtd: R$ ${calculation.totalSavings.toFixed(2)}`}
              {calculation.totalSavings > 0 && discount > 0 && ' + '}
              {discount > 0 && `Extra: R$ ${discount.toFixed(2)}`}
            </div>
          </div>
        </div>
        
        {/* Cálculo detalhado do preço */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📊 Cálculo do Preço Final
            </h3>
          </div>
          
          <div className="space-y-3 max-w-md mx-auto">
            {/* Valor calculado */}
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="text-blue-700">Valor dos produtos:</span>
              <span className="font-semibold text-blue-900">
                R$ {calculation.totalPrice.toFixed(2)}
              </span>
            </div>
            
            {/* Desconto manual */}
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="text-blue-700">Desconto manual:</span>
              <span className="font-semibold text-red-600">
                - R$ {discount.toFixed(2)}
              </span>
            </div>
            
            {/* Linha de economia por quantidade */}
            {calculation.totalSavings > 0 && (
              <div className="flex justify-between items-center py-2 text-sm border-b border-blue-200">
                <span className="text-green-700">Economia por quantidade:</span>
                <span className="font-medium text-green-600">
                  - R$ {calculation.totalSavings.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Total final */}
            <div className="flex justify-between items-center py-3 bg-white/80 rounded-lg px-4 border-2 border-blue-300">
              <span className="text-lg font-bold text-blue-800">Preço Final:</span>
              <span className="text-2xl font-bold text-blue-900">
                R$ {(calculation.totalPrice - discount).toFixed(2)}
              </span>
            </div>
            
            {/* Economia total */}
            {(calculation.totalSavings + discount) > 0 && (
              <div className="text-center bg-green-100 rounded-lg p-3 border border-green-300">
                <div className="text-sm text-green-700">
                  🎉 <strong>Economia total:</strong> R$ {(calculation.totalSavings + discount).toFixed(2)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {discount > 0 && `Desconto: R$ ${discount.toFixed(2)}`}
                  {discount > 0 && calculation.totalSavings > 0 && ' + '}
                  {calculation.totalSavings > 0 && `Quantidade: R$ ${calculation.totalSavings.toFixed(2)}`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Validações */}
        {calculation.validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Erros de Validação:
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {calculation.validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!calculation.isValid || !name.trim() || saving}
            loading={saving}
          >
            Salvar Kit
          </Button>
          
          <Button variant="outline">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}