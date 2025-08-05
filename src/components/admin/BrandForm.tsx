'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Brand {
  id?: number
  name: string
  slug: string
  description: string | null
  displayOrder: number
  isActive: boolean
}

interface BrandFormProps {
  brand?: Brand
  onSubmit: (data: Omit<Brand, 'id'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function BrandForm({ brand, onSubmit, onCancel, loading = false }: BrandFormProps) {
  const [formData, setFormData] = useState<Omit<Brand, 'id'>>({
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || '',
        displayOrder: brand.displayOrder,
        isActive: brand.isActive
      })
    }
  }, [brand])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim()
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Auto-gerar slug quando o nome muda
      if (field === 'name' && typeof value === 'string') {
        newData.slug = generateSlug(value)
      }
      
      return newData
    })

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório'
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Ordem deve ser um número positivo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit({
        ...formData,
        description: formData.description?.trim() || null
      })
    } catch (error) {
      console.error('Erro ao salvar marca:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informações Básicas */}
      <div className="space-y-4">
        <div>
          <Input
            label="Nome da Marca *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            placeholder="Ex: Apple, Samsung, Xiaomi"
          />
        </div>

        <div>
          <Input
            label="Slug *"
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            error={errors.slug}
            placeholder="apple, samsung, xiaomi"
            help="URL amigável da marca (gerado automaticamente)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descrição opcional da marca..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <Input
            type="number"
            label="Ordem de Exibição *"
            value={formData.displayOrder.toString()}
            onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
            error={errors.displayOrder}
            placeholder="0"
            help="Menor número aparece primeiro no catálogo"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
            Marca ativa
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Salvando...' : (brand ? 'Atualizar' : 'Criar')} Marca
        </Button>
      </div>
    </form>
  )
}