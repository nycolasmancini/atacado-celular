import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { KitEditor } from '@/components/admin/KitEditor'
import { updateKit } from '../../actions'

interface EditKitPageProps {
  params: Promise<{
    id: string
  }>
}

async function getKit(id: number) {
  const kit = await prisma.kit.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!kit) {
    return null
  }

  return {
    id: kit.id,
    name: kit.name,
    description: kit.description,
    discount: Number(kit.discount),
    items: kit.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  }
}

async function getProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true
    },
    include: {
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: [
      { category: { name: 'asc' } },
      { name: 'asc' }
    ]
  })

  // Converter Decimal para number para evitar problemas de serialização
  return products.map(product => ({
    ...product,
    price: Number(product.price),
    specialPrice: Number(product.specialPrice)
  }))
}

export default async function EditKitPage({ params }: EditKitPageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  if (isNaN(id)) {
    notFound()
  }

  const [kit, products] = await Promise.all([
    getKit(id),
    getProducts()
  ])

  if (!kit) {
    notFound()
  }

  const handleSave = async (kitData: {
    name: string
    description: string
    discount: number
    items: Array<{ productId: number; quantity: number }>
  }) => {
    'use server'
    
    const result = await updateKit(id, kitData)
    
    if (result.success) {
      redirect('/admin/kits')
    } else {
      throw new Error(result.error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <a href="/admin/kits" className="hover:text-orange-600">
            Kits
          </a>
          <span>/</span>
          <span>Editar</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Kit: {kit.name}
        </h1>
      </div>

      <KitEditor
        kit={kit}
        products={products}
        onSave={handleSave}
      />
    </div>
  )
}