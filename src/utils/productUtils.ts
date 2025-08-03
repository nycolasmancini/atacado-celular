interface Product {
  category: {
    id: number;
    name: string;
    slug: string;
  };
  modelsImageUrl?: string;
}

/**
 * Checks if a product is of película/capa type (products that require model selection)
 * @param product - The product to check
 * @returns true if the product is película/capa type
 */
export function isModelSelectionProduct(product: Product): boolean {
  if (!product?.category?.slug) return false;
  
  // Check if product category is película or capa
  const modelCategories = ['peliculas', 'capinhas'];
  const isModelCategory = modelCategories.includes(product.category.slug.toLowerCase());
  
  // Also check if product has a models image URL
  const hasModelsImage = Boolean(product.modelsImageUrl);
  
  return isModelCategory && hasModelsImage;
}

/**
 * Gets the appropriate button text for model selection products
 * @param categorySlug - The category slug
 * @returns Button text
 */
export function getModelSelectionButtonText(categorySlug: string): string {
  switch (categorySlug.toLowerCase()) {
    case 'peliculas':
      return 'Ver modelos desta película';
    case 'capinhas':
      return 'Ver modelos desta capa';
    default:
      return 'Ver Modelos Disponíveis';
  }
}

/**
 * Gets custom price labels based on product category
 * @param categorySlug - The category slug
 * @param specialQty - The special quantity threshold
 * @returns Custom price labels or null for default labels
 */
export function getCustomPriceLabels(categorySlug: string, specialQty: number): { normalLabel: string; specialLabel: string } | null {
  switch (categorySlug.toLowerCase()) {
    case 'capinhas':
      return {
        normalLabel: 'Atacado:',
        specialLabel: `${specialQty} peças do mesmo modelo (pacote):`
      };
    default:
      return null;
  }
}