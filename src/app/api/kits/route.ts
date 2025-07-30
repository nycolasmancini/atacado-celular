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

    // Converter Decimal para number para serialização JSON
    const serializedKits = kits.map(kit => ({
      ...kit,
      totalPrice: Number(kit.totalPrice),
      discount: Number(kit.discount),
      items: kit.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: Number(item.product.price),
          specialPrice: Number(item.product.specialPrice)
        }
      }))
    }))

    return NextResponse.json(serializedKits)
  } catch (error) {
    console.error('Error fetching kits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch kits' },
      { status: 500 }
    )
  }
}