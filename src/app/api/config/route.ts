import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { avatarWhatsappUrl } = body

    // Validar dados
    if (!avatarWhatsappUrl || typeof avatarWhatsappUrl !== 'string') {
      return NextResponse.json(
        { error: 'URL do avatar é obrigatória' },
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
          updatedAt: new Date()
        }
      })
    } else {
      // Criar nova configuração
      config = await prisma.siteConfig.create({
        data: {
          avatarWhatsappUrl
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