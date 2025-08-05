'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export interface BrandData {
  name: string
  slug: string
  description?: string
  displayOrder: number
  isActive: boolean
}

export async function getBrands() {
  try {
    const brands = await prisma.brand.findMany({
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
      data: brands.map(brand => ({
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString()
      }))
    }
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return {
      success: false,
      error: 'Erro ao carregar marcas'
    }
  }
}

export async function getBrand(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!brand) {
      return {
        success: false,
        error: 'Marca não encontrada'
      }
    }

    return {
      success: true,
      data: {
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao buscar marca:', error)
    return {
      success: false,
      error: 'Erro ao carregar marca'
    }
  }
}

export async function createBrand(data: BrandData) {
  try {
    // Verificar se slug já existe
    const existingBrand = await prisma.brand.findUnique({
      where: { slug: data.slug }
    })

    if (existingBrand) {
      return {
        success: false,
        error: 'Já existe uma marca com este slug'
      }
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      }
    })

    console.log(`Marca criada: ${brand.name} (ordem: ${brand.displayOrder})`)

    revalidatePath('/admin/marcas')
    return {
      success: true,
      data: {
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao criar marca:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar marca'
    }
  }
}

export async function updateBrand(id: number, data: BrandData) {
  try {
    // Verificar se marca existe
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!existingBrand) {
      return {
        success: false,
        error: 'Marca não encontrada'
      }
    }

    // Verificar se slug já existe (exceto para a marca atual)
    const duplicateSlug = await prisma.brand.findFirst({
      where: {
        slug: data.slug,
        id: { not: id }
      }
    })

    if (duplicateSlug) {
      return {
        success: false,
        error: 'Já existe uma marca com este slug'
      }
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      }
    })

    console.log(`Marca atualizada: ${brand.name} (ordem: ${brand.displayOrder})`)

    revalidatePath('/admin/marcas')
    return {
      success: true,
      data: {
        ...brand,
        createdAt: brand.createdAt.toISOString(),
        updatedAt: brand.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao atualizar marca:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar marca'
    }
  }
}

export async function deleteBrand(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!brand) {
      return {
        success: false,
        error: 'Marca não encontrada'
      }
    }

    if (brand._count.products > 0) {
      return {
        success: false,
        error: 'Não é possível excluir esta marca pois ela tem produtos associados'
      }
    }

    await prisma.brand.delete({
      where: { id }
    })

    console.log(`Marca excluída: ${brand.name}`)

    revalidatePath('/admin/marcas')
    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao excluir marca:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir marca'
    }
  }
}

export async function updateBrandOrder(brandId: number, newOrder: number) {
  try {
    await prisma.brand.update({
      where: { id: brandId },
      data: { displayOrder: newOrder }
    })

    console.log(`Ordem da marca atualizada: ID ${brandId} -> ordem ${newOrder}`)

    revalidatePath('/admin/marcas')
    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao atualizar ordem da marca:', error)
    return {
      success: false,
      error: 'Erro ao atualizar ordem da marca'
    }
  }
}

export async function toggleBrandStatus(id: number) {
  try {
    const brand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!brand) {
      return {
        success: false,
        error: 'Marca não encontrada'
      }
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: { isActive: !brand.isActive }
    })

    console.log(`Status da marca alterado: ${brand.name} - ${updatedBrand.isActive ? 'Ativa' : 'Inativa'}`)

    revalidatePath('/admin/marcas')
    return {
      success: true,
      data: {
        ...updatedBrand,
        createdAt: updatedBrand.createdAt.toISOString(),
        updatedAt: updatedBrand.updatedAt.toISOString()
      }
    }
  } catch (error) {
    console.error('Erro ao alterar status da marca:', error)
    return {
      success: false,
      error: 'Erro ao alterar status da marca'
    }
  }
}