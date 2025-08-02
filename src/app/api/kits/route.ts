import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching kits from database...')
    
    // Test database connection first
    await prisma.$connect()
    console.log('Database connected successfully')
    
    const kits = await prisma.kit.findMany({
      take: 3,
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    console.log(`Found ${kits.length} kits`)

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
          specialPrice: Number(item.product.specialPrice),
          category: item.product.category
        }
      }))
    }))

    console.log('Returning serialized kits')
    return NextResponse.json(serializedKits)
  } catch (error) {
    console.error('Error fetching kits:', error)
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch kits',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}