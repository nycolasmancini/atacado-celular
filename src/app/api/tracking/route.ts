import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const trackingSchema = z.object({
  sessionId: z.string().min(1),
  eventType: z.string().min(1),
  eventData: z.any().optional(),
  whatsapp: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, eventType, eventData, whatsapp } = trackingSchema.parse(body)

    // Get user agent and IP for additional context
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    // Save tracking event to database
    await prisma.trackingEvent.create({
      data: {
        sessionId,
        eventType,
        phoneNumber: whatsapp,
        userAgent,
        ipAddress,
        metadata: eventData || {}
      }
    })

    return NextResponse.json({
      success: true
    }, { status: 200 })

  } catch (error) {
    console.error('Tracking API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: error.issues
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