'use client'

import { useState, useEffect } from 'react'
import { validatePricing } from '@/lib/pricing'
import PricingFields from './PricingFields'
import ImageUpload from './ImageUpload'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id?: number
  name: string
  slug: string
  description: string
  price: number
  specialPrice: number
  specialPriceMinQty: number
  categoryId: number
  imageUrl: string
  imagePublicId?: string
  isActive: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export default function ProductForm({
  product,
  categories,
  onSubmit,
  onCancel,
  loading = false
}: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    specialPrice: 0,
    specialPriceMinQty: 100,
    categoryId: categories[0]?.id || 0,
    imageUrl: '',
    imagePublicId: '',
    isActive: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previousImagePublicId, setPreviousImagePublicId] = useState<string>('')

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: Number(product.price),
        specialPrice: Number(product.specialPrice),
        specialPriceMinQty: product.specialPriceMinQty,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        imagePublicId: product.imagePublicId || '',
        isActive: product.isActive
      })
      setPreviousImagePublicId(product.imagePublicId || '')
    }
  }, [product])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'name' && !product) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }))
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageChange = async (url: string, publicId?: string) => {
    // Se havia uma imagem anterior e uma nova foi carregada, deletar a antiga
    if (previousImagePublicId && publicId && previousImagePublicId !== publicId) {
      try {
        await deleteImage(previousImagePublicId)
      } catch (error) {
        console.error('Erro ao deletar imagem anterior:', error)
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      imageUrl: url,
      imagePublicId: publicId || ''
    }))

    if (publicId) {
      setPreviousImagePublicId(publicId)
    }
  }

  const handleImageRemove = async () => {
    if (formData.imagePublicId) {
      try {
        await deleteImage(formData.imagePublicId)
      } catch (error) {
        console.error('Erro ao deletar imagem:', error)
      }
    }

    setFormData(prev => ({ 
      ...prev, 
      imageUrl: '',
      imagePublicId: ''
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória'
    }

    const pricingValidation = validatePricing(
      formData.price,
      formData.specialPrice,
      formData.specialPriceMinQty
    )

    if (!pricingValidation.isValid) {
      newErrors.pricing = pricingValidation.errors.join(', ')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Informações Básicas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Informações Básicas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Nome do Produto *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Ex: Capinha iPhone Premium"
            />
          </div>

          <div>
            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              error={errors.slug}
              placeholder="capinha-iphone-premium"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Descrição detalhada do produto..."
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleInputChange('categoryId', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
          )}
        </div>

        <div className="mt-4">
          <ImageUpload
            value={formData.imageUrl}
            onChange={handleImageChange}
            onRemove={handleImageRemove}
            disabled={loading}
          />
        </div>

        <div className="mt-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Produto ativo</span>
          </label>
        </div>
      </div>

      {/* Configuração de Preços */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Configuração de Preços
        </h3>
        
        <PricingFields
          price={formData.price}
          specialPrice={formData.specialPrice}
          specialPriceMinQty={formData.specialPriceMinQty}
          onChange={handleInputChange}
          errors={errors.pricing ? [errors.pricing] : []}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3">
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
          loading={loading}
          disabled={loading}
        >
          {product ? 'Atualizar' : 'Criar'} Produto
        </Button>
      </div>
    </form>
  )
}