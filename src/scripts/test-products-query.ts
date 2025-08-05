import { prisma } from '../lib/prisma'

async function testProductsQuery() {
  try {
    console.log('🔍 Testando query de produtos similar à API...')
    
    const productsQuery = `
      SELECT 
        p.id, p.name, p.slug, p.description, p.brand, p.price, 
        p.specialPrice, p.specialPriceMinQty, p.imageUrl, p.modelsImageUrl,
        p.createdAt, p.updatedAt,
        c.id as categoryId, c.name as categoryName, c.slug as categorySlug, 
        COALESCE(c.displayOrder, 999) as categoryOrder
      FROM products p
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.isActive = 1
      ORDER BY 
        COALESCE(c.displayOrder, 999) ASC,
        p.name ASC
      LIMIT 20 OFFSET 0
    `;
    
    console.log('SQL Query:', productsQuery);
    
    const rawProducts = await prisma.$queryRawUnsafe(productsQuery) as any[];
    
    console.log(`📊 Query retornou ${rawProducts.length} produtos:`);
    
    rawProducts.forEach(p => {
      console.log(`\n📦 Produto:`)
      console.log(`   ID: ${p.id}`)
      console.log(`   Nome: ${p.name}`)
      console.log(`   ImageUrl: ${p.imageUrl}`)
      console.log(`   Categoria: ${p.categoryName}`)
      console.log(`   Order: ${p.categoryOrder}`)
    })

  } catch (error) {
    console.error('❌ Erro na query:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testProductsQuery().catch(console.error)