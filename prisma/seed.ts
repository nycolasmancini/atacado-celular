import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@atacado-celular.com' },
    update: {},
    create: {
      email: 'admin@atacado-celular.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'admin'
    }
  })

  console.log('👤 Admin criado:', admin.email)

  // Create site configuration
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      avatarWhatsappUrl: '/images/whatsapp-avatar.svg',
      webhookEnabled: false,
      minSessionTime: 300,
      sessionTimeout: 1800,
      highValueThreshold: 1000
    }
  })

  console.log('⚙️ Configurações do site criadas')

  // Create categories
  const categoria1 = await prisma.category.upsert({
    where: { slug: 'capinhas' },
    update: {},
    create: {
      name: 'Capinhas',
      slug: 'capinhas',
      description: 'Capinhas e cases para smartphones'
    }
  })

  const categoria2 = await prisma.category.upsert({
    where: { slug: 'carregadores' },
    update: {},
    create: {
      name: 'Carregadores',
      slug: 'carregadores',  
      description: 'Carregadores, cabos e acessórios de energia'
    }
  })

  const categoria3 = await prisma.category.upsert({
    where: { slug: 'peliculas' },
    update: {},
    create: {
      name: 'Películas',
      slug: 'peliculas',
      description: 'Películas de vidro e hidrogel'
    }
  })

  const categoria4 = await prisma.category.upsert({
    where: { slug: 'fones' },
    update: {},
    create: {
      name: 'Fones de Ouvido',
      slug: 'fones',
      description: 'Fones com fio e wireless'
    }
  })

  console.log('📂 Categorias criadas')

  // Create products
  const produtos = [
    {
      name: 'Capinha iPhone 15 Pro Max',
      slug: 'capinha-iphone-15-pro-max',
      description: 'Capinha transparente resistente para iPhone 15 Pro Max com proteção anti-impacto',
      price: 18.00,
      specialPrice: 14.50,
      specialPriceMinQty: 100,
      categoryId: categoria1.id,
      imageUrl: '/images/products/capinha-iphone-15.webp',
      modelsImageUrl: '/images/products/capinha-modelos-list.webp'
    },
    {
      name: 'Carregador USB-C 20W Original',
      slug: 'carregador-usb-c-20w-original',
      description: 'Carregador rápido USB-C 20W compatível com iPhone e Android',
      price: 28.00,
      specialPrice: 22.00,
      specialPriceMinQty: 50,
      categoryId: categoria2.id,
      imageUrl: '/images/products/carregador-usb-c.webp'
    },
    {
      name: 'Película de Vidro 9H Premium',
      slug: 'pelicula-vidro-9h-premium',
      description: 'Película de vidro temperado 9H com oleofóbico anti-digital',
      price: 12.00,
      specialPrice: 8.50,
      specialPriceMinQty: 200,
      categoryId: categoria3.id,
      imageUrl: '/images/products/pelicula-vidro.webp',
      modelsImageUrl: '/images/products/pelicula-modelos-list.webp'
    },
    {
      name: 'Fone Bluetooth TWS Pro',
      slug: 'fone-bluetooth-tws-pro',
      description: 'Fone de ouvido sem fio com cancelamento de ruído e case carregador',
      price: 45.00,
      specialPrice: 35.00,
      specialPriceMinQty: 30,
      categoryId: categoria4.id,
      imageUrl: '/images/products/fone-tws.webp'
    },
    {
      name: 'Cabo USB-C para Lightning 1m',
      slug: 'cabo-usb-c-lightning',
      description: 'Cabo certificado MFi para carregamento rápido iPhone',
      price: 22.00,
      specialPrice: 18.00,
      specialPriceMinQty: 80,
      categoryId: categoria2.id,
      imageUrl: '/images/products/cabo-lightning.webp'
    },
    {
      name: 'Capinha Samsung Galaxy S24',
      slug: 'capinha-samsung-s24',
      description: 'Capinha silicone premium para Samsung Galaxy S24',
      price: 16.00,
      specialPrice: 13.00,
      specialPriceMinQty: 120,
      categoryId: categoria1.id,
      imageUrl: '/images/products/capinha-samsung.webp',
      modelsImageUrl: '/images/products/capinha-samsung-modelos-list.webp'
    }
  ]

  const produtosCriados = []
  for (const produtoData of produtos) {
    const produto = await prisma.product.upsert({
      where: { slug: produtoData.slug },
      update: {},
      create: produtoData
    })
    produtosCriados.push(produto)
  }

  console.log(`📱 ${produtosCriados.length} produtos criados`)

  // Create kits
  const kits = [
    {
      name: 'Kit Proteção iPhone Premium',
      slug: 'kit-protecao-iphone-premium',
      description: 'Kit completo: Capinha + Película 9H + Carregador 20W para iPhone',
      totalPrice: 55.00,
      discount: 15,
      colorTheme: 'purple-pink',
      imageUrl: '/images/kits/kit-iphone-premium.webp',
      items: [
        { productIndex: 0, quantity: 1 }, // Capinha iPhone
        { productIndex: 2, quantity: 1 }, // Película
        { productIndex: 1, quantity: 1 }  // Carregador
      ]
    },
    {
      name: 'Kit Essencial Samsung',
      slug: 'kit-essencial-samsung',
      description: 'Kit básico: Capinha + Carregador para Samsung Galaxy',
      totalPrice: 42.00,
      discount: 10,
      colorTheme: 'blue-green',
      imageUrl: '/images/kits/kit-samsung-essencial.webp',
      items: [
        { productIndex: 5, quantity: 1 }, // Capinha Samsung
        { productIndex: 1, quantity: 1 }  // Carregador
      ]
    },
    {
      name: 'Kit Completo Audio',
      slug: 'kit-completo-audio',
      description: 'Kit premium: Fone TWS + Cabo Lightning + Película',
      totalPrice: 75.00,
      discount: 20,
      colorTheme: 'orange-yellow',
      imageUrl: '/images/kits/kit-audio-completo.webp',
      items: [
        { productIndex: 3, quantity: 1 }, // Fone TWS
        { productIndex: 4, quantity: 1 }, // Cabo Lightning
        { productIndex: 2, quantity: 1 }  // Película
      ]
    }
  ]

  const kitsCriados = []
  for (const kitData of kits) {
    const { items, ...kitInfo } = kitData
    const kit = await prisma.kit.upsert({
      where: { slug: kitData.slug },
      update: {},
      create: kitInfo
    })
    kitsCriados.push(kit)

    // Create kit items
    for (const item of items) {
      await prisma.kitItem.upsert({
        where: {
          kitId_productId: {
            kitId: kit.id,
            productId: produtosCriados[item.productIndex].id
          }
        },
        update: {},
        create: {
          kitId: kit.id,
          productId: produtosCriados[item.productIndex].id,
          quantity: item.quantity
        }
      })
    }
  }

  console.log(`📦 ${kitsCriados.length} kits criados com seus itens`)

  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('🔑 Credenciais de acesso:')
  console.log('   Email: admin@atacado-celular.com')
  console.log('   Senha: admin123')
  console.log('')
  console.log('📊 Dados criados:')
  console.log(`   - ${Object.keys(categoria1).length > 0 ? '4' : '0'} categorias`)
  console.log(`   - ${produtosCriados.length} produtos`)
  console.log(`   - ${kitsCriados.length} kits`)
  console.log(`   - 1 usuário admin`)
  console.log(`   - Configurações do site`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })