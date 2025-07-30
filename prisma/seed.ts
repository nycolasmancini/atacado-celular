import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categoria1 = await prisma.category.create({
    data: {
      name: 'Capinhas',
      slug: 'capinhas',
      description: 'Capinhas para celular'
    }
  })

  const categoria2 = await prisma.category.create({
    data: {
      name: 'Carregadores',
      slug: 'carregadores',  
      description: 'Carregadores e cabos'
    }
  })

  // Create products
  const produto1 = await prisma.product.create({
    data: {
      name: 'Capinha iPhone 15',
      slug: 'capinha-iphone-15',
      description: 'Capinha transparente para iPhone 15',
      price: 15.00,
      specialPrice: 12.00,
      specialPriceMinQty: 100,
      categoryId: categoria1.id,
      imageUrl: 'https://via.placeholder.com/300x300'
    }
  })

  const produto2 = await prisma.product.create({
    data: {
      name: 'Carregador USB-C 20W',
      slug: 'carregador-usb-c-20w',
      description: 'Carregador rápido USB-C 20W',
      price: 25.00,
      specialPrice: 20.00,
      specialPriceMinQty: 50,
      categoryId: categoria2.id,
      imageUrl: 'https://via.placeholder.com/300x300'
    }
  })

  const produto3 = await prisma.product.create({
    data: {
      name: 'Película de Vidro',
      slug: 'pelicula-vidro',
      description: 'Película de vidro temperado universal',
      price: 8.00,
      specialPrice: 6.00,
      specialPriceMinQty: 200,
      categoryId: categoria1.id,
      imageUrl: 'https://via.placeholder.com/300x300'
    }
  })

  // Create kits
  const kit1 = await prisma.kit.create({
    data: {
      name: 'Kit Proteção iPhone',
      slug: 'kit-protecao-iphone',
      description: 'Kit completo: capinha + película + carregador',
      totalPrice: 40.00,
      colorTheme: 'purple-pink',
      imageUrl: 'https://via.placeholder.com/400x300'
    }
  })

  const kit2 = await prisma.kit.create({
    data: {
      name: 'Kit Básico Android',
      slug: 'kit-basico-android',
      description: 'Kit essencial: capinha + carregador',
      totalPrice: 35.00,
      colorTheme: 'blue-green',
      imageUrl: 'https://via.placeholder.com/400x300'
    }
  })

  const kit3 = await prisma.kit.create({
    data: {
      name: 'Kit Premium',
      slug: 'kit-premium',
      description: 'Kit premium com todos os acessórios',
      totalPrice: 45.00,
      colorTheme: 'orange-yellow',
      imageUrl: 'https://via.placeholder.com/400x300'
    }
  })

  // Create kit items
  await prisma.kitItem.createMany({
    data: [
      // Kit 1
      { kitId: kit1.id, productId: produto1.id, quantity: 1 },
      { kitId: kit1.id, productId: produto3.id, quantity: 1 },
      { kitId: kit1.id, productId: produto2.id, quantity: 1 },
      
      // Kit 2
      { kitId: kit2.id, productId: produto1.id, quantity: 1 },
      { kitId: kit2.id, productId: produto2.id, quantity: 1 },
      
      // Kit 3
      { kitId: kit3.id, productId: produto1.id, quantity: 1 },
      { kitId: kit3.id, productId: produto2.id, quantity: 1 },
      { kitId: kit3.id, productId: produto3.id, quantity: 2 }
    ]
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })