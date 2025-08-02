import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Buscar configurações do webhook
    const config = await prisma.siteConfig.findFirst()
    
    if (!config?.webhookUrl) {
      return NextResponse.json(
        { error: 'URL do webhook não configurada' },
        { status: 400 }
      )
    }

    // Payload de teste
    const testPayload = {
      evento: 'teste_webhook',
      timestamp: new Date().toISOString(),
      motivo: 'teste_configuracao',
      
      cliente: {
        whatsapp: '+5511999999999',
        email: 'teste@exemplo.com',
        sessao_id: 'test_session_123',
        primeira_visita: true,
        total_visitas: 1
      },
      
      resumo_jornada: {
        tempo_total: '12min 34s',
        paginas_visitadas: 8,
        origem_trafego: 'Google Ads',
        dispositivo: 'Mobile',
        localizacao: 'São Paulo, SP',
        score_interesse: 8.5
      },
      
      produtos: {
        visualizados: [
          { id: 1, nome: 'iPhone 14 Pro', tempo: '5min 20s', interesse: 'alto' },
          { id: 2, nome: 'Samsung Galaxy S23', tempo: '3min 15s', interesse: 'medio' }
        ],
        carrinho_atual: [
          { id: 1, nome: 'iPhone 14 Pro', quantidade: 1, valor: 3500.00 }
        ],
        valor_carrinho: 3500.00
      },
      
      comportamento: {
        buscas: ['iPhone 14', 'smartphone premium'],
        tempo_indecisao: 'Alto',
        sinais_urgencia: ['visualizou_mesmo_produto_multiplas_vezes', 'carrinho_abandonado'],
        flags_comportamento: ['visualizacao_detalhada', 'comparou_produtos']
      },
      
      oportunidade: {
        nivel: 'QUENTE',
        motivo: 'Carrinho abandonado com produto de alto valor',
        sugestao_abordagem: 'Oferecer desconto ou condição especial',
        melhor_momento_contato: 'agora',
        produtos_focar: [1]
      },
      
      teste: {
        enviado_em: new Date().toISOString(),
        configuracao_ativa: true,
        webhook_url: config.webhookUrl
      }
    }

    // Enviar teste do webhook
    const startTime = Date.now()
    
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'atacado-celular-webhook-test/1.0',
        ...(config.webhookSecretKey && {
          'X-Webhook-Secret': config.webhookSecretKey
        })
      },
      body: JSON.stringify(testPayload)
    })

    const responseTime = Date.now() - startTime
    const responseText = await response.text()

    // Resultado do teste
    const testResult = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      responseBody: responseText,
      headers: Object.fromEntries(response.headers),
      webhookUrl: config.webhookUrl,
      testedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: response.ok ? 'Webhook testado com sucesso!' : 'Webhook retornou erro',
      testResult
    }, { status: response.ok ? 200 : 400 })

  } catch (error) {
    console.error('Erro ao testar webhook:', error)
    
    return NextResponse.json({
      error: 'Erro ao conectar com o webhook',
      details: error.message,
      testedAt: new Date().toISOString()
    }, { status: 500 })
  }
}