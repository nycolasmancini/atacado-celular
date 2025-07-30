interface Product {
  id: number;
  name: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
}

interface ProductPricing {
  appliedPrice: number;
  totalPrice: number;
  savings: number;
  isSpecialPrice: boolean;
  unitsToSpecial: number;
  savingsPercentage: number;
}

export function useProductPricing(product: Product, quantity: number): ProductPricing {
  const isSpecialPrice = quantity >= product.specialPriceMinQty;
  const appliedPrice = isSpecialPrice ? product.specialPrice : product.price;
  const totalPrice = appliedPrice * quantity;
  
  const savings = isSpecialPrice 
    ? (product.price - product.specialPrice) * quantity 
    : 0;
    
  const unitsToSpecial = Math.max(0, product.specialPriceMinQty - quantity);
  
  const savingsPercentage = isSpecialPrice 
    ? Math.round(((product.price - product.specialPrice) / product.price) * 100)
    : 0;

  return {
    appliedPrice,
    totalPrice,
    savings,
    isSpecialPrice,
    unitsToSpecial,
    savingsPercentage,
  };
}