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
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor(config: WebhookConfig = {}) {
    this.baseUrl = process.env.N8N_WEBHOOK_URL || '';
    this.timeout = config.timeout || 5000; // 5s timeout
    this.retries = config.retries || 0; // No retries by default
  }

  async send(event: string, data: any): Promise<void> {
    if (!this.baseUrl) {
      console.warn('N8N_WEBHOOK_URL not configured, skipping webhook');
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      ...data
    };

    const url = `${this.baseUrl}/${event.replace('_', '-')}`;
    
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

  async sendTrackingSummary(data: {
    sessionId: string;
    summary: any;
  }): Promise<void> {
    return this.send('tracking_summary', data);
  }
}

// Singleton instance
export const webhookClient = new WebhookClient();