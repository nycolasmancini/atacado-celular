import { NextRequest, NextResponse } from 'next/server'
import { ConversionMetrics } from '@/lib/analytics'

// Mock data - em produção, isso viria do banco de dados
async function getConversionData(startDate: Date, endDate: Date): Promise<ConversionMetrics> {
  // Simula uma consulta ao banco de dados
  // Em produção, isso seria substituído por queries reais ao seu banco
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // Gera dados mock baseados no período
  const totalVisitors = Math.floor(Math.random() * 500 + 200) * daysDiff
  const totalLeads = Math.floor(totalVisitors * 0.08) // 8% conversion rate
  const totalPurchases = Math.floor(totalLeads * 0.15) // 15% of leads convert to purchase
  const contentViews = Math.floor(totalVisitors * 0.75) // 75% view content
  
  const dailyConversions = []
  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const visitors = Math.floor(Math.random() * 80 + 30)
    const leads = Math.floor(visitors * (Math.random() * 0.15 + 0.05)) // 5-20% conversion
    const orders = Math.floor(leads * (Math.random() * 0.3 + 0.1)) // 10-40% of leads convert
    
    dailyConversions.push({
      date: date.toISOString().split('T')[0],
      visitors,
      leads,
      orders
    })
  }

  return {
    totalLeads,
    conversionRate: totalVisitors > 0 ? (totalLeads / totalVisitors) * 100 : 0,
    averageOrderValue: 650 + Math.random() * 400, // R$ 650-1050
    topProducts: [
      { id: 1, name: 'iPhone 15 Pro Max 256GB', views: 180, conversions: 12 },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', views: 145, conversions: 9 },
      { id: 3, name: 'Kit Película 3D Premium', views: 220, conversions: 28 },
      { id: 4, name: 'AirPods Pro 2ª Geração', views: 165, conversions: 14 },
      { id: 5, name: 'Carregador Wireless MagSafe', views: 98, conversions: 7 }
    ],
    dailyConversions,
    funnelData: {
      visitors: totalVisitors,
      contentViews,
      leads: totalLeads,
      purchases: totalPurchases
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startDate, endDate } = body

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate e endDate são obrigatórios' },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start > end) {
      return NextResponse.json(
        { error: 'startDate deve ser anterior a endDate' },
        { status: 400 }
      )
    }

    const metrics = await getConversionData(start, end)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Erro ao buscar métricas de conversão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Endpoint GET para métricas dos últimos 7 dias
  try {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    const metrics = await getConversionData(startDate, endDate)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Erro ao buscar métricas de conversão:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}