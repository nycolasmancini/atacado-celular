'use client'

// Heatmap Services Configuration
declare global {
  interface Window {
    // Hotjar
    hj: (event: string, ...args: any[]) => void
    _hjSettings?: { hjid: number; hjsv: number }
    
    // Microsoft Clarity
    clarity: (event: string, ...args: any[]) => void
    
    // LogRocket (optional)
    LogRocket?: {
      init: (appId: string) => void
      identify: (userId: string, traits?: Record<string, any>) => void
      track: (event: string, properties?: Record<string, any>) => void
    }
  }
}

// Configuration
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID
const LOGROCKET_APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID

// Hotjar Integration
export const initHotjar = () => {
  if (typeof window === 'undefined' || !HOTJAR_ID) return

  const hjid = parseInt(HOTJAR_ID)
  if (isNaN(hjid)) return

  // Initialize Hotjar
  ;(function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
    h.hj = h.hj || function(...args: any[]) { (h.hj.q = h.hj.q || []).push(args) }
    h._hjSettings = { hjid, hjsv: 6 }
    a = o.getElementsByTagName('head')[0]
    r = o.createElement('script')
    r.async = 1
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
    a.appendChild(r)
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
}

// Microsoft Clarity Integration
export const initClarity = () => {
  if (typeof window === 'undefined' || !CLARITY_ID) return

  ;(function(c: any, l: any, a: any, r: any, i: any, t: any, y: any) {
    c[a] = c[a] || function(...args: any[]) { (c[a].q = c[a].q || []).push(args) }
    t = l.createElement(r)
    t.async = 1
    t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]
    y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', CLARITY_ID)
}

// LogRocket Integration (Optional)
export const initLogRocket = () => {
  if (typeof window === 'undefined' || !LOGROCKET_APP_ID) return

  const script = document.createElement('script')
  script.src = 'https://cdn.lr-ingest.com/LogRocket.min.js'
  script.onload = () => {
    if (window.LogRocket) {
      window.LogRocket.init(LOGROCKET_APP_ID)
    }
  }
  document.head.appendChild(script)
}

// Unified heatmap event tracking
export const trackHeatmapEvent = (
  event: string,
  properties: Record<string, any> = {}
) => {
  const eventData = {
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    page_title: document.title,
    ...properties
  }

  // Hotjar Events
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('event', event)
    
    // Hotjar supports additional data
    if (Object.keys(properties).length > 0) {
      window.hj('identify', null, eventData)
    }
  }

  // Clarity Custom Events
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', event, JSON.stringify(eventData))
  }

  // LogRocket Events
  if (typeof window !== 'undefined' && window.LogRocket) {
    window.LogRocket.track(event, eventData)
  }
}

// Specific heatmap tracking functions
export const trackHeatmapCTAClick = (
  location: string,
  ctaText: string,
  element?: HTMLElement
) => {
  trackHeatmapEvent('cta_click', {
    cta_location: location,
    cta_text: ctaText,
    element_id: element?.id,
    element_class: element?.className,
    element_tag: element?.tagName?.toLowerCase()
  })
}

export const trackHeatmapFormInteraction = (
  formName: string,
  action: 'start' | 'complete' | 'error' | 'abandon',
  fieldName?: string
) => {
  trackHeatmapEvent('form_interaction', {
    form_name: formName,
    form_action: action,
    field_name: fieldName
  })
}

export const trackHeatmapScrollDepth = (
  percentage: number,
  section?: string
) => {
  trackHeatmapEvent('scroll_depth', {
    scroll_percentage: percentage,
    section_name: section
  })
}

export const trackHeatmapPageSection = (
  sectionName: string,
  action: 'view' | 'engage' | 'exit',
  timeSpent?: number
) => {
  trackHeatmapEvent('section_interaction', {
    section_name: sectionName,
    section_action: action,
    time_spent: timeSpent
  })
}

// User identification for heatmaps (when user provides WhatsApp)
export const identifyHeatmapUser = (whatsapp: string, additionalData: Record<string, any> = {}) => {
  const userId = btoa(whatsapp) // Basic hash for privacy
  const userData = {
    user_id: userId,
    whatsapp_provided: true,
    timestamp: new Date().toISOString(),
    ...additionalData
  }

  // Hotjar User Identification
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('identify', userId, userData)
  }

  // Clarity User Identification
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('identify', userId)
    window.clarity('set', 'user_data', JSON.stringify(userData))
  }

  // LogRocket User Identification
  if (typeof window !== 'undefined' && window.LogRocket) {
    window.LogRocket.identify(userId, userData)
  }
}

// Session recording controls
export const pauseHeatmapRecording = () => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('stateChange', 'recording_paused')
  }
}

export const resumeHeatmapRecording = () => {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('stateChange', 'recording_resumed')
  }
}

// Initialize all heatmap services
export const initHeatmaps = () => {
  if (typeof window === 'undefined') return

  try {
    initHotjar()
    initClarity()
    initLogRocket()
    
    console.log('Heatmap services initialized')
  } catch (error) {
    console.error('Error initializing heatmap services:', error)
  }
}

// Privacy compliance - disable tracking
export const disableHeatmapTracking = () => {
  if (typeof window === 'undefined') return

  // Disable Hotjar
  if (window.hj) {
    window.hj('consent', false)
  }

  // Disable Clarity (requires manual implementation)
  if (window.clarity) {
    // Clarity doesn't have a direct disable method
    // You might need to implement a wrapper
  }
}