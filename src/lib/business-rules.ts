import { trackEvent } from './tracking'

// Configurações das regras de negócio
export const BUSINESS_RULES = {
  // Pedido mínimo
  MINIMUM_ORDER_QUANTITY: 30,
  MINIMUM_ORDER_VALUE: 200.00,
  
  // Preços liberados
  PRICE_UNLOCK_DURATION_DAYS: 7,
  
  // Horário comercial
  BUSINESS_HOURS: {
    MONDAY: { start: 8, end: 18 },
    TUESDAY: { start: 8, end: 18 },
    WEDNESDAY: { start: 8, end: 18 },
    THURSDAY: { start: 8, end: 18 },
    FRIDAY: { start: 8, end: 18 },
    SATURDAY: { start: 9, end: 15 },
    SUNDAY: null // Fechado
  },
  
  // Feriados brasileiros 2024/2025
  HOLIDAYS: [
    '2024-12-25', // Natal
    '2025-01-01', // Ano Novo
    '2025-02-17', // Carnaval
    '2025-02-18', // Carnaval
    '2025-04-18', // Sexta-feira Santa
    '2025-04-21', // Tiradentes
    '2025-05-01', // Dia do Trabalhador
    '2025-09-07', // Independência
    '2025-10-12', // Nossa Senhora Aparecida
    '2025-11-02', // Finados
    '2025-11-15', // Proclamação da República
    '2025-12-25', // Natal
  ],
  
  // Limites e validações
  MAX_QUANTITY_PER_PRODUCT: 500,
  MAX_CART_ITEMS: 50,
  MAX_CART_VALUE: 50000.00,
  
  // Descontos
  QUANTITY_DISCOUNTS: [
    { min: 30, max: 49, discount: 0 },
    { min: 50, max: 99, discount: 0.05 }, // 5%
    { min: 100, max: 199, discount: 0.10 }, // 10%
    { min: 200, max: 499, discount: 0.15 }, // 15%
    { min: 500, max: Infinity, discount: 0.20 }, // 20%
  ],
  
  // Frete
  FREE_SHIPPING_THRESHOLD: 500.00,
  SHIPPING_REGIONS: {
    'SP': { rate: 0.05, days: 2 },
    'RJ': { rate: 0.06, days: 3 },
    'MG': { rate: 0.07, days: 3 },
    'PR': { rate: 0.08, days: 4 },
    'SC': { rate: 0.08, days: 4 },
    'RS': { rate: 0.09, days: 5 },
    'GO': { rate: 0.10, days: 5 },
    'DF': { rate: 0.08, days: 4 },
    'MT': { rate: 0.12, days: 6 },
    'MS': { rate: 0.12, days: 6 },
    'BA': { rate: 0.10, days: 5 },
    'SE': { rate: 0.11, days: 6 },
    'AL': { rate: 0.11, days: 6 },
    'PE': { rate: 0.10, days: 5 },
    'PB': { rate: 0.11, days: 6 },
    'RN': { rate: 0.11, days: 6 },
    'CE': { rate: 0.10, days: 5 },
    'PI': { rate: 0.12, days: 6 },
    'MA': { rate: 0.13, days: 7 },
    'PA': { rate: 0.15, days: 8 },
    'AM': { rate: 0.18, days: 10 },
    'RR': { rate: 0.20, days: 12 },
    'AP': { rate: 0.18, days: 10 },
    'AC': { rate: 0.20, days: 12 },
    'RO': { rate: 0.16, days: 9 },
    'TO': { rate: 0.13, days: 7 },
    'ES': { rate: 0.07, days: 3 },
  }
}

// Interface para validação de pedido
export interface OrderValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  totalQuantity: number
  totalValue: number
  minimumMet: boolean
  discountApplied: number
}

// Interface para item do carrinho
export interface CartItem {
  id: number
  name: string
  price: number
  specialPrice: number
  quantity: number
  specialPriceMinQty: number
}

// Validação de pedido mínimo
export function validateMinimumOrder(items: CartItem[]): OrderValidation {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Calcular totais
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  let totalValue = 0
  let discountApplied = 0

  // Calcular valor com preços especiais
  items.forEach(item => {
    const useSpecialPrice = item.quantity >= item.specialPriceMinQty
    const unitPrice = useSpecialPrice ? item.specialPrice : item.price
    const itemTotal = unitPrice * item.quantity
    totalValue += itemTotal
    
    if (useSpecialPrice) {
      const savings = (item.price - item.specialPrice) * item.quantity
      discountApplied += savings
    }
  })

  // Aplicar desconto por quantidade
  const quantityDiscount = getQuantityDiscount(totalQuantity)
  if (quantityDiscount.discount > 0) {
    const additionalDiscount = totalValue * quantityDiscount.discount
    discountApplied += additionalDiscount
    totalValue -= additionalDiscount
  }

  // Validações
  const minimumQuantityMet = totalQuantity >= BUSINESS_RULES.MINIMUM_ORDER_QUANTITY
  const minimumValueMet = totalValue >= BUSINESS_RULES.MINIMUM_ORDER_VALUE

  if (!minimumQuantityMet) {
    errors.push(`Pedido mínimo de ${BUSINESS_RULES.MINIMUM_ORDER_QUANTITY} peças. Faltam ${BUSINESS_RULES.MINIMUM_ORDER_QUANTITY - totalQuantity} peças.`)
  }

  if (!minimumValueMet) {
    const missing = BUSINESS_RULES.MINIMUM_ORDER_VALUE - totalValue
    errors.push(`Valor mínimo de R$ ${BUSINESS_RULES.MINIMUM_ORDER_VALUE.toFixed(2).replace('.', ',')}. Faltam R$ ${missing.toFixed(2).replace('.', ',')}.`)
  }

  // Avisos sobre preços especiais
  items.forEach(item => {
    if (item.quantity < item.specialPriceMinQty) {
      const needed = item.specialPriceMinQty - item.quantity
      const savings = (item.price - item.specialPrice) * item.specialPriceMinQty
      warnings.push(`${item.name}: Adicione ${needed} unidades para preço especial e economize R$ ${savings.toFixed(2).replace('.', ',')}`)
    }
  })

  // Avisos sobre desconto por quantidade
  if (quantityDiscount.discount === 0) {
    const nextTier = BUSINESS_RULES.QUANTITY_DISCOUNTS.find(tier => tier.min > totalQuantity)
    if (nextTier) {
      const needed = nextTier.min - totalQuantity
      warnings.push(`Adicione ${needed} peças para ${(nextTier.discount * 100).toFixed(0)}% de desconto adicional`)
    }
  }

  const result: OrderValidation = {
    isValid: errors.length === 0,
    errors,
    warnings,
    totalQuantity,
    totalValue,
    minimumMet: minimumQuantityMet && minimumValueMet,
    discountApplied
  }

  // Track validation
  trackEvent('order_validation', {
    ...result,
    items_count: items.length,
    timestamp: new Date().toISOString()
  })

  return result
}

// Obter desconto por quantidade
export function getQuantityDiscount(quantity: number) {
  return BUSINESS_RULES.QUANTITY_DISCOUNTS.find(
    tier => quantity >= tier.min && quantity <= tier.max
  ) || { min: 0, max: 0, discount: 0 }
}

// Verificar se está em horário comercial
export function isBusinessHours(date?: Date): boolean {
  const now = date || new Date()
  const day = now.getDay() // 0 = domingo
  const hour = now.getHours()
  
  // Verificar se é feriado
  if (isHoliday(now)) {
    return false
  }

  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  const dayName = dayNames[day] as keyof typeof BUSINESS_RULES.BUSINESS_HOURS
  const businessHour = BUSINESS_RULES.BUSINESS_HOURS[dayName]

  if (!businessHour) {
    return false // Domingo fechado
  }

  return hour >= businessHour.start && hour < businessHour.end
}

// Verificar se é feriado
export function isHoliday(date: Date): boolean {
  const dateString = date.toISOString().split('T')[0]
  return BUSINESS_RULES.HOLIDAYS.includes(dateString)
}

// Obter próximo horário comercial
export function getNextBusinessHour(date?: Date): Date {
  const now = date || new Date()
  let nextDate = new Date(now)
  
  // Buscar próximo dia útil
  while (!isBusinessHours(nextDate) || nextDate.getTime() <= now.getTime()) {
    nextDate.setDate(nextDate.getDate() + 1)
    nextDate.setHours(8, 0, 0, 0) // Começar às 8h
    
    // Verificar se é fim de semana ou feriado
    const day = nextDate.getDay()
    if (day === 0) { // Domingo
      continue
    }
    
    if (day === 6) { // Sábado
      nextDate.setHours(9, 0, 0, 0) // Sábado começa às 9h
    }
    
    if (!isHoliday(nextDate)) {
      break
    }
  }
  
  return nextDate
}

// Calcular frete
export function calculateShipping(state: string, totalValue: number): {
  value: number
  days: number
  isFree: boolean
} {
  // Frete grátis acima do threshold
  if (totalValue >= BUSINESS_RULES.FREE_SHIPPING_THRESHOLD) {
    return {
      value: 0,
      days: BUSINESS_RULES.SHIPPING_REGIONS[state as keyof typeof BUSINESS_RULES.SHIPPING_REGIONS]?.days || 7,
      isFree: true
    }
  }

  const region = BUSINESS_RULES.SHIPPING_REGIONS[state as keyof typeof BUSINESS_RULES.SHIPPING_REGIONS]
  
  if (!region) {
    // Estado não encontrado, usar padrão
    return {
      value: totalValue * 0.10,
      days: 7,
      isFree: false
    }
  }

  return {
    value: totalValue * region.rate,
    days: region.days,
    isFree: false
  }
}

// Validar quantidade de produto
export function validateProductQuantity(quantity: number, productId: number): {
  isValid: boolean
  error?: string
  warning?: string
} {
  if (quantity <= 0) {
    return {
      isValid: false,
      error: 'Quantidade deve ser maior que zero'
    }
  }

  if (quantity > BUSINESS_RULES.MAX_QUANTITY_PER_PRODUCT) {
    return {
      isValid: false,
      error: `Quantidade máxima por produto: ${BUSINESS_RULES.MAX_QUANTITY_PER_PRODUCT} unidades`
    }
  }

  // Avisar sobre quantidades não otimizadas
  if (quantity < 10) {
    return {
      isValid: true,
      warning: 'Considere pedidos maiores para melhores preços'
    }
  }

  return { isValid: true }
}

// Validar carrinho completo
export function validateCart(items: CartItem[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Verificar limite de itens
  if (items.length > BUSINESS_RULES.MAX_CART_ITEMS) {
    errors.push(`Máximo de ${BUSINESS_RULES.MAX_CART_ITEMS} tipos de produtos por pedido`)
  }

  // Verificar valor máximo
  const totalValue = items.reduce((sum, item) => {
    const useSpecialPrice = item.quantity >= item.specialPriceMinQty
    const unitPrice = useSpecialPrice ? item.specialPrice : item.price
    return sum + (unitPrice * item.quantity)
  }, 0)

  if (totalValue > BUSINESS_RULES.MAX_CART_VALUE) {
    errors.push(`Valor máximo por pedido: R$ ${BUSINESS_RULES.MAX_CART_VALUE.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
  }

  // Validar cada item
  items.forEach(item => {
    const validation = validateProductQuantity(item.quantity, item.id)
    if (!validation.isValid && validation.error) {
      errors.push(`${item.name}: ${validation.error}`)
    }
    if (validation.warning) {
      warnings.push(`${item.name}: ${validation.warning}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// Formatador de moeda brasileira
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Formatador de porcentagem
export function formatPercentage(value: number): string {
  return (value * 100).toFixed(0) + '%'
}

// Hook para regras de negócio
export function useBusinessRules() {
  const validateOrder = (items: CartItem[]) => {
    const orderValidation = validateMinimumOrder(items)
    const cartValidation = validateCart(items)

    return {
      ...orderValidation,
      errors: [...orderValidation.errors, ...cartValidation.errors],
      warnings: [...orderValidation.warnings, ...cartValidation.warnings],
      isValid: orderValidation.isValid && cartValidation.isValid
    }
  }

  const getBusinessStatus = () => {
    const now = new Date()
    const isOpen = isBusinessHours(now)
    const nextOpen = isOpen ? null : getNextBusinessHour(now)

    return {
      isOpen,
      nextOpen,
      message: isOpen 
        ? 'Atendimento online agora!'
        : `Próximo atendimento: ${nextOpen?.toLocaleDateString('pt-BR')} às ${nextOpen?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  const calculateOrderSummary = (items: CartItem[], state: string = 'SP') => {
    const validation = validateOrder(items)
    const shipping = calculateShipping(state, validation.totalValue)
    const finalValue = validation.totalValue + shipping.value

    return {
      ...validation,
      shipping,
      finalValue,
      formattedValues: {
        subtotal: formatCurrency(validation.totalValue),
        discount: formatCurrency(validation.discountApplied),
        shipping: formatCurrency(shipping.value),
        total: formatCurrency(finalValue)
      }
    }
  }

  return {
    RULES: BUSINESS_RULES,
    validateOrder,
    getBusinessStatus,
    calculateOrderSummary,
    isBusinessHours,
    isHoliday,
    getNextBusinessHour,
    calculateShipping,
    validateProductQuantity,
    validateCart,
    formatCurrency,
    formatPercentage
  }
}