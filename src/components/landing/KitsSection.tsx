'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Kit, KitItem, Product } from '@prisma/client'
import KitCard from './KitCard'

// Mock data fallback
const MOCK_KITS = [
  {
    id: 1,
    name: 'Kit Proteção iPhone',
    slug: 'kit-protecao-iphone',
    description: 'Kit completo: capinha + película + carregador',
    totalPrice: 40.00,
    discount: 0,
    colorTheme: 'purple-pink',
    imageUrl: 'https://placehold.co/400x300',
    items: [
      {
        id: 1,
        kitId: 1,
        productId: 1,
        quantity: 1,
        product: {
          id: 1,
          name: 'Capinha iPhone 15',
          slug: 'capinha-iphone-15',
          description: 'Capinha transparente para iPhone 15',
          price: 15.00,
          specialPrice: 12.00,
          specialPriceMinQty: 100,
          categoryId: 1,
          imageUrl: 'https://placehold.co/300x300'
        }
      }
    ]
  },
  {
    id: 2,
    name: 'Kit Básico Android',
    slug: 'kit-basico-android',
    description: 'Kit essencial: capinha + carregador',
    totalPrice: 35.00,
    discount: 0,
    colorTheme: 'blue-green',
    imageUrl: 'https://placehold.co/400x300',
    items: [
      {
        id: 2,
        kitId: 2,
        productId: 2,
        quantity: 1,
        product: {
          id: 2,
          name: 'Carregador USB-C 20W',
          slug: 'carregador-usb-c-20w',
          description: 'Carregador rápido USB-C 20W',
          price: 25.00,
          specialPrice: 20.00,
          specialPriceMinQty: 50,
          categoryId: 2,
          imageUrl: 'https://placehold.co/300x300'
        }
      }
    ]
  }
] as KitWithItems[]

interface KitsSectionProps {
  pricesUnlocked: boolean
  onRequestWhatsApp: (kit?: any) => void
}

interface KitWithItems extends Kit {
  items: (KitItem & { product: Product })[]
}

// Skeleton Component
function KitCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="h-32 bg-gradient-to-br from-gray-300 to-gray-400" />
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Items List Skeleton */}
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded flex-1 mr-4" />
                <div className="h-6 w-8 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="border-t pt-4">
          <div className="text-center mb-4">
            <div className="h-8 bg-gray-200 rounded w-24 mx-auto mb-2" />
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
          </div>
          <div className="h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Client Component for Data Fetching
function KitsList({ pricesUnlocked, onRequestWhatsApp }: { pricesUnlocked: boolean, onRequestWhatsApp: (kit?: any) => void }) {
  const [kits, setKits] = useState<KitWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchKits() {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
        
        // Use relative URL to avoid redirect issues
        const apiUrl = '/api/kits'
        
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        setKits(data)
      } catch (err) {
        console.warn('API /api/kits não disponível, usando dados mock')
        
        // After 1 failed attempt, use mock data immediately  
        if (retryCount >= 0) {
          console.warn('Using mock data after failed API requests')
          setKits(MOCK_KITS)
          setError(null)
        } else {
          if (err instanceof Error) {
            if (err.name === 'AbortError') {
              setError('Request timed out. Please check your connection.')
            } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
              setError('Network error. Please check your internet connection.')
            } else {
              setError(err.message)
            }
          } else {
            setError('Failed to fetch kits')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchKits()
  }, [retryCount])

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <KitCardSkeleton key={i} />
        ))}
      </>
    )
  }

  if (error) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          ⚠️
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Erro ao Carregar Kits
        </h3>
        <p className="text-gray-500 mb-4">
          Não foi possível carregar os kits. Tente recarregar a página.
        </p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => {
              setError(null)
              setLoading(true)
              setRetryCount(prev => prev + 1)
            }} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tentar Novamente
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    )
  }

  if (kits.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          📦
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Kits em Breve
        </h3>
        <p className="text-gray-500">
          Estamos preparando kits especiais para você. Volte em breve!
        </p>
      </div>
    )
  }

  // Find the most expensive kit
  const mostExpensiveKit = kits.reduce((prev, current) => {
    const prevPrice = prev.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) - Number(prev.discount)
    const currentPrice = current.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) - Number(current.discount)
    return currentPrice > prevPrice ? current : prev
  })

  return (
    <>
      {kits.map((kit, index) => (
        <KitCard
          key={kit.id}
          kit={kit}
          pricesUnlocked={pricesUnlocked}
          isBestSeller={kit.id === mostExpensiveKit.id}
          onRequestWhatsApp={onRequestWhatsApp}
        />
      ))}
    </>
  )
}

// Main Component
export default function KitsSection({ pricesUnlocked, onRequestWhatsApp }: KitsSectionProps) {
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState('/images/whatsapp-avatar.svg')

  // Buscar configurações do site
  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          setAvatarUrl(config.avatarWhatsappUrl || '/images/whatsapp-avatar.svg')
        }
      } catch (error) {
        console.error('Erro ao buscar configurações:', error)
      }
    }
    fetchConfig()
  }, [])

  const handleCatalogClick = () => {
    router.push('/catalogo')
  }

  const handleWhatsAppClick = () => {
    window.open('https://api.whatsapp.com/send/?phone=5511981326609&text=Oi%2C+vim+pelo+site+e+estou+com+dúvidas&type=phone_number&app_absent=0', '_blank')
  }

  return (
    <section id="kits-section" className="py-20 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFBF7'
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            🎯 Kits Exclusivos
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Escolha Seu Kit
            <span className="block text-orange-600">Perfeito</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Combinações testadas e aprovadas por milhares de revendedores. 
            Cada kit foi desenvolvido para <strong>maximizar suas vendas</strong>.
          </p>
        </div>

        {/* Kits Grid */}
        <div className="flex justify-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full px-4" id="kits-grid">
            <KitsList pricesUnlocked={pricesUnlocked} onRequestWhatsApp={onRequestWhatsApp} />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="rounded-2xl shadow-lg p-10 max-w-2xl mx-auto text-center" style={{
            background: 'linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 100%)'
          }}>
            <div 
              className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-green-400 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleWhatsAppClick}
            >
              <img 
                src={avatarUrl} 
                alt="WhatsApp Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/whatsapp-avatar.svg'
                }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-2" style={{ color: '#0A0A0A' }}>
              Não encontrou o kit ideal?
            </h3>
            
            <p className="mb-6" style={{ color: '#4A4A4A', fontSize: '16px' }}>
              Explore nosso catálogo completo com mais de 500 produtos 
              ou entre em contato para kits personalizados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleCatalogClick}
                className="text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: '#FC6D36'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E55A25'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FC6D36'
                }}
              >
                Ver Catálogo Completo
              </button>
              
              <button 
                onClick={handleWhatsAppClick}
                className="text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#25D366'
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}