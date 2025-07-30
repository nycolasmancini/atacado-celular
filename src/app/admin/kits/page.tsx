import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

async function getKits() {
  const kits = await prisma.kit.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Converter Decimal para number para evitar problemas de serialização
  return kits.map(kit => ({
    ...kit,
    totalPrice: Number(kit.totalPrice),
    discount: Number(kit.discount),
    items: kit.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        specialPrice: Number(item.product.specialPrice)
      }
    }))
  }))
}

export default async function KitsPage() {
  const kits = await getKits()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestão de Kits
        </h1>
        <Link href="/admin/kits/novo">
          <Button variant="primary">
            Novo Kit
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kits.map((kit) => {
          const calculatedTotal = kit.items.reduce((sum, item) => 
            sum + (Number(item.product.price) * item.quantity), 0
          )
          const kitDiscount = Number(kit.discount)
          const finalPrice = calculatedTotal - kitDiscount
          
          return (
            <Card key={kit.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {kit.name}
                </CardTitle>
                {kit.description && (
                  <p className="text-sm text-gray-600">
                    {kit.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Produtos inclusos */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Produtos inclusos ({kit.items.length}):
                    </h4>
                    <div className="space-y-1">
                      {kit.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-gray-600">
                          <span className="truncate mr-2">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-medium">
                            R$ {(Number(item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {kit.items.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{kit.items.length - 3} produtos...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Valor dos produtos:</span>
                        <span className="text-gray-900 font-medium">
                          R$ {calculatedTotal.toFixed(2)}
                        </span>
                      </div>
                      
                      {kitDiscount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-red-600">Desconto manual:</span>
                          <span className="text-red-600 font-medium">
                            - R$ {kitDiscount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t mt-3 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          Preço final:
                        </span>
                        <span className="text-xl font-bold text-orange-600">
                          R$ {finalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      {kitDiscount > 0 && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-green-700">
                            Economia total:
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            R$ {kitDiscount.toFixed(2)} ({((kitDiscount / calculatedTotal) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 pt-3">
                    <Link 
                      href={`/admin/kits/${kit.id}/editar`}
                      className="flex-1"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        fullWidth
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="px-3"
                    >
                      {kit.isActive ? 'Ativo' : 'Inativo'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {kits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum kit encontrado
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando seu primeiro kit de produtos.
          </p>
          <Link href="/admin/kits/novo">
            <Button variant="primary">
              Criar Primeiro Kit
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}