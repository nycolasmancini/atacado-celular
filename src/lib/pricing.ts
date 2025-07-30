export const calculateDiscount = (price: number, specialPrice: number): string => {
  return ((price - specialPrice) / price * 100).toFixed(0)
}

export const formatPricing = (product: {
  price: number
  specialPrice: number
  specialPriceMinQty: number
}) => {
  return {
    normal: `R$ ${product.price.toFixed(2).replace('.', ',')}`,
    special: `R$ ${product.specialPrice.toFixed(2).replace('.', ',')} (${product.specialPriceMinQty}+ un)`,
    discount: `${calculateDiscount(product.price, product.specialPrice)}% OFF`
  }
}

export const calculateSavings = (
  price: number,
  specialPrice: number,
  quantity: number
): number => {
  return (price - specialPrice) * quantity
}

export const validatePricing = (
  price: number,
  specialPrice: number,
  specialPriceMinQty: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (specialPrice >= price) {
    errors.push('Preço especial deve ser menor que o preço normal')
  }

  if (specialPriceMinQty < 10) {
    errors.push('Quantidade mínima deve ser pelo menos 10 unidades')
  }

  if (price <= 0) {
    errors.push('Preço normal deve ser maior que zero')
  }

  if (specialPrice <= 0) {
    errors.push('Preço especial deve ser maior que zero')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}