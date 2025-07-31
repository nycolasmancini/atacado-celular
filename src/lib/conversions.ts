'use client'

import { trackEvent, trackConversion, trackEcommerce, GTMEvents } from './gtm'
import { trackHeatmapEvent } from './heatmaps'
import { getCurrentUTMParameters } from './utm'

// Conversion Types
export enum ConversionType {
  KIT_PURCHASE = 'kit_purchase',
  CATALOG_DOWNLOAD = 'catalog_download',
  WHATSAPP_LEAD = 'whatsapp_lead',
  PRICE_UNLOCK = 'price_unlock',
  EMAIL_SIGNUP = 'email_signup'
}

// Conversion Goal Configuration
interface ConversionGoal {
  id: string
  name: string
  type: ConversionType
  value: number
  currency: string
  category: string
}

// Predefined conversion goals
export const CONVERSION_GOALS: Record<string, ConversionGoal> = {
  KIT_PURCHASE_PRIMARY: {
    id: 'kit_purchase_primary',
    name: 'Kit Purchase (Primary Goal)',
    type: ConversionType.KIT_PURCHASE,
    value: 100,
    currency: 'BRL',
    category: 'ecommerce'
  },
  CATALOG_DOWNLOAD_SECONDARY: {
    id: 'catalog_download_secondary',
    name: 'Catalog Download (Secondary Goal)',
    type: ConversionType.CATALOG_DOWNLOAD,
    value: 25,
    currency: 'BRL',
    category: 'lead_generation'
  },
  WHATSAPP_LEAD: {
    id: 'whatsapp_lead',
    name: 'WhatsApp Lead Generation',
    type: ConversionType.WHATSAPP_LEAD,
    value: 50,
    currency: 'BRL',
    category: 'lead_generation'
  },
  PRICE_UNLOCK: {
    id: 'price_unlock',
    name: 'Price Access Unlocked',
    type: ConversionType.PRICE_UNLOCK,
    value: 30,
    currency: 'BRL',
    category: 'engagement'
  }
}

// Track conversion with full context
export const trackFullConversion = (
  goalId: string,
  additionalData: Record<string, any> = {}
) => {
  const goal = CONVERSION_GOALS[goalId]
  if (!goal) {
    console.error(`Conversion goal not found: ${goalId}`)
    return
  }

  const utm = getCurrentUTMParameters()
  const conversionData = {
    conversion_id: goalId,
    conversion_name: goal.name,
    conversion_type: goal.type,
    conversion_value: goal.value,
    currency: goal.currency,
    utm_parameters: utm,
    timestamp: new Date().toISOString(),
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    ...additionalData
  }

  try {
    // 1. Track with GTM (includes GA4)
    trackEvent({
      event: GTMEvents.PURCHASE,
      event_category: goal.category,
      event_action: 'conversion',
      event_label: goal.name,
      value: goal.value,
      custom_parameters: conversionData
    })

    // 2. Track specific conversion type
    trackConversion(goal.type === ConversionType.KIT_PURCHASE ? 'kit_purchase' : 'catalog_download', {
      kit_id: additionalData.kit_id,
      kit_name: additionalData.kit_name,
      value: goal.value,
      currency: goal.currency
    })

    // 3. Track with heatmaps
    trackHeatmapEvent('conversion', conversionData)

    // 4. E-commerce tracking for GA4
    if (goal.type === ConversionType.KIT_PURCHASE) {
      trackEcommerce('purchase', [
        {
          item_id: additionalData.kit_id || 'unknown',
          item_name: additionalData.kit_name || 'Kit Purchase',
          category: 'kits',
          quantity: additionalData.quantity || 1,
          price: goal.value
        }
      ], additionalData.transaction_id, goal.value)
    }

    console.log(`Conversion tracked successfully: ${goal.name}`, conversionData)
  } catch (error) {
    console.error('Error tracking conversion:', error)
  }
}

