'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface ProductView {
  id: number
  name: string
  price: number
  viewTime: number
  timestamp: Date
}

interface CartItem {
  id: number
  name: string
  quantity: number
  price: number
  addedAt: Date
}

interface UserJourneyData {
  sessionId: string
  sessionStart: Date
  pagesVisited: number
  productsViewed: ProductView[]
  searchQueries: string[]
  cartItems: CartItem[]
  cartValue: number
  interestScore: number
  urgencySignals: string[]
  behaviorFlags: string[]
}

export const useUserJourneyTracking = () => {
  const journeyData = useRef<UserJourneyData>({
    sessionId: '',
    sessionStart: new Date(),
    pagesVisited: 0,
    productsViewed: [],
    searchQueries: [],
    cartItems: [],
    cartValue: 0,
    interestScore: 0,
    urgencySignals: [],
    behaviorFlags: []
  })

  const lastActivityTime = useRef<Date>(new Date())
  const sessionTimeoutRef = useRef<NodeJS.Timeout>()
  const pageStartTime = useRef<Date>(new Date())
  const isBeforeUnloadListenerAdded = useRef(false)
  const router = useRouter()

  // Gerar session ID único
  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }, [])

  // Calcular score de interesse baseado no comportamento
  const calculateInterestScore = useCallback(() => {
    const data = journeyData.current
    let score = 0

    // Pontos por tempo de sessão (máximo 3 pontos)
    const sessionMinutes = (Date.now() - data.sessionStart.getTime()) / (1000 * 60)
    score += Math.min(sessionMinutes * 0.3, 3)

    // Pontos por produtos visualizados (0.5 por produto, máximo 3 pontos)
    score += Math.min(data.productsViewed.length * 0.5, 3)

    // Pontos por tempo gasto em produtos (máximo 2 pontos)
    const totalViewTime = data.productsViewed.reduce((sum, p) => sum + p.viewTime, 0)
    score += Math.min(totalViewTime / 30, 2) // 30 segundos = 1 ponto

    // Pontos por carrinho (2 pontos se tem items)
    if (data.cartItems.length > 0) score += 2

    // Pontos por valor do carrinho (máximo 2 pontos)
    if (data.cartValue > 1000) score += 2
    else if (data.cartValue > 500) score += 1

    // Pontos por páginas visitadas (0.2 por página, máximo 1 ponto)
    score += Math.min(data.pagesVisited * 0.2, 1)

    // Pontos por sinais de urgência (0.5 por sinal, máximo 2 pontos)
    score += Math.min(data.urgencySignals.length * 0.5, 2)

    return Math.min(Math.round(score * 10) / 10, 10) // Máximo 10
  }, [])

  // Detectar sinais de urgência
  const detectUrgencySignals = useCallback((action: string, data?: any) => {
    const signals = journeyData.current.urgencySignals

    switch (action) {
      case 'product_view_multiple':
        if (data.viewCount >= 3) {
          signals.push('visualizou_mesmo_produto_multiplas_vezes')
        }
        break
      case 'quick_product_switches':
        signals.push('alternando_produtos_rapidamente')
        break
      case 'cart_add_remove_cycle':
        signals.push('adicionando_removendo_carrinho')
        break
      case 'high_value_item':
        if (data.value > 1000) {
          signals.push('interessado_item_alto_valor')
        }
        break
      case 'search_specific':
        if (data.query.length > 10) {
          signals.push('busca_especifica_detalhada')
        }
        break
      case 'long_session':
        if (data.minutes > 15) {
          signals.push('sessao_longa_engajamento')
        }
        break
    }

    // Remove duplicatas
    journeyData.current.urgencySignals = [...new Set(signals)]
  }, [])

  // Salvar dados da jornada na API
  const saveJourneyData = useCallback(async (endReason: string) => {
    const data = journeyData.current
    
    // Calcular tempo total da sessão
    const totalTime = Math.floor((Date.now() - data.sessionStart.getTime()) / 1000)
    
    // Detectar sinais de urgência baseados no tempo
    detectUrgencySignals('long_session', { minutes: totalTime / 60 })

    // Calcular score final
    const finalScore = calculateInterestScore()

    const journeyPayload = {
      sessionId: data.sessionId,
      sessionStart: data.sessionStart,
      sessionEnd: new Date(),
      totalTime,
      pagesVisited: data.pagesVisited,
      productsViewed: data.productsViewed,
      searchQueries: data.searchQueries,
      cartItems: data.cartItems,
      cartValue: data.cartValue,
      cartAbandoned: data.cartItems.length > 0 && endReason !== 'order_completed',
      interestScore: finalScore,
      urgencySignals: data.urgencySignals,
      behaviorFlags: data.behaviorFlags,
      endReason,
      userAgent: navigator.userAgent,
      // Adicionar dados de localização se disponível
      location: (window as any).userLocation || null
    }

    try {
      await fetch('/api/user-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journeyPayload)
      })
    } catch (error) {
      console.error('Erro ao salvar jornada:', error)
    }
  }, [])

  // Resetar timeout da sessão
  const resetSessionTimeout = useCallback(() => {
    lastActivityTime.current = new Date()
    
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current)
    }

    // Timeout de 30 minutos por padrão
    sessionTimeoutRef.current = setTimeout(() => {
      saveJourneyData('timeout')
    }, 30 * 60 * 1000)
  }, [])

  // Tracking de página visitada
  const trackPageView = useCallback((pagePath: string) => {
    journeyData.current.pagesVisited += 1
    pageStartTime.current = new Date()
    resetSessionTimeout()
  }, [])

  // Tracking de produto visualizado
  const trackProductView = useCallback((product: { id: number, name: string, price: number }) => {
    const startTime = Date.now()
    
    return {
      onLeave: () => {
        const viewTime = Math.floor((Date.now() - startTime) / 1000)
        
        // Verificar se já visualizou este produto
        const existingView = journeyData.current.productsViewed.find(p => p.id === product.id)
        
        if (existingView) {
          existingView.viewTime += viewTime
          detectUrgencySignals('product_view_multiple', { viewCount: 2 })
        } else {
          journeyData.current.productsViewed.push({
            ...product,
            viewTime,
            timestamp: new Date()
          })
        }

        if (viewTime > 30) {
          journeyData.current.behaviorFlags.push('visualizacao_detalhada')
        }

        if (product.price > 1000) {
          detectUrgencySignals('high_value_item', { value: product.price })
        }
      }
    }
  }, [])

  // Tracking de busca
  const trackSearch = useCallback((query: string) => {
    journeyData.current.searchQueries.push(query)
    detectUrgencySignals('search_specific', { query })
    resetSessionTimeout()
  }, [])

  // Tracking de carrinho
  const trackCartAction = useCallback((action: 'add' | 'remove' | 'update', item: CartItem) => {
    const cart = journeyData.current.cartItems
    
    if (action === 'add') {
      const existingIndex = cart.findIndex(i => i.id === item.id)
      if (existingIndex >= 0) {
        cart[existingIndex] = { ...item, addedAt: new Date() }
      } else {
        cart.push({ ...item, addedAt: new Date() })
      }
    } else if (action === 'remove') {
      const index = cart.findIndex(i => i.id === item.id)
      if (index >= 0) {
        cart.splice(index, 1)
        detectUrgencySignals('cart_add_remove_cycle', {})
      }
    }

    // Recalcular valor do carrinho
    journeyData.current.cartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    resetSessionTimeout()
  }, [])

  // Tracking de WhatsApp fornecido
  const trackWhatsAppProvided = useCallback((phoneNumber: string) => {
    saveJourneyData('whatsapp_provided')
  }, [])

  // Tracking de pedido concluído
  const trackOrderCompleted = useCallback(() => {
    saveJourneyData('order_completed')
  }, [])

  // Inicializar tracking
  useEffect(() => {
    // Gerar session ID único
    journeyData.current.sessionId = generateSessionId()
    journeyData.current.sessionStart = new Date()
    
    // Adicionar listener para quando o usuário sair da página
    const handleBeforeUnload = () => {
      saveJourneyData('manual_exit')
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveJourneyData('manual_exit')
      }
    }

    // Adicionar listeners apenas uma vez
    if (!isBeforeUnloadListenerAdded.current) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      isBeforeUnloadListenerAdded.current = true
    }

    // Iniciar timeout da sessão
    resetSessionTimeout()

    return () => {
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current)
      }
    }
  }, []) // Remover dependências que causam recriações

  return {
    sessionId: journeyData.current.sessionId,
    trackPageView,
    trackProductView,
    trackSearch,
    trackCartAction,
    trackWhatsAppProvided,
    trackOrderCompleted,
    getJourneyData: () => journeyData.current,
    getCurrentScore: calculateInterestScore
  }
}