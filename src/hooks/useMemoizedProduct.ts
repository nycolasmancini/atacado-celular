'use client'

import { useMemo } from 'react'

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  imageUrl?: string;
  modelsImageUrl?: string;
  images?: string[];
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

/**
 * Hook to memoize product data and derived values
 * Prevents unnecessary recalculations when product data hasn't changed
 */
export function useMemoizedProduct(product: Product, quantity: number) {
  // Memoize product-derived values that are expensive to calculate
  const memoizedData = useMemo(() => {
    // Check if this is a model selection product
    const isModelProduct = ['peliculas', 'capinhas'].includes(
      product.category.slug.toLowerCase()
    ) && Boolean(product.modelsImageUrl);

    // Calculate price information
    const isSpecialPriceActive = quantity >= product.specialPriceMinQty;
    const currentPrice = isSpecialPriceActive ? product.specialPrice : product.price;
    const savings = isSpecialPriceActive ? 
      (product.price - product.specialPrice) * quantity : 0;

    // Get custom price labels based on category
    const getCustomPriceLabels = () => {
      switch (product.category.slug.toLowerCase()) {
        case 'capinhas':
        case 'peliculas':
          return {
            normalLabel: 'Atacado:',
            specialLabel: `${product.specialPriceMinQty} peças do mesmo modelo (pacote):`
          };
        default:
          return null;
      }
    };

    const customPriceLabels = getCustomPriceLabels();

    // Get model selection button text
    const getModelSelectionButtonText = () => {
      switch (product.category.slug.toLowerCase()) {
        case 'peliculas':
          return 'Ver modelos desta película';
        case 'capinhas':
          return 'Ver modelos desta capa';
        default:
          return 'Ver Modelos Disponíveis';
      }
    };

    return {
      isModelProduct,
      isSpecialPriceActive,
      currentPrice,
      savings,
      customPriceLabels,
      modelSelectionButtonText: getModelSelectionButtonText(),
      // Pre-calculate display strings to avoid re-computation
      formattedPrice: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(product.price),
      formattedSpecialPrice: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(product.specialPrice),
      formattedCurrentPrice: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(currentPrice),
    };
  }, [
    product.id,
    product.category.slug,
    product.price,
    product.specialPrice,
    product.specialPriceMinQty,
    product.modelsImageUrl,
    quantity
  ]);

  return memoizedData;
}

/**
 * Hook to memoize product list operations
 * Useful for filtering, sorting, and other expensive list operations
 */
export function useMemoizedProductList<T extends Product>(
  products: T[],
  dependencies: any[] = []
) {
  return useMemo(() => {
    // Pre-process products for common operations
    const processedProducts = products.map(product => ({
      ...product,
      // Pre-calculate commonly used values
      isModelProduct: ['peliculas', 'capinhas'].includes(
        product.category.slug.toLowerCase()
      ) && Boolean(product.modelsImageUrl),
      priceDisplay: {
        formatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.price),
        specialFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(product.specialPrice),
      },
      searchString: `${product.name} ${product.category.name} ${product.description || ''}`.toLowerCase(),
    }));

    // Group by category for faster filtering
    const byCategory = processedProducts.reduce((acc, product) => {
      const categorySlug = product.category.slug;
      if (!acc[categorySlug]) {
        acc[categorySlug] = [];
      }
      acc[categorySlug].push(product);
      return acc;
    }, {} as Record<string, typeof processedProducts>);

    // Create lookup maps for O(1) access
    const byId = processedProducts.reduce((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {} as Record<number, typeof processedProducts[0]>);

    return {
      products: processedProducts,
      byCategory,
      byId,
      count: processedProducts.length,
      // Pre-calculated category list
      categories: Object.keys(byCategory).map(slug => ({
        slug,
        name: byCategory[slug][0].category.name,
        count: byCategory[slug].length
      }))
    };
  }, [products, ...dependencies]);
}