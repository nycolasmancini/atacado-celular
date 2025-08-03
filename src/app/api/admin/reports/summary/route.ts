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

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    // Get WhatsApp events
    const whatsappEvents = await prisma.trackingEvent.findMany({
      where: {
        eventType: 'whatsapp_submitted',
        createdAt: {
          gte: startDateObj,
          lte: endDateObj
        }
      }
    })

    // Get order events  
    const orderEvents = await prisma.trackingEvent.findMany({
      where: {
        eventType: 'order_completed',
        createdAt: {
          gte: startDateObj,
          lte: endDateObj
        }
      }
    })

    const totalWhatsApps = whatsappEvents.length
    const totalOrders = orderEvents.length
    const conversionRate = totalWhatsApps > 0 ? (totalOrders / totalWhatsApps) * 100 : 0
    const averageTicket = totalOrders > 0 
      ? orderEvents.reduce((sum, event) => sum + (event.metadata?.totalAmount || 0), 0) / totalOrders 
      : 0

    const summary = {
      totalWhatsApps,
      totalOrders,
      conversionRate,
      averageTicket
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching report summary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}