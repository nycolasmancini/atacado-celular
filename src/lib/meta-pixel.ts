export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID) {
    window.fbq('track', 'PageView')
  }
}

export const event = (name: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID) {
    window.fbq('track', name, parameters)
  }
}

export const customEvent = (name: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID) {
    window.fbq('trackCustom', name, parameters)
  }
}

// Eventos padrão do Meta
export const MetaEvents = {
  VIEW_CONTENT: 'ViewContent',
  ADD_TO_CART: 'AddToCart',
  INITIATE_CHECKOUT: 'InitiateCheckout',
  LEAD: 'Lead',
  PURCHASE: 'Purchase',
  SEARCH: 'Search',
  COMPLETE_REGISTRATION: 'CompleteRegistration'
}

// Eventos customizados para análise avançada
export const trackCustomEvent = (eventName: string, parameters?: any) => {
  customEvent(eventName, parameters)
}

// Tempo no site
export const trackTimeOnSite = (durationSeconds: number, pagesViewed: number) => {
  trackCustomEvent('TimeOnSite', {
    duration_seconds: durationSeconds,
    pages_viewed: pagesViewed,
    engagement_level: durationSeconds > 300 ? 'high' : durationSeconds > 60 ? 'medium' : 'low'
  })
}

// Abandono de carrinho
export const trackCartAbandoned = (cartValue: number, itemsCount: number, items: any[]) => {
  trackCustomEvent('CartAbandoned', {
    value: cartValue,
    items_count: itemsCount,
    currency: 'BRL',
    content_ids: items.map(item => item.id),
    content_names: items.map(item => item.name)
  })
}

// Kit visualizado
export const trackKitViewed = (kitName: string, kitValue: number, products: any[]) => {
  trackCustomEvent('KitViewed', {
    kit_name: kitName,
    kit_value: kitValue,
    currency: 'BRL',
    content_ids: products.map(p => p.id),
    num_items: products.length
  })
}

// Interesse em categoria
export const trackCategoryInterest = (categoryName: string, timeSpent: number, productsViewed: number) => {
  trackCustomEvent('CategoryInterest', {
    category_name: categoryName,
    time_spent_seconds: timeSpent,
    products_viewed: productsViewed,
    interest_level: timeSpent > 180 ? 'high' : timeSpent > 60 ? 'medium' : 'low'
  })
}

// Scroll depth
export const trackScrollDepth = (percentage: number, pagePath: string) => {
  if (percentage >= 25 && percentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
    trackCustomEvent('ScrollDepth', {
      scroll_percentage: percentage,
      page_path: pagePath,
      engagement_milestone: `${percentage}%`
    })
  }
}

// Comparação de produtos
export const trackProductComparison = (productIds: number[], comparisonType: string) => {
  trackCustomEvent('ProductComparison', {
    content_ids: productIds,
    comparison_type: comparisonType, // 'side_by_side', 'quick_view', etc
    num_products: productIds.length
  })
}

// Interesse em preço especial
export const trackSpecialPriceInterest = (productId: number, originalPrice: number, specialPrice: number) => {
  trackCustomEvent('SpecialPriceInterest', {
    content_id: productId,
    original_price: originalPrice,
    special_price: specialPrice,
    discount_percentage: ((originalPrice - specialPrice) / originalPrice) * 100,
    currency: 'BRL'
  })
}

// Feedback/Avaliação
export const trackUserFeedback = (rating: number, feedback: string, context: string) => {
  trackCustomEvent('UserFeedback', {
    rating: rating,
    feedback_text: feedback,
    context: context, // 'product', 'service', 'website', etc
    satisfaction_level: rating >= 4 ? 'high' : rating >= 3 ? 'medium' : 'low'
  })
}

// Download de catálogo
export const trackCatalogDownload = (catalogType: string, source: string) => {
  trackCustomEvent('CatalogDownload', {
    catalog_type: catalogType,
    download_source: source,
    content_name: `Catálogo ${catalogType}`
  })
}

// Configuração de notificações
export const trackNotificationPermission = (permission: string, context: string) => {
  trackCustomEvent('NotificationPermission', {
    permission_status: permission, // 'granted', 'denied', 'default'
    request_context: context,
    engagement_intent: permission === 'granted' ? 'high' : 'low'
  })
}