'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { trackEvent } from '@/lib/tracking-disabled'

// Tipos de experimentos disponíveis
export enum ExperimentType {
  HERO_CTA_TEXT = 'hero_cta_text',
  HERO_HEADLINE = 'hero_headline',
  PRICING_DISPLAY = 'pricing_display',
  URGENCY_TIMER = 'urgency_timer',
  SOCIAL_PROOF = 'social_proof',
  KIT_LAYOUT = 'kit_layout',
  WHATSAPP_MODAL = 'whatsapp_modal',
  TESTIMONIALS = 'testimonials',
  FAQ_POSITION = 'faq_position',
  COLOR_SCHEME = 'color_scheme'
}

// Definição de variantes para cada experimento
export const ExperimentVariants = {
  [ExperimentType.HERO_CTA_TEXT]: {
    control: 'QUERO VER OS PREÇOS',
    variant_a: 'LIBERAR PREÇOS ESPECIAIS',
    variant_b: 'ACESSAR CATÁLOGO ATACADO',
    variant_c: 'VER PREÇOS DE ATACADO'
  },
  
  [ExperimentType.HERO_HEADLINE]: {
    control: 'Acessórios para Celular no Atacado',
    variant_a: 'Fature R$ 15.000/mês Vendendo Acessórios',
    variant_b: 'Acessórios Direto da Fábrica - Preços Atacado',
    variant_c: 'Revenda Acessórios e Tenha Renda Extra'
  },

  [ExperimentType.PRICING_DISPLAY]: {
    control: 'simple', // Preço simples
    variant_a: 'comparison', // Preço vs. concorrência
    variant_b: 'savings', // Economia destacada
    variant_c: 'percentage' // Porcentagem de desconto
  },

  [ExperimentType.URGENCY_TIMER]: {
    control: 'none', // Sem timer
    variant_a: 'countdown', // Timer regressivo
    variant_b: 'scarcity', // Estoque limitado
    variant_c: 'both' // Timer + escassez
  },

  [ExperimentType.SOCIAL_PROOF]: {
    control: 'testimonials', // Depoimentos tradicionais
    variant_a: 'numbers', // Números e estatísticas
    variant_b: 'photos', // Fotos de clientes
    variant_c: 'videos' // Vídeos de depoimentos
  },

  [ExperimentType.KIT_LAYOUT]: {
    control: 'grid', // Layout em grade
    variant_a: 'carousel', // Carrossel horizontal
    variant_b: 'list', // Lista vertical
    variant_c: 'featured' // Kit em destaque
  },

  [ExperimentType.WHATSAPP_MODAL]: {
    control: 'simple', // Modal simples
    variant_a: 'benefits', // Com benefícios
    variant_b: 'urgency', // Com urgência
    variant_c: 'social' // Com prova social
  },

  [ExperimentType.TESTIMONIALS]: {
    control: 'static', // Depoimentos estáticos
    variant_a: 'rotating', // Rotação automática
    variant_b: 'interactive', // Clicável/navegável
    variant_c: 'video' // Depoimentos em vídeo
  },

  [ExperimentType.FAQ_POSITION]: {
    control: 'bottom', // FAQ no final
    variant_a: 'middle', // FAQ no meio
    variant_b: 'sidebar', // FAQ na lateral
    variant_c: 'floating' // FAQ flutuante
  },

  [ExperimentType.COLOR_SCHEME]: {
    control: 'purple_pink', // Roxo e rosa padrão
    variant_a: 'blue_green', // Azul e verde
    variant_b: 'orange_red', // Laranja e vermelho
    variant_c: 'dark_gold' // Escuro e dourado
  }
}

// Interface do contexto
interface ABTestingContextType {
  getVariant: (experiment: ExperimentType) => string
  trackConversion: (experiment: ExperimentType, conversionType: string, value?: number) => void
  getAllVariants: () => Record<string, string>
  isExperimentActive: (experiment: ExperimentType) => boolean
}

// Context
const ABTestingContext = createContext<ABTestingContextType | undefined>(undefined)

// Provider props
interface ABTestingProviderProps {
  children: ReactNode
  experiments?: ExperimentType[]
  userId?: string
}

// Função para gerar hash consistente baseado no userId
function generateHash(userId: string, experiment: string): number {
  let hash = 0
  const input = `${userId}_${experiment}`
  
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash)
}

// Função para selecionar variante baseada no hash
function selectVariant(userId: string, experiment: ExperimentType): string {
  const variants = Object.keys(ExperimentVariants[experiment])
  const hash = generateHash(userId, experiment)
  const variantIndex = hash % variants.length
  
  return variants[variantIndex]
}

