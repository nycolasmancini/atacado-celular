import { prisma } from '../lib/prisma'

async function verifyAdmin() {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@atacado-celular.com' }
    })

    if (admin) {
      console.log('✅ Admin encontrado:')
      console.log(`📧 Email: ${admin.email}`)
      console.log(`👤 Nome: ${admin.name}`)
      console.log(`🎭 Role: ${admin.role}`)
      console.log(`✔️ Ativo: ${admin.isActive}`)
      console.log(`📅 Criado em: ${admin.createdAt}`)
    } else {
      console.log('❌ Admin não encontrado')
    }
  } catch (error) {
    console.error('❌ Erro ao verificar admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAdmin().catch(console.error)