'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export interface CategoryData {
  name: string
  slug: string
  description?: string
  displayOrder: number
  isActive: boolean
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    })

    return {
      success: true,
      data: categories.map(category => ({
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString()
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return {
      success: false,
      error: 'Erro ao carregar categorias'
    }
  }
}

export async function getCategory(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    return {
      success: true,
      data: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao buscar categoria:', error)
    return {
      success: false,
      error: 'Erro ao carregar categoria'
    }
  }
}

export async function createCategory(data: CategoryData) {
  try {
    // Verificar se slug já existe
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug }
    })

    if (existingCategory) {
      return {
        success: false,
        error: 'Já existe uma categoria com este slug'
      }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      }
    })

    console.log(`Categoria criada: ${category.name} (ordem: ${category.displayOrder})`)

    revalidatePath('/admin/categorias')
    return {
      success: true,
      data: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar categoria'
    }
  }
}

export async function updateCategory(id: number, data: CategoryData) {
  try {
    // Verificar se categoria existe
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    // Verificar se slug já existe (exceto para a categoria atual)
    const duplicateSlug = await prisma.category.findFirst({
      where: {
        slug: data.slug,
        id: { not: id }
      }
    })

    if (duplicateSlug) {
      return {
        success: false,
        error: 'Já existe uma categoria com este slug'
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      }
    })

    console.log(`Categoria atualizada: ${category.name} (ordem: ${category.displayOrder})`)

    revalidatePath('/admin/categorias')
    return {
      success: true,
      data: {
        ...category,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar categoria'
    }
  }
}

export async function deleteCategory(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    if (category._count.products > 0) {
      return {
        success: false,
        error: 'Não é possível excluir esta categoria pois ela tem produtos associados'
      }
    }

    await prisma.category.delete({
      where: { id }
    })

    console.log(`Categoria excluída: ${category.name}`)

    revalidatePath('/admin/categorias')
    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir categoria'
    }
  }
}

export async function updateCategoryOrder(categoryId: number, newOrder: number) {
  try {
    await prisma.category.update({
      where: { id: categoryId },
      data: { displayOrder: newOrder }
    })

    console.log(`Ordem da categoria atualizada: ID ${categoryId} -> ordem ${newOrder}`)

    revalidatePath('/admin/categorias')
    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao atualizar ordem da categoria:', error)
    return {
      success: false,
      error: 'Erro ao atualizar ordem da categoria'
    }
  }
}

export async function toggleCategoryStatus(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { id }
    })

    if (!category) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { isActive: !category.isActive }
    })

    console.log(`Status da categoria alterado: ${category.name} - ${updatedCategory.isActive ? 'Ativa' : 'Inativa'}`)

    revalidatePath('/admin/categorias')
    return {
      success: true,
      data: {
        ...updatedCategory,
        createdAt: updatedCategory.createdAt.toISOString(),
        updatedAt: updatedCategory.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao alterar status da categoria:', error)
    return {
      success: false,
      error: 'Erro ao alterar status da categoria'
    }
  }
}