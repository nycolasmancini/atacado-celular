'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Kit, KitItem, Product } from '@prisma/client'
import KitCard from './KitCard'

interface KitsSectionProps {
  pricesUnlocked: boolean
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
function KitsList({ pricesUnlocked }: { pricesUnlocked: boolean }) {
  const [kits, setKits] = useState<KitWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchKits() {
      try {
        const response = await fetch('/api/kits')
        if (!response.ok) {
          throw new Error('Failed to fetch kits')
        }
        const data = await response.json()
        setKits(data)
      } catch (err) {
        console.error('Error fetching kits:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch kits')
      } finally {
        setLoading(false)
      }
    }

    fetchKits()
  }, [])

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
        <button 
          onClick={() => window.location.reload()} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Recarregar
        </button>
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
        />
      ))}
    </>
  )
}

// Main Component
export default function KitsSection({ pricesUnlocked }: KitsSectionProps) {
  const router = useRouter()

  const handleCatalogClick = () => {
    router.push('/catalogo')
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais sobre kits personalizados para minha revenda.')
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank')
  }

  return (
    <section id="kits-section" className="py-20 bg-gray-50">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <KitsList pricesUnlocked={pricesUnlocked} />
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
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
            <div className="text-3xl font-bold text-purple-600 mb-2">48h</div>
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