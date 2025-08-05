'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Category {
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

interface CategoryTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
  onReorder: (categories: Category[]) => void
  loading?: boolean
}

export default function CategoryTable({ categories, onEdit, onDelete, onReorder, loading = false }: CategoryTableProps) {
  const [draggedItem, setDraggedItem] = useState<Category | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, category: Category) => {
    setDraggedItem(category)
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

    const dragIndex = categories.findIndex(c => c.id === draggedItem.id)
    if (dragIndex === dropIndex) {
      setDraggedItem(null)
      setDragOverIndex(null)
      return
    }

    const newCategories = [...categories]
    const [removed] = newCategories.splice(dragIndex, 1)
    newCategories.splice(dropIndex, 0, removed)

    onReorder(newCategories)
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
          <h3 className="text-lg font-medium">Categorias</h3>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma categoria encontrada</h3>
        <p className="text-gray-600">Comece criando sua primeira categoria.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium">Categorias ({categories.length})</h3>
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
                Categoria
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
            {categories.map((category, index) => (
              <tr
                key={category.id}
                draggable
                onDragStart={(e) => handleDragStart(e, category)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  hover:bg-gray-50 cursor-move transition-colors
                  ${draggedItem?.id === category.id ? 'opacity-50' : ''}
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
                      {category.displayOrder}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category._count.products} produto{category._count.products !== 1 ? 's' : ''}
                  </span>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    category.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {category.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={category._count.products > 0}
                    title={category._count.products > 0 ? 'Não é possível excluir categoria com produtos' : ''}
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