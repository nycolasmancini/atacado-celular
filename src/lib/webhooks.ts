interface WebhookPayload {
  event: string;
  timestamp: string;
  [key: string]: any;
}

interface WebhookConfig {
  timeout?: number;
  retries?: number;
}

export class WebhookClient {
  private timeout: number;
  private retries: number;
  private isTestMode: boolean;

  constructor(config: WebhookConfig = {}) {
    this.timeout = config.timeout || 5000; // 5s timeout
    this.retries = config.retries || 0; // No retries by default
    this.isTestMode = process.env.WEBHOOK_MODE === 'test';
  }

  private getWebhookUrl(event: string): string {
    const mode = this.isTestMode ? 'TEST_' : '';
    const envKey = `N8N_WEBHOOK_URL_${mode}${event.toUpperCase()}`;
    return process.env[envKey] || '';
  }

  async send(event: string, data: any): Promise<void> {
    const url = this.getWebhookUrl(event);
    
    if (!url) {
      console.warn(`Webhook URL not configured for event: ${event}, skipping webhook`);
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    try {
      console.log(`📤 Sending webhook: ${event}`, { url, payload });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ Webhook sent successfully: ${event}`);
    } catch (error) {
      // Log error but don't throw - webhooks should not block the main flow
      console.error(`❌ Webhook failed for ${event}:`, error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`⏰ Webhook timeout after ${this.timeout}ms`);
        }
      }
    }
  }

  // Predefined webhook methods for better type safety
  async sendWhatsAppCaptured(data: {
    whatsapp: string;
    source: 'landing' | 'catalog';
    sessionId?: string;
  }): Promise<void> {
    return this.send('whatsapp_captured', data);
  }

  async sendOrderCompleted(data: {
    customer: {
      whatsapp: string;
      sessionId: string;
    };
    order: {
      items: any[];
      totalItems: number;
      totalValue: number;
    };
    behavior: {
      timeOnSite: number;
      pagesVisited: string[];
      productsViewed: number[];
      searches: string[];
      kitInterest?: string;
    };
  }): Promise<void> {
    return this.send('order_completed', data);
  }

  async sendCartAbandoned(data: {
    customer: {
      whatsapp?: string;
      sessionId: string;
    };
    cart: {
      items: any[];
      totalItems: number;
      totalValue: number;
      timeInCart: number; // tempo em ms
    };
    behavior: {
      timeOnSite: number;
      pagesVisited: string[];
      productsViewed: number[];
      searches: string[];
      kitInterest?: string;
    };
  }): Promise<void> {
    return this.send('cart_abandoned', data);
  }

  async sendHighValueInterest(data: {
    customer: {
      whatsapp?: string;
      sessionId: string;
    };
    product: {
      id: number;
      name: string;
      price: number;
      viewTime: number; // tempo visualizando em ms
    };
    behavior: {
      timeOnSite: number;
      pagesVisited: string[];
      productsViewed: number[];
      score: number;
    };
  }): Promise<void> {
    return this.send('high_value_interest', data);
  }

  async sendSessionEnded(data: {
    customer: {
      whatsapp?: string;
      sessionId: string;
    };
    session: {
      duration: number; // duração total em ms
      score: number; // score de engajamento 0-10
      quality: 'high' | 'medium' | 'low';
    };
    behavior: {
      timeOnSite: number;
      pagesVisited: string[];
      productsViewed: number[];
      searches: string[];
      cartActions: number;
      kitInterest?: string;
    };
  }): Promise<void> {
    return this.send('session_ended', data);
  }

  async sendTrackingSummary(data: {
    sessionId: string;
    summary: any;
  }): Promise<void> {
    return this.send('tracking_summary', data);
  }
}

// Singleton instance
export const webhookClient = new WebhookClient();