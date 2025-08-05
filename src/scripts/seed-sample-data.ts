import { prisma } from '../lib/prisma'

async function seedSampleData() {
  console.log('🌱 Seeding sample data...')

  try {
    // Create sample categories with display order
    const categories = [
      { name: 'Fones de Ouvido', slug: 'fones-de-ouvido', displayOrder: 10 },
      { name: 'Cabos', slug: 'cabos', displayOrder: 20 },
      { name: 'Capinhas', slug: 'capinhas', displayOrder: 30 },
      { name: 'Carregadores', slug: 'carregadores', displayOrder: 40 },
    ]

    console.log('📁 Creating categories...')
    const createdCategories = []
    for (const category of categories) {
      const created = await prisma.category.create({
        data: {
          ...category,
          isActive: true
        }
      })
      createdCategories.push(created)
      console.log(`  ✅ ${created.name} (order: ${created.displayOrder})`)
    }

    // Create sample brands with display order
    const brands = [
      { name: 'Apple', slug: 'apple', displayOrder: 10 },
      { name: 'Samsung', slug: 'samsung', displayOrder: 20 },
      { name: 'Xiaomi', slug: 'xiaomi', displayOrder: 30 },
      { name: 'PMCELL', slug: 'pmcell', displayOrder: 40 },
    ]

    console.log('🏷️ Creating brands...')
    const createdBrands = []
    for (const brand of brands) {
      const created = await prisma.brand.create({
        data: {
          ...brand,
          isActive: true
        }
      })
      createdBrands.push(created)
      console.log(`  ✅ ${created.name} (order: ${created.displayOrder})`)
    }

    // Create sample products
    const products = [
      {
        name: 'AirPods Pro 2',
        slug: 'airpods-pro-2',
        description: 'Fones de ouvido sem fio com cancelamento de ruído',
        price: 299.99,
        specialPrice: 249.99,
        specialPriceMinQty: 10,
        categoryId: createdCategories[0].id, // Fones de Ouvido
        brandId: createdBrands[0].id, // Apple
        brand: 'Apple', // Keep for compatibility
        isActive: true
      },
      {
        name: 'Galaxy Buds Pro',
        slug: 'galaxy-buds-pro',
        description: 'Fones de ouvido Samsung com qualidade premium',
        price: 199.99,
        specialPrice: 169.99,
        specialPriceMinQty: 15,
        categoryId: createdCategories[0].id, // Fones de Ouvido
        brandId: createdBrands[1].id, // Samsung
        brand: 'Samsung',
        isActive: true
      },
      {
        name: 'Cabo USB-C Premium',
        slug: 'cabo-usbc-premium',
        description: 'Cabo USB-C resistente de alta qualidade',
        price: 29.99,
        specialPrice: 19.99,
        specialPriceMinQty: 20,
        categoryId: createdCategories[1].id, // Cabos
        brandId: createdBrands[3].id, // PMCELL
        brand: 'PMCELL',
        isActive: true
      },
      {
        name: 'Capinha iPhone 15 Pro',
        slug: 'capinha-iphone-15-pro',
        description: 'Capinha transparente com proteção total',
        price: 39.99,
        specialPrice: 29.99,
        specialPriceMinQty: 25,
        categoryId: createdCategories[2].id, // Capinhas
        brandId: createdBrands[0].id, // Apple
        brand: 'Apple',
        isActive: true
      },
      {
        name: 'Carregador Turbo 65W',
        slug: 'carregador-turbo-65w',
        description: 'Carregador rápido universal 65W',
        price: 89.99,
        specialPrice: 69.99,
        specialPriceMinQty: 12,
        categoryId: createdCategories[3].id, // Carregadores
        brandId: createdBrands[2].id, // Xiaomi
        brand: 'Xiaomi',
        isActive: true
      }
    ]

    console.log('📱 Creating products...')
    for (const product of products) {
      const created = await prisma.product.create({
        data: product
      })
      console.log(`  ✅ ${created.name} - ${createdCategories.find(c => c.id === created.categoryId)?.name} / ${createdBrands.find(b => b.id === created.brandId)?.name}`)
    }

    console.log('✨ Sample data seeded successfully!')
    console.log(`📊 Created:`)
    console.log(`  - ${createdCategories.length} categories`)
    console.log(`  - ${createdBrands.length} brands`)
    console.log(`  - ${products.length} products`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedSampleData().catch(console.error)
}

export { seedSampleData }