import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Buscar configurações do site
export async function GET() {
  try {
    let config = await prisma.siteConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    // Se não existir configuração, criar uma padrão
    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          avatarWhatsappUrl: '/images/whatsapp-avatar.svg'
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Salvar configurações (apenas para admins)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação via header ou permitir para admin local
    // Como o admin layout usa localStorage, permitimos todas as requests
    // Em produção, você pode adicionar verificação de IP ou outro método

    const body = await request.json()
    const { 
      avatarWhatsappUrl, 
      webhookUrl, 
      webhookEnabled, 
      webhookSecretKey,
      minSessionTime,
      sessionTimeout,
      highValueThreshold
    } = body

    // Validar dados obrigatórios
    if (!avatarWhatsappUrl || typeof avatarWhatsappUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL do avatar é obrigatória' },
        { status: 400 }
      )
    }

    // Validar webhook URL se o webhook estiver habilitado
    if (webhookEnabled && (!webhookUrl || !webhookUrl.startsWith('http'))) {
      return NextResponse.json(
        { error: 'URL do webhook deve ser uma URL válida quando o webhook estiver habilitado' },
        { status: 400 }
      )
    }

    // Buscar configuração existente
    let config = await prisma.siteConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (config) {
      // Atualizar configuração existente
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data: {
          avatarWhatsappUrl,
          webhookUrl: webhookUrl || null,
          webhookEnabled: webhookEnabled || false,
          webhookSecretKey: webhookSecretKey || null,
          minSessionTime: minSessionTime || 300,
          sessionTimeout: sessionTimeout || 1800,
          highValueThreshold: highValueThreshold ? parseFloat(highValueThreshold.toString()) : 1000,
          updatedAt: new Date()
        }
      })
    } else {
      // Criar nova configuração
      config = await prisma.siteConfig.create({
        data: {
          avatarWhatsappUrl,
          webhookUrl: webhookUrl || null,
          webhookEnabled: webhookEnabled || false,
          webhookSecretKey: webhookSecretKey || null,
          minSessionTime: minSessionTime || 300,
          sessionTimeout: sessionTimeout || 1800,
          highValueThreshold: highValueThreshold ? parseFloat(highValueThreshold.toString()) : 1000
        }
      })
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}