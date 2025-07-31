'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/tracking'

// Social Proof Dinâmico
interface SocialProofData {
  type: 'sale' | 'signup' | 'review' | 'visitor'
  message: string
  location?: string
  timeAgo: string
  avatar?: string
}

const socialProofMessages: SocialProofData[] = [
  {
    type: 'sale',
    message: '🎉 Maria comprou um Kit Completo',
    location: 'São Paulo - SP',
    timeAgo: '2 minutos atrás'
  },
  {
    type: 'signup',
    message: '👋 João liberou os preços especiais',
    location: 'Rio de Janeiro - RJ',
    timeAgo: '5 minutos atrás'
  },
  {
    type: 'review',
    message: '⭐ Ana avaliou com 5 estrelas',
    location: 'Belo Horizonte - MG',
    timeAgo: '8 minutos atrás'
  },
  {
    type: 'sale',
    message: '💰 Carlos fez um pedido de R$ 850',
    location: 'Porto Alegre - RS',
    timeAgo: '12 minutos atrás'
  },
  {
    type: 'visitor',
    message: '👀 15 pessoas vendo esta página',
    timeAgo: 'agora'
  },
  {
    type: 'sale',
    message: '🚀 Fernanda comprou 50 capinhas',
    location: 'Brasília - DF',
    timeAgo: '15 minutos atrás'
  },
  {
    type: 'signup',
    message: '📱 Ricardo liberou o catálogo completo',
    location: 'Salvador - BA',
    timeAgo: '18 minutos atrás'
  }
]

