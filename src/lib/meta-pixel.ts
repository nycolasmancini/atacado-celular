export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export const pageview = () => {
  window.fbq('track', 'PageView')
}

export const event = (name: string, parameters?: any) => {
  window.fbq('track', name, parameters)
}

export const customEvent = (name: string, parameters?: any) => {
  window.fbq('trackCustom', name, parameters)
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