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
    imageUrl: 'https://via.placeholder.com/400x300',
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
          imageUrl: 'https://via.placeholder.com/300x300'
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
    imageUrl: 'https://via.placeholder.com/400x300',
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
          imageUrl: 'https://via.placeholder.com/300x300'
        }
      }
    ]
  }
] as KitWithItems[]

interface KitsSectionProps {
  pricesUnlocked: boolean
  onRequestWhatsApp: () => void
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
function KitsList({ pricesUnlocked, onRequestWhatsApp }: { pricesUnlocked: boolean, onRequestWhatsApp: () => void }) {
  const [kits, setKits] = useState<KitWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchKits() {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        // Use relative URL to avoid redirect issues
        const apiUrl = '/api/kits'
        console.log('Fetching from:', apiUrl)
        
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
        console.error('Error fetching kits:', err)
        console.error('Error type:', typeof err)
        console.error('Error name:', err?.name)
        console.error('Error message:', err?.message)
        console.error('Full error object:', err)
        console.error('Current URL:', window.location.href)
        
        // After 3 failed attempts, use mock data
        if (retryCount >= 2) {
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

  return (
    <>
      {kits.map((kit, index) => (
        <KitCard
          key={kit.id}
          kit={kit}
          pricesUnlocked={pricesUnlocked}
          isBestSeller={index === 0}
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
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais sobre kits personalizados para minha revenda.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <section id="kits-section" className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fef3c7 0%, #fff7ed 40%, #fef5e7 70%, #f0f9ff 100%)'
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            🎯 Kits Exclusivos
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Escolha Seu Kit
            <span className="block text-purple-600">Perfeito</span>
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
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-green-400 relative overflow-hidden">
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
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Não encontrou o kit ideal?
            </h3>
            
            <p className="text-gray-600 mb-6">
              Explore nosso catálogo completo com mais de 500 produtos 
              ou entre em contato para kits personalizados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleCatalogClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Ver Catálogo Completo
              </button>
              
              <button 
                onClick={handleWhatsAppClick}
                className="border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300"
              >
                Falar no WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1000+</div>
            <div className="text-gray-600 text-sm">Revendedores Ativos</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
            <div className="text-gray-600 text-sm">Produtos Disponíveis</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-gray-600 text-sm">Envio Garantido</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
            <div className="text-gray-600 text-sm">Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  )
}