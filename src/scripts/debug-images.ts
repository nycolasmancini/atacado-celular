import { prisma } from '../lib/prisma'

async function debugImages() {
  try {
    console.log('🔍 Verificando imagens dos produtos...')
    
    const products = await prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        isActive: true
      }
    })

    console.log(`\n📊 Encontrados ${products.length} produtos:`)
    
    products.forEach(product => {
      console.log(`\n📦 Produto ID: ${product.id}`)
      console.log(`   Nome: ${product.name}`)
      console.log(`   ImageUrl: ${product.imageUrl || 'NULL'}`)
      console.log(`   Ativo: ${product.isActive}`)
      console.log(`   URL válida: ${product.imageUrl ? 'SIM' : 'NÃO'}`)
    })

    // Check if we have any products with images
    const withImages = products.filter(p => p.imageUrl)
    const withoutImages = products.filter(p => !p.imageUrl)
    
    console.log(`\n📈 Estatísticas:`)
    console.log(`   Com imagem: ${withImages.length}`)
    console.log(`   Sem imagem: ${withoutImages.length}`)
    
    if (withImages.length > 0) {
      console.log(`\n🖼️ Exemplo de URLs de imagens encontradas:`)
      withImages.slice(0, 3).forEach(product => {
        console.log(`   ${product.imageUrl}`)
      })
    }

  } catch (error) {
    console.error('❌ Erro ao verificar imagens:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugImages().catch(console.error)