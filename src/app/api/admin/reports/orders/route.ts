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

    const orderEvents = await prisma.trackingEvent.findMany({
      where: {
        eventType: 'order_completed',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const orderStats = orderEvents.map(event => ({
      id: event.sessionId,
      phoneNumber: event.phoneNumber || 'N/A',
      totalAmount: event.metadata?.totalAmount || 0,
      itemCount: event.metadata?.itemCount || 0,
      createdAt: event.createdAt,
      metadata: event.metadata
    }))

    return NextResponse.json(orderStats)
  } catch (error) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}