import { prisma } from '../lib/prisma'

async function migrateOrdering() {
  console.log('🚀 Starting ordering migration...')

  try {
    // 1. Update categories with display order (current order alphabetically)
    console.log('📁 Updating category display orders...')
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    for (let i = 0; i < categories.length; i++) {
      await prisma.category.update({
        where: { id: categories[i].id },
        data: { displayOrder: (i + 1) * 10 } // Use increments of 10 to allow insertion
      })
      console.log(`  ✅ ${categories[i].name}: order ${(i + 1) * 10}`)
    }

    // 2. Create brands from existing product brands
    console.log('🏷️ Creating brands from existing products...')
    const productsWithBrands = await prisma.product.findMany({
      where: {
        brand: { not: null },
        brand: { not: '' }
      },
      select: { brand: true }
    })

    // Get unique brand names
    const uniqueBrands = [...new Set(productsWithBrands.map(p => p.brand).filter(Boolean))]
    console.log(`Found ${uniqueBrands.length} unique brands:`, uniqueBrands)

    // Create brand records
    const createdBrands = new Map()
    for (let i = 0; i < uniqueBrands.length; i++) {
      const brandName = uniqueBrands[i]!
      const slug = brandName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      try {
        const brand = await prisma.brand.create({
          data: {
            name: brandName,
            slug: slug,
            displayOrder: (i + 1) * 10,
            isActive: true
          }
        })
        createdBrands.set(brandName, brand.id)
        console.log(`  ✅ Created brand: ${brandName} (${slug}) - order ${(i + 1) * 10}`)
      } catch (error) {
        // Brand might already exist, try to find it
        const existingBrand = await prisma.brand.findUnique({ where: { slug } })
        if (existingBrand) {
          createdBrands.set(brandName, existingBrand.id)
          console.log(`  ⚠️ Brand already exists: ${brandName}`)
        } else {
          console.error(`  ❌ Failed to create brand: ${brandName}`, error)
        }
      }
    }

    // 3. Update products to link to brand records
    console.log('🔗 Linking products to brand records...')
    let updatedProducts = 0
    for (const [brandName, brandId] of createdBrands.entries()) {
      const result = await prisma.product.updateMany({
        where: { brand: brandName },
        data: { brandId: brandId }
      })
      updatedProducts += result.count
      console.log(`  ✅ Linked ${result.count} products to brand: ${brandName}`)
    }

    console.log('✨ Migration completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`  - Updated ${categories.length} categories with display orders`)
    console.log(`  - Created ${createdBrands.size} brand records`)
    console.log(`  - Linked ${updatedProducts} products to brands`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateOrdering().catch(console.error)
}

export { migrateOrdering }