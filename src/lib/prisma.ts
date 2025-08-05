import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
})

// Conecta explicitamente ao banco
prisma.$connect().catch((e) => {
  console.error('Failed to connect to database:', e)
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma