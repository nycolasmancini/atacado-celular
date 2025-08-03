import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { formatOrderMessage } from '@/lib/order';
import { evolutionClient } from '@/lib/evolution';
import { webhookClient } from '@/lib/webhooks';
import { getBehaviorDataForWebhook } from '@/lib/tracking-aggregator';
import { createOrder } from '@/lib/orders';
import { getChatwootContactInfo } from '@/lib/chatwoot';

const WHATSAPP_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

const orderSchema = z.object({
  whatsapp: z.string().regex(WHATSAPP_REGEX, "WhatsApp deve estar no formato (XX) XXXXX-XXXX"),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1),
    name: z.string(),
    price: z.number(),
    specialPrice: z.number().optional(),
    specialPriceMinQty: z.number().optional(),
  })).min(1, "Pelo menos um item é obrigatório"),
  sessionId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    
    const { whatsapp, items, sessionId } = validatedData;
    
    // Validar total mínimo de 30 peças
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems < 30) {
      return NextResponse.json({
        success: false,
        error: {
          code: "MIN_ORDER_NOT_REACHED",
          message: `Pedido mínimo de 30 peças. Você tem ${totalItems} peças.`
        }
      }, { status: 400 });
    }
    
    // Calcular total considerando preços especiais
    const total = items.reduce((sum, item) => {
      const isSpecialPrice = item.specialPrice && item.specialPriceMinQty && 
                           item.quantity >= item.specialPriceMinQty;
      const unitPrice = isSpecialPrice ? item.specialPrice! : item.price;
      return sum + (unitPrice * item.quantity);
    }, 0);
    
    // Buscar informações do cliente no Chatwoot
    const chatwootInfo = await getChatwootContactInfo(whatsapp);
    console.log('🔍 Informações do Chatwoot:', chatwootInfo);
    
    // Salvar pedido no banco de dados
    const orderData = await createOrder({
      sessionId,
      originalWhatsapp: whatsapp, // Por enquanto assumimos que é o mesmo
      currentWhatsapp: whatsapp,
      totalValue: total,
      totalItems,
      chatwootContactId: chatwootInfo.chatwootContactId,
      assignedSeller: chatwootInfo.assignedSeller,
      items: items.map(item => {
        const isSpecialPrice = item.specialPrice && item.specialPriceMinQty && 
                             item.quantity >= item.specialPriceMinQty;
        const unitPrice = isSpecialPrice ? item.specialPrice! : item.price;
        
        return {
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
          isSpecialPrice,
          specialPriceMinQty: item.specialPriceMinQty
        };
      })
    });

    console.log('📦 Pedido salvo no banco:', {
      orderNumber: orderData.orderNumber,
      totalValue: total,
      totalItems
    });
    
    // Formatar mensagem para WhatsApp
    const message = formatOrderMessage(items, total, orderData.orderNumber);
    
    // Enviar WhatsApp via Evolution API
    let messageId: string | undefined;
    try {
      console.log('📱 EVOLUTION API - Enviando mensagem WhatsApp:');
      console.log(`Para: ${whatsapp}`);
      console.log(`Mensagem:\n${message}`);
      
      // Converter formato brasileiro para internacional (55XX999999999)
      const internationalNumber = whatsapp
        .replace(/\D/g, '') // Remove tudo exceto dígitos
        .replace(/^(\d{2})(\d+)$/, '55$1$2'); // Adiciona código do país 55
      
      const evolutionResult = await evolutionClient.sendText({
        number: internationalNumber,
        message,
        delayMessage: 2
      });
      
      if (evolutionResult.success) {
        messageId = evolutionResult.messageId;
        console.log('✅ WhatsApp enviado com sucesso:', messageId);
      } else {
        console.error('❌ Falha ao enviar WhatsApp:', evolutionResult.error);
        // Continua o processo mesmo se WhatsApp falhar
      }
    } catch (error) {
      console.error('❌ Erro no Evolution API:', error);
      // Continua o processo mesmo se WhatsApp falhar
    }
    
    // Get tracking behavior data
    const behaviorData = await getBehaviorDataForWebhook(sessionId);
    
    // Send webhook to n8n with complete order data
    await webhookClient.sendOrderCompleted({
      customer: {
        whatsapp,
        sessionId
      },
      order: {
        items,
        totalItems,
        totalValue: total
      },
      behavior: behaviorData || {
        timeOnSite: 0,
        pagesVisited: [],
        productsViewed: [],
        searches: [],
        kitInterest: undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      orderId: `ORDER-${orderData.orderNumber}`, // Manter compatibilidade
      orderNumber: orderData.orderNumber,
      messageId,
      message: "Pedido enviado com sucesso!"
    });
    
  } catch (error) {
    console.error('Erro ao processar pedido:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: error.issues[0].message,
          details: error.issues
        }
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erro interno do servidor"
      }
    }, { status: 500 });
  }
}