import { prisma } from '../lib/prisma'
import * as bcrypt from 'bcryptjs'

async function createAdmin() {
  console.log('🔐 Criando usuário admin...')

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@atacado-celular.com' }
    })

    if (existingAdmin) {
      console.log('⚠️  Admin já existe com email: admin@atacado-celular.com')
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@atacado-celular.com',
        password: hashedPassword,
        name: 'Administrador',
        role: 'admin',
        isActive: true
      }
    })

    console.log('✅ Admin criado com sucesso!')
    console.log(`📧 Email: ${admin.email}`)
    console.log(`🔑 Senha: admin123`)
    console.log(`👤 Nome: ${admin.name}`)
    console.log(`🎭 Role: ${admin.role}`)

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run if this file is executed directly
if (require.main === module) {
  createAdmin().catch(console.error)
}

export { createAdmin }