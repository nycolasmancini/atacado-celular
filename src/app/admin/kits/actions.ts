'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface UpdateKitData {
  name: string
  description: string
  items: Array<{
    productId: number
    quantity: number
  }>
}

export async function updateKit(id: number, data: UpdateKitData) {
  try {
    // Validações básicas
    if (!data.name.trim()) {
      throw new Error('Nome do kit é obrigatório')
    }

    if (data.items.length < 5) {
      throw new Error('Kit deve ter pelo menos 5 produtos')
    }

    const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0)
    if (totalQuantity < 30) {
      throw new Error('Kit deve ter pelo menos 30 peças no total')
    }

    // Verificar se os produtos existem
    const productIds = data.items.map(item => item.productId)
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      },
      select: { id: true, price: true }
    })

    if (existingProducts.length !== productIds.length) {
      throw new Error('Um ou mais produtos não foram encontrados ou estão inativos')
    }

    // Calcular preço total
    const totalPrice = data.items.reduce((sum, item) => {
      const product = existingProducts.find(p => p.id === item.productId)
      return sum + (Number(product?.price || 0) * item.quantity)
    }, 0)

    // Usar transação para garantir consistência
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar dados básicos do kit
      const updatedKit = await tx.kit.update({
        where: { id },
        data: {
          name: data.name.trim(),
          description: data.description.trim() || null,
          totalPrice,
          updatedAt: new Date()
        }
      })

      // Remover todos os itens existentes
      await tx.kitItem.deleteMany({
        where: { kitId: id }
      })

      // Criar novos itens
      await tx.kitItem.createMany({
        data: data.items.map(item => ({
          kitId: id,
          productId: item.productId,
          quantity: item.quantity
        }))
      })

      return updatedKit
    })

    // Revalidar cache
    revalidatePath('/admin/kits')
    revalidatePath(`/admin/kits/${id}/editar`)

    return {
      success: true,
      kit: result
    }

  } catch (error) {
    console.error('Erro ao atualizar kit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }
  }
}

export async function updateKitItems(kitId: number, items: Array<{ productId: number; quantity: number }>) {
  try {
    // Validações
    if (items.length === 0) {
      throw new Error('Kit deve ter pelo menos um item')
    }

    // Verificar duplicatas
    const productIds = items.map(item => item.productId)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      throw new Error('Kit não pode ter produtos duplicados')
    }

    // Verificar se os produtos existem
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true
      },
      select: { id: true, price: true }
    })

    if (existingProducts.length !== productIds.length) {
      throw new Error('Um ou mais produtos não foram encontrados')
    }

    // Usar transação
    const result = await prisma.$transaction(async (tx) => {
      // Remover itens existentes
      await tx.kitItem.deleteMany({
        where: { kitId }
      })

      // Criar novos itens
      await tx.kitItem.createMany({
        data: items.map(item => ({
          kitId,
          productId: item.productId,
          quantity: item.quantity
        }))
      })

      // Atualizar preço total do kit
      const totalPrice = items.reduce((sum, item) => {
        const product = existingProducts.find(p => p.id === item.productId)
        return sum + (Number(product?.price || 0) * item.quantity)
      }, 0)

      await tx.kit.update({
        where: { id: kitId },
        data: {
          totalPrice,
          updatedAt: new Date()
        }
      })

      return { kitId, totalPrice }
    })

    // Revalidar cache
    revalidatePath('/admin/kits')
    revalidatePath(`/admin/kits/${kitId}/editar`)

    return {
      success: true,
      result
    }

  } catch (error) {
    console.error('Erro ao atualizar itens do kit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }
  }
}

export async function toggleKitStatus(id: number) {
  try {
    const kit = await prisma.kit.findUnique({
      where: { id },
      select: { isActive: true }
    })

    if (!kit) {
      throw new Error('Kit não encontrado')
    }

    const updatedKit = await prisma.kit.update({
      where: { id },
      data: {
        isActive: !kit.isActive,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/kits')

    return {
      success: true,
      kit: updatedKit
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno do servidor'
    }
  }
}