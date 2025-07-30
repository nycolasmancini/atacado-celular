'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { validatePricing } from '@/lib/pricing'

export interface ProductData {
  name: string
  slug: string
  description: string
  price: number
  specialPrice: number
  specialPriceMinQty: number
  categoryId: number
  imageUrl: string
  isActive: boolean
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {
      success: true,
      data: products
    }
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return {
      success: false,
      error: 'Erro ao carregar produtos'
    }
  }
}

export async function getProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado'
      }
    }

    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return {
      success: false,
      error: 'Erro ao carregar produto'
    }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return {
      success: false,
      error: 'Erro ao carregar categorias'
    }
  }
}

export async function createProduct(data: ProductData) {
  try {
    // Validações
    const validation = validatePricing(data.price, data.specialPrice, data.specialPriceMinQty)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      }
    }

    // Verificar se slug já existe
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug }
    })

    if (existingProduct) {
      return {
        success: false,
        error: 'Já existe um produto com este slug'
      }
    }

    // Verificar se categoria existe
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        specialPrice: data.specialPrice,
        specialPriceMinQty: data.specialPriceMinQty,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive
      }
    })

    console.log(`Produto criado: ${product.name} - Preços: R$ ${product.price} / R$ ${product.specialPrice} (${product.specialPriceMinQty}+ un)`)

    revalidatePath('/admin/produtos')
    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar produto'
    }
  }
}

export async function updateProduct(id: number, data: ProductData) {
  try {
    // Validações
    const validation = validatePricing(data.price, data.specialPrice, data.specialPriceMinQty)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      }
    }

    // Verificar se produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return {
        success: false,
        error: 'Produto não encontrado'
      }
    }

    // Verificar se slug já existe (exceto para o produto atual)
    const duplicateSlug = await prisma.product.findFirst({
      where: {
        slug: data.slug,
        id: { not: id }
      }
    })

    if (duplicateSlug) {
      return {
        success: false,
        error: 'Já existe um produto com este slug'
      }
    }

    // Verificar se categoria existe
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return {
        success: false,
        error: 'Categoria não encontrada'
      }
    }

    // Log das alterações de preço
    if (Number(existingProduct.price) !== data.price || Number(existingProduct.specialPrice) !== data.specialPrice) {
      console.log(`Alteração de preços - ${existingProduct.name}:`)
      console.log(`  Preço normal: R$ ${existingProduct.price} → R$ ${data.price}`)
      console.log(`  Preço especial: R$ ${existingProduct.specialPrice} → R$ ${data.specialPrice}`)
      console.log(`  Qtd mínima: ${existingProduct.specialPriceMinQty} → ${data.specialPriceMinQty}`)
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        specialPrice: data.specialPrice,
        specialPriceMinQty: data.specialPriceMinQty,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive
      }
    })

    revalidatePath('/admin/produtos')
    return {
      success: true,
      data: product
    }
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar produto'
    }
  }
}

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado'
      }
    }

    // Verificar se produto está sendo usado em kits
    const kitItems = await prisma.kitItem.findMany({
      where: { productId: id }
    })

    if (kitItems.length > 0) {
      return {
        success: false,
        error: 'Não é possível excluir este produto pois ele está sendo usado em kits'
      }
    }

    await prisma.product.delete({
      where: { id }
    })

    console.log(`Produto excluído: ${product.name}`)

    revalidatePath('/admin/produtos')
    return {
      success: true
    }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir produto'
    }
  }
}

export async function toggleProductStatus(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado'
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive }
    })

    console.log(`Status do produto alterado: ${product.name} - ${updatedProduct.isActive ? 'Ativo' : 'Inativo'}`)

    revalidatePath('/admin/produtos')
    return {
      success: true,
      data: updatedProduct
    }
  } catch (error) {
    console.error('Erro ao alterar status do produto:', error)
    return {
      success: false,
      error: 'Erro ao alterar status do produto'
    }
  }
}