'use client'

// Google Tag Manager Configuration
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// GTM Container ID - Replace with your actual GTM ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

// Initialize dataLayer
export const initDataLayer = () => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
  }
}

// Generic dataLayer push function
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data)
    console.log('DataLayer Push:', data) // Debug log
  }
}

// Enhanced event tracking interface
interface TrackEventParams {
  event: string
  event_category?: string
  event_action?: string
  event_label?: string
  value?: number
  custom_parameters?: Record<string, any>
  user_data?: {
    whatsapp?: string
    session_id?: string
    page_path?: string
  }
}

// Main event tracking function
export const trackEvent = ({
  event,
  event_category,
  event_action,
  event_label,
  value,
  custom_parameters = {},
  user_data = {}
}: TrackEventParams) => {
  const eventData = {
    event,
    event_category,
    event_action,
    event_label,
    value,
    timestamp: new Date().toISOString(),
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    page_title: typeof window !== 'undefined' ? document.title : '',
    ...custom_parameters,
    ...user_data
  }

  pushToDataLayer(eventData)
}

// Predefined event types for consistency
export const GTMEvents = {
  // CTA Events
  CTA_CLICK_HERO: 'cta_click_hero',
  CTA_CLICK_KIT: 'cta_click_kit',
  CTA_CLICK_WHATSAPP: 'cta_click_whatsapp',
  CTA_CLICK_CATALOG: 'cta_click_catalog',
  CTA_CLICK_STICKY: 'cta_click_sticky',
  
  // Scroll Depth Events
  SCROLL_DEPTH_25: 'scroll_depth_25',
  SCROLL_DEPTH_50: 'scroll_depth_50',
  SCROLL_DEPTH_75: 'scroll_depth_75',
  SCROLL_DEPTH_100: 'scroll_depth_100',
  
  // Conversion Events
  KIT_PURCHASE: 'kit_purchase',
  CATALOG_DOWNLOAD: 'catalog_download',
  WHATSAPP_SUBMIT: 'whatsapp_submit',
  PRICES_UNLOCKED: 'prices_unlocked',
  
  // Section Engagement
  SECTION_VIEW: 'section_view',
  SECTION_TIME: 'section_time_spent',
  
  // Form Events
  FORM_START: 'form_start',
  FORM_COMPLETE: 'form_complete',
  FORM_ERROR: 'form_error',
  
  // Navigation
  MENU_OPEN: 'menu_open',
  LINK_CLICK: 'link_click',
  
  // E-commerce Events (GA4 compatible)
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase'
} as const

// Specific tracking functions for common events
export const trackCTAClick = (location: string, cta_text?: string, kit_id?: string) => {
  trackEvent({
    event: location === 'hero' ? GTMEvents.CTA_CLICK_HERO : GTMEvents.CTA_CLICK_KIT,
    event_category: 'engagement',
    event_action: 'cta_click',
    event_label: location,
    custom_parameters: {
      cta_location: location,
      cta_text,
      kit_id
    }
  })
}

export const trackScrollDepth = (percentage: 25 | 50 | 75 | 100) => {
  const eventMap = {
    25: GTMEvents.SCROLL_DEPTH_25,
    50: GTMEvents.SCROLL_DEPTH_50,
    75: GTMEvents.SCROLL_DEPTH_75,
    100: GTMEvents.SCROLL_DEPTH_100
  }

  trackEvent({
    event: eventMap[percentage],
    event_category: 'engagement',
    event_action: 'scroll',
    event_label: `${percentage}%`,
    value: percentage
  })
}

export const trackSectionView = (section_name: string) => {
  trackEvent({
    event: GTMEvents.SECTION_VIEW,
    event_category: 'engagement',
    event_action: 'section_view',
    event_label: section_name,
    custom_parameters: {
      section_name,
      view_timestamp: Date.now()
    }
  })
}

export const trackSectionTime = (section_name: string, time_spent: number) => {
  trackEvent({
    event: GTMEvents.SECTION_TIME,
    event_category: 'engagement',
    event_action: 'time_spent',
    event_label: section_name,
    value: Math.round(time_spent),
    custom_parameters: {
      section_name,
      time_spent_seconds: Math.round(time_spent)
    }
  })
}

export const trackConversion = (
  type: 'kit_purchase' | 'catalog_download',
  details: {
    kit_id?: string
    kit_name?: string
    value?: number
    currency?: string
  } = {}
) => {
  const event = type === 'kit_purchase' ? GTMEvents.KIT_PURCHASE : GTMEvents.CATALOG_DOWNLOAD
  
  trackEvent({
    event,
    event_category: 'conversion',
    event_action: type,
    event_label: details.kit_name || details.kit_id || 'unknown',
    value: details.value || 0,
    custom_parameters: {
      currency: details.currency || 'BRL',
      ...details
    }
  })
}

export const trackWhatsAppSubmission = (whatsapp: string, source: string = 'modal') => {
  trackEvent({
    event: GTMEvents.WHATSAPP_SUBMIT,
    event_category: 'lead_generation',
    event_action: 'whatsapp_submit',
    event_label: source,
    custom_parameters: {
      submission_source: source,
      whatsapp_hash: btoa(whatsapp) // Basic hash for privacy
    }
  })
}

// E-commerce tracking for GA4
export const trackEcommerce = (
  action: 'view_item' | 'add_to_cart' | 'begin_checkout' | 'purchase',
  items: Array<{
    item_id: string
    item_name: string
    category?: string
    quantity?: number
    price?: number
  }>,
  transaction_id?: string,
  value?: number
) => {
  trackEvent({
    event: action,
    event_category: 'ecommerce',
    event_action: action,
    value: value || 0,
    custom_parameters: {
      currency: 'BRL',
      items,
      transaction_id
    }
  })
}

// Initialize GTM
export const initGTM = () => {
  if (typeof window === 'undefined' || !GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    console.warn('GTM not initialized: Invalid or missing GTM_ID')
    return
  }

  // Initialize dataLayer
  initDataLayer()

  // GTM initialization
  const script = document.createElement('script')
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `
  document.head.appendChild(script)

  // Track page load
  pushToDataLayer({
    event: 'page_view',
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  })
}