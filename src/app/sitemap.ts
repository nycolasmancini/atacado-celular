import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://atacado-celular.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/carrinho`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Dynamic pages from database
    const [kits, categories, products] = await Promise.all([
      prisma.kit.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true }
      }),
      prisma.category.findMany({
        select: { id: true, updatedAt: true }
      }),
      prisma.product.findMany({
        select: { id: true, updatedAt: true },
        where: { isActive: true }
      })
    ])

    // Kit pages
    const kitPages = kits.map(kit => ({
      url: `${baseUrl}/kits/${kit.id}`,
      lastModified: kit.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Category pages
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categorias/${category.id}`,
      lastModified: category.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Product pages
    const productPages = products.map(product => ({
      url: `${baseUrl}/produtos/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [
      ...staticPages,
      ...kitPages,
      ...categoryPages,
      ...productPages,
    ]

  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages only if database fails
    return staticPages
  }
}