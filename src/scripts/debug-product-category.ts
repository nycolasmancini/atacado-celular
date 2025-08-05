import { prisma } from '../lib/prisma'

async function debugProductCategory() {
  try {
    console.log('🔍 Verificando categorias dos produtos...')
    
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })

    console.log(`📊 Encontrados ${products.length} produtos:`)
    
    products.forEach(product => {
      console.log(`\n📦 Produto ID: ${product.id}`)
      console.log(`   Nome: ${product.name}`)
      console.log(`   Category ID: ${product.categoryId}`)
      console.log(`   Category: ${product.category ? product.category.name : 'SEM CATEGORIA'}`)
      console.log(`   Ativo: ${product.isActive}`)
      console.log(`   ImageUrl: ${product.imageUrl || 'NULL'}`)
    })

    // Check categories
    const categories = await prisma.category.findMany()
    console.log(`\n📁 Categorias disponíveis (${categories.length}):`)
    categories.forEach(category => {
      console.log(`   ID: ${category.id} - ${category.name} (${category.slug})`)
    })

  } catch (error) {
    console.error('❌ Erro ao verificar produto/categoria:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugProductCategory().catch(console.error)