// Kit purchase conversion (Primary Goal)
export const trackKitPurchaseConversion = (kitData: {
  kit_id: string
  kit_name: string
  quantity: number
  total_value: number
  transaction_id?: string
}) => {
  trackFullConversion('KIT_PURCHASE_PRIMARY', {
    ...kitData,
    conversion_value: kitData.total_value
  })

  // Additional e-commerce events
  trackEcommerce('begin_checkout', [
    {
      item_id: kitData.kit_id,
      item_name: kitData.kit_name,
      category: 'kits',
      quantity: kitData.quantity,
      price: kitData.total_value / kitData.quantity
    }
  ], kitData.transaction_id, kitData.total_value)
}

// Catalog download conversion (Secondary Goal)
export const trackCatalogDownloadConversion = (source: string = 'unknown') => {
  trackFullConversion('CATALOG_DOWNLOAD_SECONDARY', {
    download_source: source,
    download_timestamp: Date.now()
  })
}

// WhatsApp lead conversion
export const trackWhatsAppLeadConversion = (whatsapp: string, source: string = 'modal') => {
  trackFullConversion('WHATSAPP_LEAD', {
    lead_source: source,
    whatsapp_hash: btoa(whatsapp), // Hashed for privacy
    lead_quality: 'high' // WhatsApp leads are typically high quality
  })
}

// Price unlock conversion
export const trackPriceUnlockConversion = (whatsapp: string) => {
  trackFullConversion('PRICE_UNLOCK', {
    unlock_method: 'whatsapp',
    whatsapp_hash: btoa(whatsapp),
    unlock_duration: '7_days'
  })
}

// Funnel tracking
export const trackFunnelStep = (
  funnel: string,
  step: number,
  stepName: string,
  additionalData: Record<string, any> = {}
) => {
  trackEvent({
    event: 'funnel_step',
    event_category: 'funnel',
    event_action: 'step_completed',
    event_label: `${funnel}_step_${step}`,
    value: step,
    custom_parameters: {
      funnel_name: funnel,
      step_number: step,
      step_name: stepName,
      ...additionalData
    }
  })
}

// Purchase funnel steps
export const PURCHASE_FUNNEL_STEPS = {
  LANDING_VIEW: { step: 1, name: 'Landing Page View' },
  KIT_VIEW: { step: 2, name: 'Kit Section View' },
  WHATSAPP_MODAL_OPEN: { step: 3, name: 'WhatsApp Modal Opened' },
  WHATSAPP_SUBMIT: { step: 4, name: 'WhatsApp Submitted' },
  PRICES_UNLOCKED: { step: 5, name: 'Prices Unlocked' },
  CATALOG_VIEW: { step: 6, name: 'Catalog Viewed' },
  ITEM_ADD_TO_CART: { step: 7, name: 'Item Added to Cart' },
  CHECKOUT_START: { step: 8, name: 'Checkout Started' },
  PURCHASE_COMPLETE: { step: 9, name: 'Purchase Completed' }
}

// Track purchase funnel
export const trackPurchaseFunnelStep = (
  stepKey: keyof typeof PURCHASE_FUNNEL_STEPS,
  additionalData: Record<string, any> = {}
) => {
  const step = PURCHASE_FUNNEL_STEPS[stepKey]
  trackFunnelStep('purchase', step.step, step.name, additionalData)
}

// Bounce rate tracking by section
export const trackSectionBounce = (sectionName: string, timeSpent: number) => {
  const bounceThreshold = 5000 // 5 seconds
  const isBounce = timeSpent < bounceThreshold

  trackEvent({
    event: 'section_bounce',
    event_category: 'engagement',
    event_action: isBounce ? 'bounce' : 'engage',
    event_label: sectionName,
    value: Math.round(timeSpent / 1000),
    custom_parameters: {
      section_name: sectionName,
      time_spent_ms: timeSpent,
      is_bounce: isBounce,
      bounce_threshold_ms: bounceThreshold
    }
  })
}