import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const journeyData = await request.json()

    // Validar dados obrigatórios
    if (!journeyData.sessionId) {
      return NextResponse.json(
        { error: 'SessionId é obrigatório' },
        { status: 400 }
      )
    }

    // Detectar tipo de dispositivo
    const device = detectDevice(journeyData.userAgent)
    
    // Detectar localização aproximada pelo IP
    const ipAddress = getClientIP(request)
    
    // Preparar dados para salvar
    const saveData = {
      sessionId: journeyData.sessionId,
      phoneNumber: journeyData.phoneNumber || null,
      email: journeyData.email || null,
      userAgent: journeyData.userAgent || null,
      ipAddress,
      location: journeyData.location || null,
      device,
      trafficSource: journeyData.trafficSource || null,
      sessionStart: new Date(journeyData.sessionStart),
      sessionEnd: journeyData.sessionEnd ? new Date(journeyData.sessionEnd) : null,
      totalTime: journeyData.totalTime || null,
      pagesVisited: journeyData.pagesVisited || 0,
      productsViewed: journeyData.productsViewed || [],
      searchQueries: journeyData.searchQueries || [],
      cartItems: journeyData.cartItems || [],
      cartAbandoned: journeyData.cartAbandoned || false,
      cartValue: journeyData.cartValue ? parseFloat(journeyData.cartValue.toString()) : 0,
      checkoutAttempts: journeyData.checkoutAttempts || 0,
      interestScore: journeyData.interestScore ? parseFloat(journeyData.interestScore.toString()) : 0,
      urgencySignals: journeyData.urgencySignals || [],
      behaviorFlags: journeyData.behaviorFlags || [],
      endReason: journeyData.endReason || null
    }

    // Tentar atualizar se já existe, senão criar novo
    const savedJourney = await prisma.userJourney.upsert({
      where: { sessionId: journeyData.sessionId },
      update: saveData,
      create: saveData
    })

    // Verificar se deve enviar webhook
    await checkAndSendWebhook(savedJourney)

    return NextResponse.json({
      success: true,
      journeyId: savedJourney.id,
      shouldSendWebhook: shouldTriggerWebhook(savedJourney)
    })

  } catch (error) {
    console.error('Erro ao salvar jornada do usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para detectar dispositivo
function detectDevice(userAgent: string): string {
  if (!userAgent) return 'unknown'
  
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile'
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

// Função para obter IP do cliente
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || 'unknown'
}

// Função para verificar se deve enviar webhook
async function shouldTriggerWebhook(journey: any): Promise<boolean> {
  // Buscar configurações do webhook
  const config = await prisma.siteConfig.findFirst()
  
  if (!config?.webhookEnabled || !config.webhookUrl) {
    return false
  }

  // Não enviar se já foi enviado
  if (journey.webhookSent) {
    return false
  }

  // Verificar critérios de envio
  const hasMinimumTime = (journey.totalTime || 0) >= (config.minSessionTime || 300)
  const hasSignificantActivity = journey.pagesVisited >= 3 || 
                                 (journey.productsViewed && journey.productsViewed.length >= 2) ||
                                 (journey.cartItems && journey.cartItems.length > 0)
  const hasHighValue = (journey.cartValue || 0) >= (Number(config.highValueThreshold) || 1000)
  const hasPhoneNumber = !!journey.phoneNumber
  const isHighScore = journey.interestScore >= 7

  // Critérios para envio do webhook
  return hasPhoneNumber || // Sempre enviar se tem WhatsApp
         (hasMinimumTime && hasSignificantActivity) || // Sessão significativa
         hasHighValue || // Carrinho de alto valor
         isHighScore // Score alto de interesse
}

// Função para enviar webhook
async function checkAndSendWebhook(journey: any) {
  if (!await shouldTriggerWebhook(journey)) {
    return
  }

  try {
    // Buscar configurações
    const config = await prisma.siteConfig.findFirst()
    
    if (!config?.webhookUrl) {
      return
    }

    // Preparar payload do webhook
    const webhookPayload = {
      evento: 'jornada_concluida',
      timestamp: new Date().toISOString(),
      motivo: journey.endReason || 'sessao_finalizada',
      
      cliente: {
        whatsapp: journey.phoneNumber,
        email: journey.email,
        sessao_id: journey.sessionId,
        primeira_visita: true, // TODO: implementar lógica de primeira visita
        total_visitas: 1 // TODO: implementar contador de visitas
      },
      
      resumo_jornada: {
        tempo_total: `${Math.floor((journey.totalTime || 0) / 60)}min ${(journey.totalTime || 0) % 60}s`,
        paginas_visitadas: journey.pagesVisited,
        origem_trafego: journey.trafficSource || 'Direto',
        dispositivo: journey.device || 'unknown',
        localizacao: journey.location || 'Não informado',
        score_interesse: journey.interestScore
      },
      
      produtos: {
        visualizados: journey.productsViewed || [],
        carrinho_atual: journey.cartItems || [],
        valor_carrinho: journey.cartValue || 0
      },
      
      comportamento: {
        buscas: journey.searchQueries || [],
        tempo_indecisao: calculateIndecisionTime(journey),
        sinais_urgencia: journey.urgencySignals || [],
        flags_comportamento: journey.behaviorFlags || []
      },
      
      oportunidade: {
        nivel: getOpportunityLevel(journey),
        motivo: getOpportunityReason(journey),
        sugestao_abordagem: getSuggestedApproach(journey),
        melhor_momento_contato: getBestContactTime(journey),
        produtos_focar: getTopProducts(journey)
      }
    }

    // Enviar webhook
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'atacado-celular-webhook/1.0',
        ...(config.webhookSecretKey && {
          'X-Webhook-Secret': config.webhookSecretKey
        })
      },
      body: JSON.stringify(webhookPayload)
    })

    // Atualizar status do webhook
    await prisma.userJourney.update({
      where: { id: journey.id },
      data: {
        webhookSent: true,
        webhookSentAt: new Date(),
        webhookResponse: {
          status: response.status,
          statusText: response.statusText,
          sentAt: new Date().toISOString()
        }
      }
    })

  } catch (error) {
    console.error('Erro ao enviar webhook:', error)
    
    // Salvar erro no banco
    await prisma.userJourney.update({
      where: { id: journey.id },
      data: {
        webhookResponse: {
          error: error.message,
          errorAt: new Date().toISOString()
        }
      }
    })
  }
}

