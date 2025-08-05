import { prisma } from '../lib/prisma'

async function fixImageUrls() {
  try {
    console.log('🔧 Atualizando URLs das imagens dos produtos...')
    
    // Find all products with admin image URLs
    const products = await prisma.product.findMany({
      where: {
        imageUrl: {
          startsWith: '/api/admin/files/'
        }
      },
      select: {
        id: true,
        name: true,
        imageUrl: true
      }
    })

    console.log(`📊 Encontrados ${products.length} produtos com URLs administrativas`)

    if (products.length === 0) {
      console.log('✅ Nenhum produto para atualizar')
      return
    }

    // Update each product
    const updatePromises = products.map(product => {
      if (!product.imageUrl) return null
      
      // Convert /api/admin/files/filename to /api/files/filename
      const newImageUrl = product.imageUrl.replace('/api/admin/files/', '/api/files/')
      
      console.log(`🔄 Produto ${product.id}: ${product.imageUrl} → ${newImageUrl}`)
      
      return prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newImageUrl }
      })
    }).filter(Boolean)

    await Promise.all(updatePromises)

    console.log('✅ URLs das imagens atualizadas com sucesso!')
    console.log(`📈 ${updatePromises.length} produtos atualizados`)

  } catch (error) {
    console.error('❌ Erro ao atualizar URLs das imagens:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

fixImageUrls().catch(console.error)