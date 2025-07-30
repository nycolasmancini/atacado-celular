interface SendTextParams {
  number: string
  message: string
  delayMessage?: number
}

interface EvolutionResponse {
  success: boolean
  messageId?: string
  error?: string
}

export class EvolutionClient {
  private baseUrl: string
  private apiKey: string
  private instance: string

  constructor() {
    this.baseUrl = process.env.EVOLUTION_API_URL || ''
    this.apiKey = process.env.EVOLUTION_API_KEY || ''
    this.instance = process.env.EVOLUTION_INSTANCE || 'atacado'

    if (!this.baseUrl || !this.apiKey) {
      console.warn('Evolution API credentials not configured')
    }
  }

  private async makeRequest(endpoint: string, body: any): Promise<EvolutionResponse> {
    const url = `${this.baseUrl}/${endpoint}`
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Evolution API error ${response.status}:`, errorText)
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`
        }
      }

      const data = await response.json()
      return {
        success: true,
        messageId: data.messageId || data.id,
        ...data
      }
    } catch (error) {
      console.error('Evolution API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async sendText(params: SendTextParams): Promise<EvolutionResponse> {
    if (!this.baseUrl || !this.apiKey) {
      return {
        success: false,
        error: 'Evolution API not configured'
      }
    }

    const body = {
      number: params.number,
      text: params.message,
      delayMessage: params.delayMessage || 2
    }

    let lastError = ''
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`Evolution API attempt ${attempt}/3 for number ${params.number}`)
      
      const result = await this.makeRequest(`message/sendText/${this.instance}`, body)
      
      if (result.success) {
        console.log(`Evolution API success on attempt ${attempt}:`, result.messageId)
        return result
      }
      
      lastError = result.error || 'Unknown error'
      console.warn(`Evolution API attempt ${attempt} failed:`, lastError)
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    return {
      success: false,
      error: `All 3 attempts failed. Last error: ${lastError}`
    }
  }

  async testConnection(): Promise<EvolutionResponse> {
    if (!this.baseUrl || !this.apiKey) {
      return {
        success: false,
        error: 'Evolution API not configured'
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/instance/connectionState/${this.instance}`, {
        method: 'GET',
        headers: {
          'apikey': this.apiKey,
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          success: false,
          error: `Connection test failed: ${response.status} - ${errorText}`
        }
      }

      const data = await response.json()
      return {
        success: data.instance?.state === 'open',
        error: data.instance?.state !== 'open' ? `Instance state: ${data.instance?.state}` : undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed'
      }
    }
  }
}

export const evolutionClient = new EvolutionClient()