// Componente de Social Proof
export function DynamicSocialProof({ className = '' }: { className?: string }) {
  const [currentProof, setCurrentProof] = useState<SocialProofData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar primeiro proof após 3 segundos
    const initialTimer = setTimeout(() => {
      showRandomProof()
    }, 3000)

    // Continuar mostrando proofs em intervalos
    const interval = setInterval(() => {
      showRandomProof()
    }, 15000) // A cada 15 segundos

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const showRandomProof = () => {
    const randomProof = socialProofMessages[Math.floor(Math.random() * socialProofMessages.length)]
    setCurrentProof(randomProof)
    setIsVisible(true)

    // Track social proof view
    trackEvent('social_proof_shown', {
      type: randomProof.type,
      message: randomProof.message,
      timestamp: new Date().toISOString()
    })

    // Esconder após 8 segundos
    setTimeout(() => {
      setIsVisible(false)
    }, 8000)
  }

  if (!currentProof) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-4 left-4 z-40 max-w-xs ${className}`}
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm">
                {currentProof.type === 'sale' && '🛒'}
                {currentProof.type === 'signup' && '✅'}
                {currentProof.type === 'review' && '⭐'}
                {currentProof.type === 'visitor' && '👥'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {currentProof.message}
                </p>
                {currentProof.location && (
                  <p className="text-xs text-gray-500">
                    {currentProof.location}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  {currentProof.timeAgo}
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Contador de visualizações em tempo real
export function LiveViewCounter({ className = '' }: { className?: string }) {
  const [viewCount, setViewCount] = useState(0)
  const [isIncreasing, setIsIncreasing] = useState(false)

  useEffect(() => {
    // Número base de visualizações (simulado)
    const baseCount = 45 + Math.floor(Math.random() * 20)
    setViewCount(baseCount)

    // Simular mudanças nas visualizações
    const interval = setInterval(() => {
      const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0
      
      if (change !== 0) {
        setIsIncreasing(change > 0)
        setViewCount(prev => Math.max(20, prev + change))
        
        // Reset animation
        setTimeout(() => setIsIncreasing(false), 1000)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      className={`inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium ${className}`}
      animate={isIncreasing ? { scale: [1, 1.1, 1] } : undefined}
      transition={{ duration: 0.5 }}
    >
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <span>{viewCount} pessoas online</span>
    </motion.div>
  )
}

// Testimonial rotativo
interface Testimonial {
  name: string
  location: string
  text: string
  rating: number
  image?: string
  verified?: boolean
}

const testimonials: Testimonial[] = [
  {
    name: "Maria Silva",
    location: "São Paulo - SP",
    text: "Comecei vendendo apenas 5 acessórios por dia, hoje vendo mais de 30! O investimento se pagou rapidinho.",
    rating: 5,
    verified: true
  },
  {
    name: "João Santos",
    location: "Rio de Janeiro - RJ", 
    text: "Qualidade excelente e preços imbatíveis. Meus clientes sempre pedem mais. Recomendo demais!",
    rating: 5,
    verified: true
  },
  {
    name: "Ana Costa",
    location: "Belo Horizonte - MG",
    text: "Em 3 meses já recuperei todo o investimento. Agora é só lucro! Atendimento nota 10.",
    rating: 5,
    verified: true
  },
  {
    name: "Carlos Pereira",
    location: "Porto Alegre - RS",
    text: "Produtos de qualidade e entrega rápida. Consegui montar minha loja virtual em 1 semana.",
    rating: 5,
    verified: true
  }
]

export function RotatingTestimonials({ className = '', interval = 8000 }: { 
  className?: string
  interval?: number 
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Depoimentos</h3>
        <div className="flex gap-1">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Rating Stars */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(currentTestimonial.rating)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">⭐</span>
            ))}
          </div>

          {/* Testimonial Text */}
          <blockquote className="text-gray-700 mb-4 italic">
            "{currentTestimonial.text}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                {currentTestimonial.name}
                {currentTestimonial.verified && (
                  <span className="text-blue-500 text-sm">✓</span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {currentTestimonial.location}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// Price Anchoring - Mostrar economia
interface PriceAnchoringProps {
  originalPrice: number
  currentPrice: number
  className?: string
}

export function PriceAnchoring({ originalPrice, currentPrice, className = '' }: PriceAnchoringProps) {
  const savings = originalPrice - currentPrice
  const percentage = Math.round((savings / originalPrice) * 100)

  return (
    <div className={`bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-4 ${className}`}>
      <div className="text-center">
        <div className="text-sm opacity-90 mb-1">Você economiza:</div>
        <div className="text-2xl font-bold mb-1">
          R$ {savings.toFixed(2).replace('.', ',')}
        </div>
        <div className="text-sm opacity-90">
          {percentage}% OFF comparado ao varejo
        </div>
      </div>
    </div>
  )
}

// Smart CTA que muda baseado no comportamento
export function SmartCTA({ 
  className = '',
  onPrimaryClick,
  onSecondaryClick 
}: {
  className?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}) {
  const [ctaVariant, setCTAVariant] = useState<'default' | 'urgency' | 'benefit' | 'social'>('default')
  const [timeOnPage, setTimeOnPage] = useState(0)

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setTimeOnPage(elapsed)

      // Mudar CTA baseado no tempo na página
      if (elapsed > 30000) { // 30 segundos
        setCTAVariant('urgency')
      } else if (elapsed > 60000) { // 1 minuto
        setCTAVariant('benefit')
      } else if (elapsed > 120000) { // 2 minutos
        setCTAVariant('social')
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const ctaContent = {
    default: {
      primary: 'QUERO VER OS PREÇOS',
      secondary: 'Saiba mais',
      color: 'from-purple-500 to-pink-500'
    },
    urgency: {
      primary: '⚡ LIBERAR PREÇOS AGORA',
      secondary: 'Últimas horas',
      color: 'from-red-500 to-red-600'
    },
    benefit: {
      primary: '💰 COMEÇAR A LUCRAR',
      secondary: 'Renda extra garantida',
      color: 'from-green-500 to-emerald-500'
    },
    social: {
      primary: '🎉 JUNTAR-SE A +2.000 REVENDEDORES',
      secondary: 'Não fique de fora',
      color: 'from-blue-500 to-purple-500'
    }
  }

  const current = ctaContent[ctaVariant]

  return (
    <div className={`space-y-3 ${className}`}>
      <motion.button
        onClick={onPrimaryClick}
        className={`w-full bg-gradient-to-r ${current.color} text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {current.primary}
      </motion.button>
      
      <button
        onClick={onSecondaryClick}
        className="w-full text-gray-600 text-sm hover:text-gray-800 transition-colors"
      >
        {current.secondary}
      </button>
    </div>
  )
}

// Progressive Disclosure - Mostrar informações gradualmente
export function ProgressiveDisclosure({ 
  children,
  triggerText = "Ver mais informações",
  className = '' 
}: {
  children: React.ReactNode
  triggerText?: string
  className?: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
    
    trackEvent('progressive_disclosure_toggle', {
      expanded: !isExpanded,
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className={className}>
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
      >
        <span>{isExpanded ? 'Ver menos' : triggerText}</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook para otimizações automáticas
export function useConversionOptimizations() {
  const [optimizations, setOptimizations] = useState({
    socialProofEnabled: true,
    urgencyEnabled: true,
    priceAnchoringEnabled: true,
    smartCTAEnabled: true
  })

  const toggleOptimization = (key: keyof typeof optimizations) => {
    setOptimizations(prev => ({
      ...prev,
      [key]: !prev[key]
    }))

    trackEvent('optimization_toggled', {
      optimization: key,
      enabled: !optimizations[key],
      timestamp: new Date().toISOString()
    })
  }

  return {
    optimizations,
    toggleOptimization
  }
}