// Provider component
export function ABTestingProvider({ 
  children, 
  experiments = Object.values(ExperimentType),
  userId 
}: ABTestingProviderProps) {
  const [userVariants, setUserVariants] = useState<Record<string, string>>({})
  const [sessionUserId, setSessionUserId] = useState<string>('')

  // Inicializar userId e variantes
  useEffect(() => {
    // Obter ou gerar userId
    let currentUserId = userId
    
    if (!currentUserId) {
      currentUserId = localStorage.getItem('ab_test_user_id')
      
      if (!currentUserId) {
        currentUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('ab_test_user_id', currentUserId)
      }
    }
    
    setSessionUserId(currentUserId)

    // Gerar variantes para todos os experimentos
    const variants: Record<string, string> = {}
    
    experiments.forEach(experiment => {
      // Verificar se já existe variante salva
      const savedVariant = localStorage.getItem(`ab_test_${experiment}`)
      
      if (savedVariant && Object.keys(ExperimentVariants[experiment]).includes(savedVariant)) {
        variants[experiment] = savedVariant
      } else {
        // Gerar nova variante
        const selectedVariant = selectVariant(currentUserId, experiment)
        variants[experiment] = selectedVariant
        localStorage.setItem(`ab_test_${experiment}`, selectedVariant)
        
        // Track assignment (with error handling)
        try {
          trackEvent('ab_test_assigned', {
            experiment,
            variant: selectedVariant,
            user_id: currentUserId,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.warn('Failed to track A/B test assignment:', error)
        }
      }
    })
    
    setUserVariants(variants)

    // Track session com todas as variantes ativas (with error handling)
    try {
      trackEvent('ab_test_session', {
        user_id: currentUserId,
        active_variants: variants,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.warn('Failed to track A/B test session:', error)
    }
  }, [experiments, userId])

  // Obter variante para um experimento específico
  const getVariant = (experiment: ExperimentType): string => {
    return userVariants[experiment] || 'control'
  }

  // Track conversão
  const trackConversion = (
    experiment: ExperimentType, 
    conversionType: string, 
    value?: number
  ) => {
    const variant = getVariant(experiment)
    
    try {
      trackEvent('ab_test_conversion', {
        experiment,
        variant,
        conversion_type: conversionType,
        value: value || 0,
        user_id: sessionUserId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.warn('Failed to track A/B test conversion:', error)
    }
  }

  // Obter todas as variantes ativas
  const getAllVariants = (): Record<string, string> => {
    return { ...userVariants }
  }

  // Verificar se experimento está ativo
  const isExperimentActive = (experiment: ExperimentType): boolean => {
    return experiments.includes(experiment)
  }

  const value: ABTestingContextType = {
    getVariant,
    trackConversion,
    getAllVariants,
    isExperimentActive
  }

  return (
    <ABTestingContext.Provider value={value}>
      {children}
    </ABTestingContext.Provider>
  )
}

// Hook para usar A/B testing
export function useABTesting() {
  const context = useContext(ABTestingContext)
  
  if (context === undefined) {
    throw new Error('useABTesting must be used within an ABTestingProvider')
  }
  
  return context
}

// Hook específico para componentes
export function useExperiment(experiment: ExperimentType) {
  const { getVariant, trackConversion, isExperimentActive } = useABTesting()
  
  const variant = getVariant(experiment)
  const variantData = ExperimentVariants[experiment][variant]
  
  const trackClick = (value?: number) => {
    trackConversion(experiment, 'click', value)
  }
  
  const trackView = () => {
    trackConversion(experiment, 'view')
  }
  
  const trackSubmit = (value?: number) => {
    trackConversion(experiment, 'submit', value)
  }

  // Track visualização automaticamente
  useEffect(() => {
    if (isExperimentActive(experiment)) {
      trackView()
    }
  }, [experiment, isExperimentActive])

  return {
    variant,
    variantData,
    isActive: isExperimentActive(experiment),
    trackClick,
    trackView,
    trackSubmit
  }
}

// Componente para renderização condicional baseada em variante
interface ExperimentRenderProps {
  experiment: ExperimentType
  variants: Record<string, ReactNode>
  fallback?: ReactNode
}

export function ExperimentRender({ 
  experiment, 
  variants, 
  fallback = null 
}: ExperimentRenderProps) {
  const { getVariant, isExperimentActive } = useABTesting()
  
  if (!isExperimentActive(experiment)) {
    return <>{fallback}</>
  }
  
  const currentVariant = getVariant(experiment)
  const content = variants[currentVariant] || variants.control || fallback
  
  return <>{content}</>
}

// Utilitários para análise
export class ABTestAnalytics {
  static exportResults(): Record<string, any> {
    const results: Record<string, any> = {}
    
    Object.values(ExperimentType).forEach(experiment => {
      const variant = localStorage.getItem(`ab_test_${experiment}`)
      if (variant) {
        results[experiment] = variant
      }
    })
    
    return {
      user_id: localStorage.getItem('ab_test_user_id'),
      variants: results,
      exported_at: new Date().toISOString()
    }
  }
  
  static clearAllTests(): void {
    Object.values(ExperimentType).forEach(experiment => {
      localStorage.removeItem(`ab_test_${experiment}`)
    })
    localStorage.removeItem('ab_test_user_id')
  }
  
  static forceVariant(experiment: ExperimentType, variant: string): void {
    if (Object.keys(ExperimentVariants[experiment]).includes(variant)) {
      localStorage.setItem(`ab_test_${experiment}`, variant)
      window.location.reload()
    }
  }
}