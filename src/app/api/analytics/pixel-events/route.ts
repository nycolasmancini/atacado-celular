import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsEvent } from '@/lib/analytics'

// Mock data - em produção, isso viria do banco de dados
function generateMockPixelEvents(limit: number): AnalyticsEvent[] {
  const eventTypes = ['PageView', 'ViewContent', 'Lead', 'Purchase', 'AddToCart', 'Search']
  const events: AnalyticsEvent[] = []
  
  const now = new Date()
  
  for (let i = 0; i < limit; i++) {
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) // últimos 7 dias
    
    let eventData: any = {}
    let whatsapp: string | undefined
    
    switch (eventType) {
      case 'PageView':
        eventData = {
          page: ['/', '/catalogo', '/carrinho', '/admin'][Math.floor(Math.random() * 4)],
          referrer: ['https://google.com', 'https://facebook.com', 'direct', 'https://instagram.com'][Math.floor(Math.random() * 4)]
        }
        break
        
      case 'ViewContent':
        eventData = {
          content_type: 'product',
          content_ids: [`prod_${Math.floor(Math.random() * 100)}`],
          value: Math.floor(Math.random() * 1000 + 100),
          currency: 'BRL',
          content_name: ['iPhone 15', 'Samsung S24', 'Película Premium', 'AirPods'][Math.floor(Math.random() * 4)]
        }
        break
        
      case 'Lead':
        eventData = {
          content_name: 'WhatsApp Form',
          value: 0,
          lead_type: 'contact_form'
        }
        whatsapp = `119${Math.floor(Math.random() * 100000000)}`
        break
        
      case 'Purchase':
        eventData = {
          content_ids: [`prod_${Math.floor(Math.random() * 100)}`, `prod_${Math.floor(Math.random() * 100)}`],
          value: Math.floor(Math.random() * 2000 + 200),
          currency: 'BRL',
          num_items: Math.floor(Math.random() * 5 + 1),
          order_id: `order_${Date.now()}_${i}`
        }
        whatsapp = `119${Math.floor(Math.random() * 100000000)}`
        break
        
      case 'AddToCart':
        eventData = {
          content_ids: [`prod_${Math.floor(Math.random() * 100)}`],
          content_type: 'product',
          value: Math.floor(Math.random() * 500 + 50),
          currency: 'BRL'
        }
        break
        
      case 'Search':
        eventData = {
          query: ['iPhone', 'Samsung', 'película', 'carregador', 'fone'][Math.floor(Math.random() * 5)],
          search_results: Math.floor(Math.random() * 50 + 5)
        }
        break
    }
    
    events.push({
      id: `event_${i}_${timestamp.getTime()}`,
      sessionId: `sess_${Math.floor(Math.random() * 1000)}`,
      eventType,
      eventData,
      whatsapp,
      timestamp: timestamp.toISOString(),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
  }
  
  // Ordena por timestamp decrescente (mais recente primeiro)
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const eventType = searchParams.get('type')

    if (limit > 200) {
      return NextResponse.json(
        { error: 'Limite máximo de 200 eventos' },
        { status: 400 }
      )
    }

    let events = generateMockPixelEvents(limit)

    // Filtrar por tipo de evento se especificado
    if (eventType && eventType !== 'all') {
      events = events.filter(event => event.eventType === eventType)
    }

    return NextResponse.json(events)
  } catch (error) {
    console.error('Erro ao buscar eventos do pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint POST para receber eventos em tempo real (webhook)
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()

    // Validar estrutura do evento
    if (!event.eventType || !event.sessionId) {
      return NextResponse.json(
        { error: 'eventType e sessionId são obrigatórios' },
        { status: 400 }
      )
    }

    // Em produção, salvar no banco de dados
    console.log('Novo evento recebido:', event)

    // Aqui você salvaria no banco:
    // await saveEventToDatabase(event)

    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error('Erro ao salvar evento do pixel:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}