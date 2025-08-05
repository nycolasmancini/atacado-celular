'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

interface BrandTableProps {
  brands: Brand[]
  onEdit: (brand: Brand) => void
  onDelete: (id: number) => void
  onReorder: (brands: Brand[]) => void
  loading?: boolean
}

export default function BrandTable({ brands, onEdit, onDelete, onReorder, loading = false }: BrandTableProps) {
  const [draggedItem, setDraggedItem] = useState<Brand | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, brand: Brand) => {
    setDraggedItem(brand)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (!draggedItem) return

    const dragIndex = brands.findIndex(b => b.id === draggedItem.id)
    if (dragIndex === dropIndex) {
      setDraggedItem(null)
      setDragOverIndex(null)
      return
    }

    const newBrands = [...brands]
    const [removed] = newBrands.splice(dragIndex, 1)
    newBrands.splice(dropIndex, 0, removed)

    onReorder(newBrands)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Marcas</h3>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma marca encontrada</h3>
        <p className="text-gray-600">Comece criando sua primeira marca.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Marcas ({brands.length})</h3>
        <p className="text-sm text-gray-600 mt-1">
          Arraste e solte para reordenar
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ordem
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produtos
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((brand, index) => (
              <tr
                key={brand.id}
                draggable
                onDragStart={(e) => handleDragStart(e, brand)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  hover:bg-gray-50 cursor-move transition-colors
                  ${draggedItem?.id === brand.id ? 'opacity-50' : ''}
                  ${dragOverIndex === index ? 'bg-blue-50 border-blue-200' : ''}
                `}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-gray-400 mr-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {brand.displayOrder}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {brand.name}
                    </div>
                    {brand.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {brand.description}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {brand.slug}
                  </code>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {brand._count.products} produto{brand._count.products !== 1 ? 's' : ''}
                  </span>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    brand.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {brand.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(brand)}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(brand.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={brand._count.products > 0}
                    title={brand._count.products > 0 ? 'Não é possível excluir marca com produtos' : ''}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}