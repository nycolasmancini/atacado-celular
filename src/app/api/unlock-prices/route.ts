import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { webhookClient } from '@/lib/webhooks'

// Brazilian WhatsApp regex: (XX) XXXXX-XXXX
const WHATSAPP_REGEX = /^\(\d{2}\)\s\d{5}-\d{4}$/

const unlockPricesSchema = z.object({
  whatsapp: z.string().regex(WHATSAPP_REGEX, 'WhatsApp deve estar no formato (XX) XXXXX-XXXX')
})

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX = 5 // 5 attempts per window

function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown'

    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Muitas tentativas. Tente novamente em alguns minutos.',
          resetTime: rateLimit.resetTime
        }
      }, { status: 429 })
    }

    const body = await request.json()
    const { whatsapp } = unlockPricesSchema.parse(body)

    // Track the WhatsApp submission event
    const sessionId = request.headers.get('x-session-id') || 'anonymous'
    const userAgent = request.headers.get('user-agent') || undefined

    await prisma.trackingEvent.create({
      data: {
        sessionId,
        eventType: 'whatsapp_submitted',
        phoneNumber: whatsapp,
        userAgent,
        ipAddress: ip,
        metadata: {
          source: 'landing',
          timestamp: new Date().toISOString()
        }
      }
    })

    // Send webhook to n8n
    await webhookClient.sendWhatsAppCaptured({
      whatsapp,
      source: 'landing',
      sessionId
    })

    // Calculate expiration date (7 days from now)
    const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000)

    return NextResponse.json({
      success: true,
      expiresAt
    }, { status: 200 })

  } catch (error) {
    console.error('Unlock prices API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_WHATSAPP',
          message: 'WhatsApp deve estar no formato (XX) XXXXX-XXXX'
        }
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erro interno do servidor'
      }
    }, { status: 500 })
  }
}