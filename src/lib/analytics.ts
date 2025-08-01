export interface ConversionMetrics {
  totalLeads: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{
    id: number
    name: string
    views: number
    conversions: number
  }>
  dailyConversions: Array<{
    date: string
    visitors: number
    leads: number
    orders: number
  }>
  funnelData: {
    visitors: number
    contentViews: number
    leads: number
    purchases: number
  }
}

export interface AnalyticsEvent {
  id: string
  sessionId: string
  eventType: string
  eventData: any
  whatsapp?: string
  timestamp: string
  userAgent?: string
}

export interface ConversionSource {
  source: string
  leads: number
  conversions: number
  conversionRate: number
}

/**
 * Obtém métricas de conversão para um período específico
 */
export async function getConversionMetrics(
  startDate: Date, 
  endDate: Date
): Promise<ConversionMetrics> {
  try {
    const response = await fetch('/api/analytics/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      })
    })

    if (!response.ok) {
      throw new Error('Falha ao buscar métricas de conversão')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar métricas:', error)
    
    // Retorna dados mockados em caso de erro
    return getMockConversionMetrics()
  }
}

/**
 * Obtém eventos do pixel para debugging
 */
export async function getPixelEvents(limit: number = 50): Promise<AnalyticsEvent[]> {
  try {
    const response = await fetch(`/api/analytics/pixel-events?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error('Falha ao buscar eventos do pixel')
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar eventos do pixel:', error)
    return getMockPixelEvents()
  }
}

/**
 * Calcula taxas de conversão por fonte de tráfego
 */
export function calculateConversionsBySource(events: AnalyticsEvent[]): ConversionSource[] {
  const sourceMap = new Map<string, { leads: number; conversions: number }>()

  events.forEach(event => {
    const source = event.eventData?.utm_source || 'direct'
    
    if (!sourceMap.has(source)) {
      sourceMap.set(source, { leads: 0, conversions: 0 })
    }

    const sourceData = sourceMap.get(source)!
    
    if (event.eventType === 'whatsapp_submitted') {
      sourceData.leads++
    } else if (event.eventType === 'order_completed') {
      sourceData.conversions++
    }
  })

  return Array.from(sourceMap.entries()).map(([source, data]) => ({
    source,
    leads: data.leads,
    conversions: data.conversions,
    conversionRate: data.leads > 0 ? (data.conversions / data.leads) * 100 : 0
  }))
}

/**
 * Calcula tempo médio no site
 */
export function calculateAverageTimeOnSite(events: AnalyticsEvent[]): number {
  const sessions = new Map<string, { start: number; end: number }>()

  events.forEach(event => {
    const timestamp = new Date(event.timestamp).getTime()
    
    if (!sessions.has(event.sessionId)) {
      sessions.set(event.sessionId, { start: timestamp, end: timestamp })
    } else {
      const session = sessions.get(event.sessionId)!
      session.end = Math.max(session.end, timestamp)
    }
  })

  const totalTime = Array.from(sessions.values())
    .reduce((sum, session) => sum + (session.end - session.start), 0)

  return sessions.size > 0 ? totalTime / sessions.size / 1000 : 0 // em segundos
}

/**
 * Identifica produtos com maior abandono de carrinho
 */
export function getCartAbandonmentAnalysis(events: AnalyticsEvent[]) {
  const productMap = new Map<string, { views: number; addToCart: number; abandoned: number }>()

  events.forEach(event => {
    if (event.eventType === 'product_viewed' && event.eventData?.productName) {
      const productName = event.eventData.productName
      
      if (!productMap.has(productName)) {
        productMap.set(productName, { views: 0, addToCart: 0, abandoned: 0 })
      }
      
      productMap.get(productName)!.views++
    }
    
    if (event.eventType === 'cart_abandoned' && event.eventData?.items) {
      event.eventData.items.forEach((item: any) => {
        if (productMap.has(item.name)) {
          productMap.get(item.name)!.abandoned++
        }
      })
    }
  })

  return Array.from(productMap.entries()).map(([product, data]) => ({
    product,
    ...data,
    abandonmentRate: data.addToCart > 0 ? (data.abandoned / data.addToCart) * 100 : 0
  }))
}

/**
 * Dados mockados para desenvolvimento/fallback
 */
function getMockConversionMetrics(): ConversionMetrics {
  return {
    totalLeads: 45,
    conversionRate: 12.5,
    averageOrderValue: 850.30,
    topProducts: [
      { id: 1, name: 'iPhone 15 Pro Max', views: 150, conversions: 8 },
      { id: 2, name: 'Samsung Galaxy S24', views: 120, conversions: 6 },
      { id: 3, name: 'Kit Películas Premium', views: 95, conversions: 12 },
      { id: 4, name: 'Carregador Wireless', views: 80, conversions: 4 }
    ],
    dailyConversions: [
      { date: '2025-07-25', visitors: 45, leads: 6, orders: 2 },
      { date: '2025-07-26', visitors: 52, leads: 8, orders: 3 },
      { date: '2025-07-27', visitors: 38, leads: 4, orders: 1 },
      { date: '2025-07-28', visitors: 61, leads: 9, orders: 4 },
      { date: '2025-07-29', visitors: 43, leads: 5, orders: 2 },
      { date: '2025-07-30', visitors: 67, leads: 11, orders: 5 },
      { date: '2025-07-31', visitors: 54, leads: 7, orders: 3 }
    ],
    funnelData: {
      visitors: 360,
      contentViews: 285,
      leads: 50,
      purchases: 20
    }
  }
}

/**
 * Eventos mockados do pixel para desenvolvimento/fallback
 */
function getMockPixelEvents(): AnalyticsEvent[] {
  const now = new Date()
  
  return [
    {
      id: '1',
      sessionId: 'sess_123',
      eventType: 'PageView',
      eventData: { page: '/', referrer: 'https://google.com' },
      timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
      userAgent: 'Mozilla/5.0...'
    },
    {
      id: '2',
      sessionId: 'sess_123',
      eventType: 'ViewContent',
      eventData: { content_type: 'product', content_ids: ['123'], value: 299.90 },
      timestamp: new Date(now.getTime() - 1000 * 60 * 4).toISOString(),
    },
    {
      id: '3',
      sessionId: 'sess_456',
      eventType: 'Lead',
      eventData: { content_name: 'WhatsApp Form', value: 0 },
      whatsapp: '11999999999',
      timestamp: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
    },
    {
      id: '4',
      sessionId: 'sess_789',
      eventType: 'Purchase',
      eventData: { 
        content_ids: ['123', '456'], 
        value: 599.80, 
        currency: 'BRL',
        num_items: 2
      },
      whatsapp: '11888888888',
      timestamp: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: '5',
      sessionId: 'sess_101',
      eventType: 'AddToCart',
      eventData: { 
        content_ids: ['789'], 
        content_type: 'product',
        value: 149.90 
      },
      timestamp: new Date(now.getTime() - 1000 * 60 * 1).toISOString(),
    }
  ]
}

/**
 * Formata valores monetários
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata porcentagem
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/**
 * Calcula crescimento percentual entre dois períodos
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}