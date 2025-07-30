import { useMemo } from 'react'

interface Product {
  id: number
  name: string
  price: number
  specialPrice: number
  specialPriceMinQty: number
}

interface KitItem {
  productId: number
  quantity: number
}

interface KitCalculation {
  items: Array<{
    productId: number
    quantity: number
    unitPrice: number
    totalPrice: number
    isSpecialPrice: boolean
    savings: number
  }>
  totalPrice: number
  totalSavings: number
  totalQuantity: number
  isValid: boolean
  validationErrors: string[]
}

export function useKitCalculator(
  products: Product[],
  kitItems: KitItem[]
): KitCalculation {
  return useMemo(() => {
    const productMap = new Map(products.map(p => [p.id, p]))
    const validationErrors: string[] = []
    
    // Calcular cada item
    const calculatedItems = kitItems.map(item => {
      const product = productMap.get(item.productId)
      
      if (!product) {
        validationErrors.push(`Produto ${item.productId} não encontrado`)
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: 0,
          totalPrice: 0,
          isSpecialPrice: false,
          savings: 0
        }
      }

      // Determinar preço baseado na quantidade
      const isSpecialPrice = item.quantity >= product.specialPriceMinQty
      const unitPrice = isSpecialPrice ? product.specialPrice : product.price
      const totalPrice = unitPrice * item.quantity
      const savings = isSpecialPrice 
        ? (product.price - product.specialPrice) * item.quantity 
        : 0

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        isSpecialPrice,
        savings
      }
    })

    // Totais gerais
    const totalPrice = calculatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalSavings = calculatedItems.reduce((sum, item) => sum + item.savings, 0)
    const totalQuantity = calculatedItems.reduce((sum, item) => sum + item.quantity, 0)

    // Validações
    if (kitItems.length < 5) {
      validationErrors.push('Kit deve ter pelo menos 5 produtos')
    }

    if (totalQuantity < 30) {
      validationErrors.push('Kit deve ter pelo menos 30 peças no total')
    }

    // Verificar duplicatas
    const productIds = kitItems.map(item => item.productId)
    const uniqueProductIds = new Set(productIds)
    if (productIds.length !== uniqueProductIds.size) {
      validationErrors.push('Kit não pode ter produtos duplicados')
    }

    // Verificar quantidades mínimas
    kitItems.forEach(item => {
      if (item.quantity < 1) {
        validationErrors.push(`Quantidade deve ser pelo menos 1 para produto ${item.productId}`)
      }
    })

    return {
      items: calculatedItems,
      totalPrice,
      totalSavings,
      totalQuantity,
      isValid: validationErrors.length === 0,
      validationErrors
    }
  }, [products, kitItems])
}