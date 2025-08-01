/**
 * Meta Conversions API - Server-Side Tracking
 * 
 * Este módulo implementa o rastreamento server-side usando a Meta Conversions API
 * para complementar o Pixel client-side e aumentar a precisão dos dados.
 * 
 * Documentação: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

const CONVERSIONS_API_URL = 'https://graph.facebook.com/v18.0'
const ACCESS_TOKEN = process.env.META_CONVERSIONS_API_ACCESS_TOKEN
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

export interface ConversionEvent {
  event_name: string
  event_time: number
  event_id?: string
  user_data: UserData
  custom_data?: CustomData
  event_source_url?: string
  action_source: 'website' | 'email' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'other'
}

export interface UserData {
  emails?: string[]
  phones?: string[]
  first_names?: string[]
  last_names?: string[]
  dates_of_birth?: string[]
  genders?: ('m' | 'f')[]
  cities?: string[]
  states?: string[]
  zip_codes?: string[]
  countries?: string[]
  external_ids?: string[]
  client_ip_address?: string
  client_user_agent?: string
  fbc?: string // Facebook click ID
  fbp?: string // Facebook browser ID
}

export interface CustomData {
  value?: number
  currency?: string
  content_ids?: string[]
  content_type?: string
  content_name?: string
  content_category?: string
  contents?: Array<{
    id: string
    quantity: number
    item_price: number
  }>
  num_items?: number
  order_id?: string
  status?: string
  search_string?: string
  delivery_category?: 'in_store' | 'curbside' | 'home_delivery'
}

/**
 * Classe principal para envio de eventos via Conversions API
 */
export class MetaConversionsAPI {
  private pixelId: string
  private accessToken: string

  constructor(pixelId?: string, accessToken?: string) {
    this.pixelId = pixelId || PIXEL_ID || ''
    this.accessToken = accessToken || ACCESS_TOKEN || ''

    if (!this.pixelId || !this.accessToken) {
      console.warn('Meta Conversions API: Pixel ID ou Access Token não configurados')
    }
  }

  /**
   * Envia um evento para a Conversions API
   */
  async sendEvent(event: ConversionEvent): Promise<boolean> {
    if (!this.pixelId || !this.accessToken) {
      console.warn('Meta Conversions API não configurada. Evento ignorado:', event.event_name)
      return false
    }

    try {
      const payload = {
        data: [this.hashUserData(event)]
      }

      const response = await fetch(`${CONVERSIONS_API_URL}/${this.pixelId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Erro na Conversions API:', result)
        return false
      }

      console.log('Evento enviado com sucesso via Conversions API:', event.event_name)
      return true
    } catch (error) {
      console.error('Erro ao enviar evento via Conversions API:', error)
      return false
    }
  }

  /**
   * Envia múltiplos eventos em batch
   */
  async sendEvents(events: ConversionEvent[]): Promise<boolean> {
    if (!this.pixelId || !this.accessToken) {
      console.warn('Meta Conversions API não configurada. Eventos ignorados')
      return false
    }

    try {
      const payload = {
        data: events.map(event => this.hashUserData(event))
      }

      const response = await fetch(`${CONVERSIONS_API_URL}/${this.pixelId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Erro na Conversions API (batch):', result)
        return false
      }

      console.log(`${events.length} eventos enviados com sucesso via Conversions API`)
      return true
    } catch (error) {
      console.error('Erro ao enviar eventos em batch via Conversions API:', error)
      return false
    }
  }

  /**
   * Hash dos dados do usuário para privacidade
   */
  private hashUserData(event: ConversionEvent): ConversionEvent {
    const hashedEvent = { ...event }

    if (hashedEvent.user_data.emails) {
      hashedEvent.user_data.emails = hashedEvent.user_data.emails.map(email => 
        this.hashString(email.toLowerCase().trim())
      )
    }

    if (hashedEvent.user_data.phones) {
      hashedEvent.user_data.phones = hashedEvent.user_data.phones.map(phone => 
        this.hashString(phone.replace(/\D/g, ''))
      )
    }

    if (hashedEvent.user_data.first_names) {
      hashedEvent.user_data.first_names = hashedEvent.user_data.first_names.map(name => 
        this.hashString(name.toLowerCase().trim())
      )
    }

    if (hashedEvent.user_data.last_names) {
      hashedEvent.user_data.last_names = hashedEvent.user_data.last_names.map(name => 
        this.hashString(name.toLowerCase().trim())
      )
    }

    return hashedEvent
  }

  /**
   * Hash SHA-256 para dados sensíveis
   */
  private async hashString(str: string): Promise<string> {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(str)
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } else {
      // Fallback para ambiente servidor (Node.js)
      const crypto = await import('crypto')
      return crypto.createHash('sha256').update(str).digest('hex')
    }
  }
}

