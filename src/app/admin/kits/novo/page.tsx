import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { KitEditor } from '@/components/admin/KitEditor'
import { createKit } from '../actions'

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

export default async function NovoKitPage() {
  const products = await getProducts()

  const handleSave = async (kitData: {
    name: string
    description: string
    discount: number
    items: Array<{ productId: number; quantity: number }>
  }) => {
    'use server'
    
    const result = await createKit(kitData)
    
    if (result.success) {
      redirect('/admin/kits')
    } else {
      throw new Error(result.error)
    }
  }

  // Kit vazio para novo
  const emptyKit = {
    id: 0,
    name: '',
    description: '',
    discount: 0,
    items: []
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <a href="/admin/kits" className="hover:text-orange-600">
            Kits
          </a>
          <span>/</span>
          <span>Novo Kit</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Criar Novo Kit
        </h1>
      </div>

      <KitEditor
        kit={emptyKit}
        products={products}
        onSave={handleSave}
      />
    </div>
  )
}