// Funções auxiliares para análise da oportunidade
function calculateIndecisionTime(journey: any): string {
  const products = journey.productsViewed || []
  const totalViewTime = products.reduce((sum: number, p: any) => sum + (p.viewTime || 0), 0)
  
  if (totalViewTime > 180) return 'Alto'
  if (totalViewTime > 60) return 'Médio'
  return 'Baixo'
}

function getOpportunityLevel(journey: any): 'FRIO' | 'MORNO' | 'QUENTE' {
  const score = journey.interestScore || 0
  
  if (score >= 8) return 'QUENTE'
  if (score >= 5) return 'MORNO'
  return 'FRIO'
}

function getOpportunityReason(journey: any): string {
  const cartValue = journey.cartValue || 0
  const hasPhone = !!journey.phoneNumber
  const urgencySignals = journey.urgencySignals || []
  
  if (hasPhone) return 'Cliente forneceu WhatsApp'
  if (cartValue > 1000) return 'Carrinho de alto valor'
  if (urgencySignals.length > 2) return 'Múltiplos sinais de urgência detectados'
  if (journey.cartAbandoned) return 'Abandonou carrinho com produtos'
  
  return 'Sessão com engajamento significativo'
}

function getSuggestedApproach(journey: any): string {
  const cartValue = journey.cartValue || 0
  const urgencySignals = journey.urgencySignals || []
  
  if (journey.cartAbandoned && cartValue > 500) {
    return 'Oferecer desconto ou condição especial para carrinho abandonado'
  }
  
  if (urgencySignals.includes('visualizou_mesmo_produto_multiplas_vezes')) {
    return 'Cliente indeciso sobre produto específico - oferecer esclarecimentos'
  }
  
  if (cartValue > 1000) {
    return 'Cliente com alto poder de compra - focar em qualidade e benefícios'
  }
  
  return 'Abordagem consultiva baseada nos produtos de interesse'
}

function getBestContactTime(journey: any): string {
  const endReason = journey.endReason
  const score = journey.interestScore || 0
  
  if (endReason === 'whatsapp_provided' || score >= 8) return 'agora'
  if (score >= 5) return 'em_1h'
  return 'em_algumas_horas'
}

function getTopProducts(journey: any): number[] {
  const products = journey.productsViewed || []
  
  return products
    .sort((a: any, b: any) => (b.viewTime || 0) - (a.viewTime || 0))
    .slice(0, 3)
    .map((p: any) => p.id)
}