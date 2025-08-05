import { prisma } from '../lib/prisma'

async function testCategoriesQuery() {
  try {
    console.log('🔍 Testando query de categorias...')
    
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        displayOrder: true,
        _count: {
          select: {
            products: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    console.log(`📊 Query retornou ${categories.length} categorias:`);
    
    categories.forEach(category => {
      console.log(`\n📁 Categoria:`)
      console.log(`   ID: ${category.id}`)
      console.log(`   Nome: ${category.name}`)
      console.log(`   Slug: ${category.slug}`)
      console.log(`   DisplayOrder: ${category.displayOrder}`)
      console.log(`   Produtos ativos: ${category._count.products}`)
    })

    return categories

  } catch (error) {
    console.error('❌ Erro na query de categorias:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testCategoriesQuery().catch(console.error)