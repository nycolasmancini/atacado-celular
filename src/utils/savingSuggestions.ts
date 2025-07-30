interface CartItem {
  productId: number;
  name: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  appliedPrice: number;
  quantity: number;
  isSpecialPrice: boolean;
}

interface SavingSuggestion {
  productId: number;
  productName: string;
  currentQty: number;
  qtyNeeded: number;
  potentialSaving: number;
  savingsPercentage: number;
  isCloseToSpecialPrice: boolean;
}

/**
 * Calcula sugestões inteligentes de economia baseado no carrinho atual
 */
export function getSavingSuggestions(cartItems: CartItem[]): SavingSuggestion[] {
  const suggestions = cartItems
    .filter(item => {
      // Só sugerir para itens que não têm preço especial ativo
      if (item.isSpecialPrice) return false;
      
      // Só sugerir se o usuário já tem pelo menos 70% da quantidade mínima
      const progressThreshold = item.specialPriceMinQty * 0.7;
      if (item.quantity < progressThreshold) return false;
      
      // Não sugerir se a quantidade necessária for muito alta (>100 unidades)
      const qtyNeeded = item.specialPriceMinQty - item.quantity;
      if (qtyNeeded > 100) return false;
      
      return true;
    })
    .map(item => {
      const qtyNeeded = item.specialPriceMinQty - item.quantity;
      const potentialSaving = (item.price - item.specialPrice) * item.specialPriceMinQty;
      const savingsPercentage = ((item.price - item.specialPrice) / item.price) * 100;
      const isCloseToSpecialPrice = qtyNeeded <= item.specialPriceMinQty * 0.3; // Próximo se falta ≤30%
      
      return {
        productId: item.productId,
        productName: item.name,
        currentQty: item.quantity,
        qtyNeeded,
        potentialSaving,
        savingsPercentage,
        isCloseToSpecialPrice
      };
    })
    .sort((a, b) => {
      // Primeiro: Priorizar itens muito próximos do preço especial
      if (a.isCloseToSpecialPrice && !b.isCloseToSpecialPrice) return -1;
      if (b.isCloseToSpecialPrice && !a.isCloseToSpecialPrice) return 1;
      
      // Segundo: Maior economia potencial
      if (a.potentialSaving !== b.potentialSaving) {
        return b.potentialSaving - a.potentialSaving;
      }
      
      // Terceiro: Menor quantidade necessária (mais fácil de alcançar)
      return a.qtyNeeded - b.qtyNeeded;
    });

  // Retornar no máximo 3 sugestões para não sobrecarregar o usuário
  return suggestions.slice(0, 3);
}

/**
 * Calcula o impacto total das sugestões se todas fossem aplicadas
 */
export function calculateTotalSavingsImpact(suggestions: SavingSuggestion[]): {
  totalPotentialSaving: number;
  totalItemsToAdd: number;
  averageSavingsPercentage: number;
} {
  const totalPotentialSaving = suggestions.reduce((sum, s) => sum + s.potentialSaving, 0);
  const totalItemsToAdd = suggestions.reduce((sum, s) => sum + s.qtyNeeded, 0);
  const averageSavingsPercentage = suggestions.length > 0 
    ? suggestions.reduce((sum, s) => sum + s.savingsPercentage, 0) / suggestions.length
    : 0;

  return {
    totalPotentialSaving,
    totalItemsToAdd,
    averageSavingsPercentage
  };
}

/**
 * Verifica se um produto específico tem oportunidade de economia
 */
export function hasEconomyOpportunity(item: CartItem): boolean {
  if (item.isSpecialPrice) return false;
  
  const qtyNeeded = item.specialPriceMinQty - item.quantity;
  const progressThreshold = item.specialPriceMinQty * 0.7;
  
  return item.quantity >= progressThreshold && qtyNeeded <= 100;
}

/**
 * Calcula métricas de engajamento para tracking
 */
export function getSavingsEngagementMetrics(
  cartItems: CartItem[],
  suggestions: SavingSuggestion[]
): {
  totalItemsInCart: number;
  itemsWithSpecialPrice: number;
  itemsWithOpportunity: number;
  topSavingOpportunity: number;
  engagementScore: number; // 0-100
} {
  const totalItemsInCart = cartItems.length;
  const itemsWithSpecialPrice = cartItems.filter(item => item.isSpecialPrice).length;
  const itemsWithOpportunity = suggestions.length;
  const topSavingOpportunity = suggestions.length > 0 ? suggestions[0].potentialSaving : 0;
  
  // Score baseado na utilização de preços especiais e oportunidades
  const specialPriceRatio = totalItemsInCart > 0 ? itemsWithSpecialPrice / totalItemsInCart : 0;
  const opportunityRatio = totalItemsInCart > 0 ? itemsWithOpportunity / totalItemsInCart : 0;
  const engagementScore = Math.round((specialPriceRatio * 60) + (opportunityRatio * 40));
  
  return {
    totalItemsInCart,
    itemsWithSpecialPrice,
    itemsWithOpportunity,
    topSavingOpportunity,
    engagementScore
  };
}