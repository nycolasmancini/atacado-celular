'use client'

import { useState, useEffect } from 'react'
import { getBrands, createBrand, updateBrand, deleteBrand, updateBrandOrder, type BrandData } from './actions'
import BrandTable from '@/components/admin/BrandTable'
import BrandForm from '@/components/admin/BrandForm'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

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

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await getBrands()

      if (result.success) {
        setBrands(result.data || [])
      } else {
        setError(result.error || 'Erro ao carregar marcas')
      }
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBrand = () => {
    setEditingBrand(null)
    setShowForm(true)
  }

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand)
    setShowForm(true)
  }

  const handleDeleteBrand = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) {
      return
    }

    try {
      const result = await deleteBrand(id)
      if (result.success) {
        setBrands(brands.filter(b => b.id !== id))
      } else {
        alert(result.error || 'Erro ao excluir marca')
      }
    } catch (error) {
      alert('Erro ao excluir marca')
      console.error('Erro ao excluir marca:', error)
    }
  }

  const handleSubmitForm = async (data: BrandData) => {
    setFormLoading(true)
    try {
      const result = editingBrand 
        ? await updateBrand(editingBrand.id, data)
        : await createBrand(data)

      if (result.success) {
        setShowForm(false)
        setEditingBrand(null)
        await loadData()
      } else {
        alert(result.error || 'Erro ao salvar marca')
      }
    } catch (error) {
      alert('Erro ao salvar marca')
      console.error('Erro ao salvar marca:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingBrand(null)
  }

  const handleReorderBrands = async (reorderedBrands: Brand[]) => {
    try {
      // Update order for all brands
      const updatePromises = reorderedBrands.map((brand, index) =>
        updateBrandOrder(brand.id, index + 1)
      )
      
      await Promise.all(updatePromises)
      
      // Update local state
      setBrands(reorderedBrands.map((brand, index) => ({
        ...brand,
        displayOrder: index + 1
      })))
    } catch (error) {
      console.error('Erro ao reordenar marcas:', error)
      alert('Erro ao reordenar marcas')
    }
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Marcas
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie as marcas dos produtos e defina a ordem de exibição
          </p>
        </div>
        
        <Button onClick={handleCreateBrand}>
          Nova Marca
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total de Marcas</div>
          <div className="text-2xl font-bold text-gray-900">{brands.length}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Marcas Ativas</div>
          <div className="text-2xl font-bold text-green-600">
            {brands.filter(b => b.isActive).length}
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Produtos com Marca</div>
          <div className="text-2xl font-bold text-blue-600">
            {brands.reduce((total, brand) => total + brand._count.products, 0)}
          </div>
        </div>
      </div>

      {/* Info sobre ordenação */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-800 font-medium">Ordenação de Marcas</h3>
            <p className="text-blue-700 text-sm mt-1">
              Arraste e solte as marcas na tabela abaixo para definir a ordem que aparecerão no catálogo. 
              As marcas com menor número de ordem aparecem primeiro.
            </p>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <BrandTable
        brands={brands}
        onEdit={handleEditBrand}
        onDelete={handleDeleteBrand}
        onReorder={handleReorderBrands}
        loading={loading}
      />

      {/* Modal do Formulário */}
      <Modal
        isOpen={showForm}
        onClose={handleCancelForm}
        title={editingBrand ? 'Editar Marca' : 'Nova Marca'}
        size="md"
      >
        <BrandForm
          brand={editingBrand || undefined}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={formLoading}
        />
      </Modal>
    </div>
  )
}