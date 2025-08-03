'use client'

import { useState, useEffect } from 'react'
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, type ProductData } from './actions'
import ProductTable from '@/components/admin/ProductTable'
import ProductForm from '@/components/admin/ProductForm'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'

interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  specialPrice: number
  specialPriceMinQty: number
  categoryId: number
  imageUrl: string | null
  isActive: boolean
  category: {
    id: number
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        getProducts(),
        getCategories()
      ])

      if (productsResult.success) {
        setProducts(productsResult.data || [])
      } else {
        setError(productsResult.error || 'Erro ao carregar produtos')
      }

      if (categoriesResult.success) {
        setCategories(categoriesResult.data || [])
      } else {
        setError(categoriesResult.error || 'Erro ao carregar categorias')
      }
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const result = await deleteProduct(id)
      if (result.success) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert(result.error || 'Erro ao excluir produto')
      }
    } catch (error) {
      alert('Erro ao excluir produto')
      console.error('Erro ao excluir produto:', error)
    }
  }

  const handleSubmitForm = async (data: ProductData) => {
    setFormLoading(true)
    try {
      const result = editingProduct 
        ? await updateProduct(editingProduct.id, data)
        : await createProduct(data)

      if (result.success) {
        setShowForm(false)
        setEditingProduct(null)
        await loadData() // Recarregar dados para refletir mudanças
      } else {
        alert(result.error || 'Erro ao salvar produto')
      }
    } catch (error) {
      alert('Erro ao salvar produto')
      console.error('Erro ao salvar produto:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Erro</div>
          <div className="text-red-600 mt-1">{error}</div>
          <Button 
            onClick={loadData} 
            variant="outline" 
            className="mt-3"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Produtos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie os produtos do catálogo com sistema de preços especiais
          </p>
        </div>
        
        <Button onClick={handleCreateProduct}>
          Novo Produto
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total de Produtos</div>
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Produtos Ativos</div>
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.isActive).length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Produtos Inativos</div>
          <div className="text-2xl font-bold text-red-600">
            {products.filter(p => !p.isActive).length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Categorias</div>
          <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
        </div>
      </div>

      {/* Tabela */}
      <ProductTable
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
      />

      {/* Modal do Formulário */}
      <Modal
        isOpen={showForm}
        onClose={handleCancelForm}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        size="lg"
      >
        <ProductForm
          product={editingProduct || undefined}
          categories={categories}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      </Modal>
      </div>
    </ProtectedRoute>
  )
}