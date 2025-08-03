import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { webhookClient } from '@/lib/webhooks';

const testWebhookSchema = z.object({
  event: z.enum(['whatsapp_captured', 'order_completed', 'cart_abandoned', 'high_value_interest', 'session_ended'])
});

const mockData = {
  whatsapp_captured: {
    whatsapp: '(11) 99999-9999',
    source: 'landing' as const,
    sessionId: 'test-session-123'
  },
  order_completed: {
    customer: {
      whatsapp: '(11) 99999-9999',
      sessionId: 'test-session-123'
    },
    order: {
      items: [
        {
          productId: 1,
          name: 'Produto Teste',
          quantity: 30,
          price: 10,
          specialPrice: 8
        }
      ],
      totalItems: 30,
      totalValue: 240
    },
    behavior: {
      timeOnSite: 300000,
      pagesVisited: ['home', 'catalog'],
      productsViewed: [1, 2, 3],
      searches: ['iPhone', 'Samsung'],
      kitInterest: 'kit-premium'
    }
  },
  cart_abandoned: {
    customer: {
      whatsapp: '(11) 99999-9999',
      sessionId: 'test-session-123'
    },
    cart: {
      items: [
        {
          productId: 1,
          name: 'Produto Teste',
          quantity: 15,
          price: 20
        }
      ],
      totalItems: 15,
      totalValue: 300,
      timeInCart: 600000
    },
    behavior: {
      timeOnSite: 900000,
      pagesVisited: ['home', 'catalog', 'product/1'],
      productsViewed: [1, 2],
      searches: ['iPhone'],
      kitInterest: 'kit-basic'
    }
  },
  high_value_interest: {
    customer: {
      whatsapp: '(11) 99999-9999',
      sessionId: 'test-session-123'
    },
    product: {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 1200,
      viewTime: 180000
    },
    behavior: {
      timeOnSite: 600000,
      pagesVisited: ['home', 'catalog', 'product/1'],
      productsViewed: [1, 5, 8],
      score: 9.2
    }
  },
  session_ended: {
    customer: {
      whatsapp: '(11) 99999-9999',
      sessionId: 'test-session-123'
    },
    session: {
      duration: 1200000,
      score: 8.5,
      quality: 'high' as const
    },
    behavior: {
      timeOnSite: 1200000,
      pagesVisited: ['home', 'catalog', 'product/1', 'product/2', 'cart'],
      productsViewed: [1, 2, 3, 4, 5],
      searches: ['iPhone', 'Samsung', 'Xiaomi'],
      cartActions: 5,
      kitInterest: 'kit-premium'
    }
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event } = testWebhookSchema.parse(body);
    
    console.log(`🧪 Testing webhook: ${event}`);
    
    const testData = mockData[event];
    
    switch (event) {
      case 'whatsapp_captured':
        await webhookClient.sendWhatsAppCaptured(testData as any);
        break;
      case 'order_completed':
        await webhookClient.sendOrderCompleted(testData as any);
        break;
      case 'cart_abandoned':
        await webhookClient.sendCartAbandoned(testData as any);
        break;
      case 'high_value_interest':
        await webhookClient.sendHighValueInterest(testData as any);
        break;
      case 'session_ended':
        await webhookClient.sendSessionEnded(testData as any);
        break;
    }
    
    return NextResponse.json({
      success: true,
      message: `Webhook ${event} enviado com sucesso`,
      testData
    });
    
  } catch (error) {
    console.error('Error testing webhook:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Evento de webhook inválido'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao testar webhook'
    }, { status: 500 });
  }
}