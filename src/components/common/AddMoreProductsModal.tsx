'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Plus } from 'lucide-react'

interface AddMoreProductsModalProps {
  isOpen: boolean
  onClose: () => void
  kitName: string
}

export default function AddMoreProductsModal({ isOpen, onClose, kitName }: AddMoreProductsModalProps) {
  const router = useRouter()

  const handleGoToCatalog = () => {
    onClose()
    router.push('/catalogo')
  }

  const handleGoToCart = () => {
    onClose()
    router.push('/carrinho')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Kit Adicionado!
                </h2>
                <p className="text-emerald-100">
                  "{kitName}" foi adicionado ao seu carrinho
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Deseja adicionar mais produtos?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Você pode continuar comprando no catálogo ou finalizar sua compra
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoToCatalog}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    Sim, ver mais produtos
                  </button>

                  <button
                    onClick={handleGoToCart}
                    className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Não, ir para o carrinho
                  </button>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="w-full mt-4 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}