import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }

    const whatsappEvents = await prisma.trackingEvent.findMany({
      where: {
        eventType: 'WHATSAPP_SUBMITTED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const whatsappStats = whatsappEvents.map(event => ({
      sessionId: event.sessionId,
      phoneNumber: event.phoneNumber,
      createdAt: event.createdAt,
      userAgent: event.userAgent,
      ipAddress: event.ipAddress
    }))

    return NextResponse.json(whatsappStats)
  } catch (error) {
    console.error('Error fetching WhatsApp stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}