'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import KitsSection from '@/components/landing/KitsSection'
import HeaderNavigation from '@/components/landing/HeaderNavigation'
import { FloatingCartButton } from '@/components/catalog/FloatingCartButton'
import { useCart } from '@/contexts/CartContext'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import toast from 'react-hot-toast'

export default function KitsPageClient() {
  const { items, addItem } = useCart()
  const router = useRouter()
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [pendingKit, setPendingKit] = useState<any>(null)

  useEffect(() => {
    // Hook para detectar mudanças no estado pricesUnlocked
  }, [pricesUnlocked])

  const handleRequestWhatsApp = (kit?: any) => {
    setPendingKit(kit || null)
    setShowWhatsAppModal(true)
  }

  const handleWhatsAppSuccess = (whatsapp: string) => {
    // Usar o hook para salvar no localStorage
    unlockPrices(whatsapp)
    
    // Se há um kit pendente, adicionar ao carrinho
    if (pendingKit) {
      // Adicionar todos os produtos do kit ao carrinho
      pendingKit.items.forEach((item: any) => {
        addItem(item.product, item.quantity)
      })
      
      // Mostrar feedback de sucesso
      toast.success(`Kit "${pendingKit.name}" adicionado ao carrinho!`, {
        duration: 2000,
        icon: '🛒',
      })
      
      // Limpar kit pendente
      setPendingKit(null)
      
      // Redirecionar para carrinho após um breve delay
      setTimeout(() => {
        router.push('/carrinho')
      }, 1000)
    }
    
    setShowWhatsAppModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Navigation */}
      <HeaderNavigation />
      
      {/* Main Content */}
      <main className="pt-20 pb-8">
        {/* Header Section */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/catalogo"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar ao Catálogo</span>
            </Link>
            
            <Link
              href="/carrinho"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Carrinho ({items.length})</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Nossos Kits Prontos
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Economize tempo e dinheiro com nossos kits completos. 
              Tudo que você precisa em um só lugar, com preços especiais.
            </p>
          </div>
        </div>

        {/* Kits Section */}
        <KitsSection 
          pricesUnlocked={pricesUnlocked}
          onRequestWhatsApp={handleRequestWhatsApp}
        />
        
        {/* Bottom CTA Section */}
        <div className="container mx-auto px-4 mt-16">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">
              Não encontrou o que procurava?
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Explore nosso catálogo completo com centenas de produtos para celular
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <FloatingCartButton />
      
      {/* WhatsApp Modal */}
      <WhatsAppModal 
        isOpen={showWhatsAppModal}
        onSuccess={handleWhatsAppSuccess}
        onClose={() => setShowWhatsAppModal(false)}
      />
    </div>
  )
}