// Instância singleton
const conversionsAPI = new MetaConversionsAPI()

/**
 * Funções de conveniência para eventos comuns
 */

export const trackServerSidePageView = async (
  userData: UserData,
  eventSourceUrl: string,
  eventId?: string
) => {
  const event: ConversionEvent = {
    event_name: 'PageView',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    user_data: userData,
    event_source_url: eventSourceUrl,
    action_source: 'website'
  }

  return await conversionsAPI.sendEvent(event)
}

export const trackServerSideLead = async (
  userData: UserData,
  eventSourceUrl: string,
  customData?: CustomData,
  eventId?: string
) => {
  const event: ConversionEvent = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    user_data: userData,
    custom_data: customData,
    event_source_url: eventSourceUrl,
    action_source: 'website'
  }

  return await conversionsAPI.sendEvent(event)
}

export const trackServerSidePurchase = async (
  userData: UserData,
  purchaseData: {
    value: number
    currency: string
    orderId: string
    contents: Array<{
      id: string
      quantity: number
      item_price: number
    }>
  },
  eventSourceUrl: string,
  eventId?: string
) => {
  const event: ConversionEvent = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    user_data: userData,
    custom_data: {
      value: purchaseData.value,
      currency: purchaseData.currency,
      order_id: purchaseData.orderId,
      contents: purchaseData.contents,
      num_items: purchaseData.contents.reduce((sum, item) => sum + item.quantity, 0)
    },
    event_source_url: eventSourceUrl,
    action_source: 'website'
  }

  return await conversionsAPI.sendEvent(event)
}

export const trackServerSideViewContent = async (
  userData: UserData,
  contentData: {
    contentIds: string[]
    contentType: string
    contentName?: string
    value?: number
  },
  eventSourceUrl: string,
  eventId?: string
) => {
  const event: ConversionEvent = {
    event_name: 'ViewContent',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    user_data: userData,
    custom_data: {
      content_ids: contentData.contentIds,
      content_type: contentData.contentType,
      content_name: contentData.contentName,
      value: contentData.value,
      currency: 'BRL'
    },
    event_source_url: eventSourceUrl,
    action_source: 'website'
  }

  return await conversionsAPI.sendEvent(event)
}

/**
 * Utilitários para extrair dados do usuário de requests
 */
export const extractUserDataFromRequest = (req: any): UserData => {
  return {
    client_ip_address: req.ip || req.connection?.remoteAddress,
    client_user_agent: req.headers['user-agent'],
    fbc: req.cookies?.['_fbc'], // Facebook click ID
    fbp: req.cookies?.['_fbp']  // Facebook browser ID
  }
}

/**
 * Gera um Event ID único para deduplicação
 */
export const generateEventId = (sessionId: string, eventType: string): string => {
  return `${sessionId}_${eventType}_${Date.now()}`
}

/**
 * Testa a conexão com a Conversions API
 */
export const testConversionsAPI = async (): Promise<boolean> => {
  const testEvent: ConversionEvent = {
    event_name: 'PageView',
    event_time: Math.floor(Date.now() / 1000),
    event_id: `test_${Date.now()}`,
    user_data: {
      client_ip_address: '127.0.0.1',
      client_user_agent: 'TestAgent/1.0'
    },
    action_source: 'website',
    event_source_url: 'https://example.com/test'
  }

  return await conversionsAPI.sendEvent(testEvent)
}

export { conversionsAPI as default }