import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      take: 3,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json(kits)
  } catch (error) {
    console.error('Error fetching kits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch kits' },
      { status: 500 }
    )
  }
}