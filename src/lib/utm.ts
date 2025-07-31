'use client'

// UTM Parameter Management
export interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string // Google Ads Click ID
  fbclid?: string // Facebook Click ID
}

// Get UTM parameters from current URL
export const getUTMParameters = (): UTMParameters => {
  if (typeof window === 'undefined') return {}

  const urlParams = new URLSearchParams(window.location.search)
  const utm: UTMParameters = {}

  // Standard UTM parameters
  const utmKeys: (keyof UTMParameters)[] = [
    'utm_source',
    'utm_medium', 
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid'
  ]

  utmKeys.forEach(key => {
    const value = urlParams.get(key)
    if (value) {
      utm[key] = value
    }
  })

  return utm
}

// Store UTM parameters in sessionStorage
export const storeUTMParameters = () => {
  if (typeof window === 'undefined') return

  const utm = getUTMParameters()
  
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem('utm_parameters', JSON.stringify(utm))
    
    // Also store in localStorage for longer persistence
    const existing = getStoredUTMParameters('local')
    if (!existing || Object.keys(existing).length === 0) {
      localStorage.setItem('utm_parameters', JSON.stringify(utm))
    }
  }
}

// Get stored UTM parameters
export const getStoredUTMParameters = (storage: 'session' | 'local' = 'session'): UTMParameters => {
  if (typeof window === 'undefined') return {}

  try {
    const storageObj = storage === 'session' ? sessionStorage : localStorage
    const stored = storageObj.getItem('utm_parameters')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Get current or stored UTM parameters (prioritize current)
export const getCurrentUTMParameters = (): UTMParameters => {
  const current = getUTMParameters()
  const stored = getStoredUTMParameters()
  
  return { ...stored, ...current }
}

// Add UTM parameters to a URL
export const addUTMToURL = (url: string, utm?: UTMParameters): string => {
  const utmParams = utm || getCurrentUTMParameters()
  
  if (Object.keys(utmParams).length === 0) return url

  try {
    const urlObj = new URL(url, window.location.origin)
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value)
      }
    })
    
    return urlObj.toString()
  } catch {
    // Fallback for relative URLs
    const separator = url.includes('?') ? '&' : '?'
    const utmString = Object.entries(utmParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
      .join('&')
    
    return utmString ? `${url}${separator}${utmString}` : url
  }
}

// Create UTM-aware link component props
export const createUTMAwareLink = (href: string) => {
  return {
    href: addUTMToURL(href),
    onClick: () => {
      // Track link click with UTM context
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'link_click',
          link_url: href,
          utm_parameters: getCurrentUTMParameters()
        })
      }
    }
  }
}

// Hook for UTM-aware navigation
export const useUTMNavigation = () => {
  const navigateWithUTM = (url: string) => {
    const utmAwareURL = addUTMToURL(url)
    window.location.href = utmAwareURL
  }

  const openInNewTabWithUTM = (url: string) => {
    const utmAwareURL = addUTMToURL(url)
    window.open(utmAwareURL, '_blank', 'noopener,noreferrer')
  }

  return {
    navigateWithUTM,
    openInNewTabWithUTM,
    getCurrentUTM: getCurrentUTMParameters
  }
}

// WhatsApp link with UTM preservation
export const createWhatsAppLink = (
  phone: string,
  message: string,
  utm?: UTMParameters
): string => {
  const utmParams = utm || getCurrentUTMParameters()
  const utmString = Object.entries(utmParams)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' | ')

  const fullMessage = utmString 
    ? `${message}\n\nReferência: ${utmString}`
    : message

  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(fullMessage)}`
}

// Initialize UTM tracking on page load
export const initUTMTracking = () => {
  if (typeof window === 'undefined') return

  // Store UTM parameters immediately
  storeUTMParameters()

  // Send UTM data to GTM
  const utm = getCurrentUTMParameters()
  if (Object.keys(utm).length > 0 && window.dataLayer) {
    window.dataLayer.push({
      event: 'utm_parameters_detected',
      ...utm
    })
  }

  // Update all existing links to include UTM parameters
  const updateLinks = () => {
    const links = document.querySelectorAll('a[href]')
    links.forEach(link => {
      const href = link.getAttribute('href')
      if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
        link.setAttribute('href', addUTMToURL(href))
      }
    })
  }

  // Update links on page load and periodically
  updateLinks()
  setInterval(updateLinks, 5000) // Update every 5 seconds for dynamic content
}

// Clear UTM parameters (useful for testing)
export const clearUTMParameters = () => {
  if (typeof window === 'undefined') return
  
  sessionStorage.removeItem('utm_parameters')
  localStorage.removeItem('utm_parameters')
}