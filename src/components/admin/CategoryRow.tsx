'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface Category {
  id: number
  name: string
  slug: string
  _count: {
    products: number
  }
}

interface CategoryRowProps {
  category: Category
  onUpdate: (id: number, name: string) => Promise<boolean>
  onDelete: (id: number) => void
}

export function CategoryRow({ category, onUpdate, onDelete }: CategoryRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(category.name)
  const [isUpdating, setIsUpdating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEdit = () => {
    setIsEditing(true)
    setEditName(category.name)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditName(category.name)
  }

  const handleSave = async () => {
    if (!editName.trim() || editName.trim() === category.name) {
      handleCancel()
      return
    }

    setIsUpdating(true)
    const success = await onUpdate(category.id, editName.trim())
    setIsUpdating(false)
    
    if (success) {
      setIsEditing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const canDelete = category._count.products === 0

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            disabled={isUpdating}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
          />
        ) : (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors text-left"
          >
            {category.name}
          </button>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-500">
          {category._count.products} produto{category._count.products !== 1 ? 's' : ''}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                loading={isUpdating}
                disabled={!editName.trim() || editName.trim() === category.name}
              >
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
              >
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(category.id)}
                disabled={!canDelete}
                className={!canDelete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'}
                title={!canDelete ? 'Não é possível deletar categoria com produtos' : 'Deletar categoria'}
              >
                Deletar
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}