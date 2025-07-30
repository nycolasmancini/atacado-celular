import { Kit, KitItem, Product } from '@prisma/client'
import { useCart } from '@/contexts/CartContext'
import toast from 'react-hot-toast'

interface KitCardProps {
  kit: Kit & { 
    items: (KitItem & { product: Product })[] 
  }
  pricesUnlocked: boolean
  isBestSeller?: boolean
  onRequestWhatsApp: () => void
}

const gradientClasses = {
  'purple-pink': 'from-purple-500 to-pink-500',
  'blue-green': 'from-blue-500 to-green-500', 
  'orange-yellow': 'from-orange-500 to-yellow-500'
}

export default function KitCard({ kit, pricesUnlocked, isBestSeller = false, onRequestWhatsApp }: KitCardProps) {
  const { addItem } = useCart()
  const gradientClass = gradientClasses[kit.colorTheme as keyof typeof gradientClasses] || gradientClasses['purple-pink']
  
  const totalPrice = kit.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  )

  const totalItems = kit.items.reduce((sum, item) => sum + item.quantity, 0)

  const handleAddKitToCart = () => {
    if (!pricesUnlocked) {
      // Se preços não estão liberados, abrir modal do WhatsApp
      onRequestWhatsApp()
      return
    }

    // Adicionar todos os produtos do kit ao carrinho
    kit.items.forEach(item => {
      addItem(item.product, item.quantity)
    })
    
    // Mostrar feedback ao usuário
    toast.success(`Kit "${kit.name}" adicionado ao carrinho!`, {
      duration: 3000,
      icon: '🛒',
    })
  }

  return (
    <div className="group relative">
      {/* Best Seller Badge */}
      {isBestSeller && (
        <div className="absolute -top-3 -right-3 z-20 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          ⭐ Mais Vendido
        </div>
      )}

      {/* Card */}
      <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-105 group-hover:-translate-y-2 transform-gpu">
        {/* Gradient Header */}
        <div className={`h-32 bg-gradient-to-br ${gradientClass} relative`}>
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 left-6">
            <h3 className="text-white font-bold text-xl">{kit.name}</h3>
            <p className="text-white/80 text-sm">{kit.description}</p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-2 right-2 w-8 h-8 bg-white/20 rounded-full blur-lg" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Items List */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Produtos Inclusos ({totalItems} peças)
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {kit.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex-1">{item.product.name}</span>
                  <span className="text-gray-800 font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {item.quantity}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="border-t pt-4">
            {!pricesUnlocked ? (
              <div className="text-center">
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <div className="w-8 h-8 mx-auto mb-2 bg-orange-200 rounded-full flex items-center justify-center">
                    🚚
                  </div>
                  <p className="text-orange-800 font-medium">Calcular Frete</p>
                  <p className="text-orange-600 text-xs">Informe seu WhatsApp para calcular o frete e ver preços</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-3">
                  <span className="text-2xl font-bold text-gray-800">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    R$ {(totalPrice / totalItems).toFixed(2)} por peça
                  </div>
                </div>
                
                {/* Value Proposition */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    <span className="text-sm font-medium">Kit Completo Pronto</span>
                  </div>
                  <p className="text-green-600 text-xs mt-1">
                    Economia de tempo na seleção
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleAddKitToCart}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                pricesUnlocked
                  ? `bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:scale-105 active:scale-95`
                  : `bg-gradient-to-r ${gradientClass} hover:shadow-lg hover:scale-105 active:scale-95`
              }`}
            >
              {pricesUnlocked ? 'Adicionar Kit ao Carrinho' : 'Calcular Frete + Adicionar'}
            </button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none rounded-2xl`} />
      </div>
    </div>
  )
}