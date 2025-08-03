import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

interface UpdateWhatsAppRequest {
  orderId: string;
  newWhatsapp: string;
  previousWhatsapp: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdateWhatsAppRequest = await request.json();
    const { orderId, newWhatsapp, previousWhatsapp, notes } = body;

    // Validação básica
    if (!orderId || !newWhatsapp || !previousWhatsapp) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Limpar e validar o novo número
    const cleanNewNumber = newWhatsapp.replace(/\D/g, '');
    const cleanPreviousNumber = previousWhatsapp.replace(/\D/g, '');

    if (cleanNewNumber.length < 10 || cleanNewNumber.length > 15) {
      return NextResponse.json(
        { error: 'Número de WhatsApp inválido' },
        { status: 400 }
      );
    }

    // Se os números são iguais, não precisa fazer nada
    if (cleanNewNumber === cleanPreviousNumber) {
      return NextResponse.json(
        { message: 'Número já está atualizado' },
        { status: 200 }
      );
    }

    // Obter informações da requisição para auditoria
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const xForwardedFor = headersList.get('x-forwarded-for');
    const xRealIp = headersList.get('x-real-ip');
    const ipAddress = xForwardedFor?.split(',')[0] || xRealIp || 'Unknown';

    // Limpar o orderId se vier no formato "ORDER-123"
    const cleanOrderId = orderId.replace(/^ORDER-/, '');
    const orderIdNumber = parseInt(cleanOrderId);
    
    // Verificar se o pedido existe
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderIdNumber },
          { orderNumber: orderIdNumber },
        ]
      }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // Realizar a atualização e criar o histórico em uma transação
    const result = await prisma.$transaction(async (tx) => {
      // Atualizar o pedido
      const updatedOrder = await tx.order.update({
        where: { id: existingOrder.id },
        data: {
          currentWhatsapp: cleanNewNumber,
          updatedAt: new Date()
        }
      });

      // Criar registro de histórico
      const whatsappChange = await tx.whatsappChange.create({
        data: {
          orderId: existingOrder.id,
          previousNumber: cleanPreviousNumber,
          newNumber: cleanNewNumber,
          changeReason: 'user_request',
          changedBy: 'customer',
          ipAddress: ipAddress,
          userAgent: userAgent,
          notes: notes || `WhatsApp alterado pelo cliente de ${cleanPreviousNumber} para ${cleanNewNumber}`
        }
      });

      return { updatedOrder, whatsappChange };
    });

    return NextResponse.json({
      success: true,
      message: 'WhatsApp atualizado com sucesso',
      data: {
        orderId: result.updatedOrder.id,
        orderNumber: result.updatedOrder.orderNumber,
        previousWhatsapp: cleanPreviousNumber,
        newWhatsapp: cleanNewNumber,
        changeId: result.whatsappChange.id
      }
    });

  } catch (error) {
    console.error('❌ Erro ao atualizar WhatsApp:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Endpoint para buscar histórico de alterações de um pedido
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      );
    }

    // Limpar o orderId se vier no formato "ORDER-123"
    const cleanOrderId = orderId.replace(/^ORDER-/, '');
    const orderIdNumber = parseInt(cleanOrderId);
    
    // Buscar o pedido e seu histórico
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderIdNumber },
          { orderNumber: orderIdNumber },
        ]
      },
      include: {
        whatsappHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        originalWhatsapp: order.originalWhatsapp,
        currentWhatsapp: order.currentWhatsapp,
        history: order.whatsappHistory
      }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar histórico de WhatsApp:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}