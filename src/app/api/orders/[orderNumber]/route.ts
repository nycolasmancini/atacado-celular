import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderStatus, assignSellerToOrder } from '@/lib/orders';

interface RouteParams {
  params: {
    orderNumber: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const orderNumber = parseInt(params.orderNumber);
    
    if (isNaN(orderNumber)) {
      return NextResponse.json({
        success: false,
        error: 'Número de pedido inválido'
      }, { status: 400 });
    }

    const order = await getOrderByNumber(orderNumber);
    
    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Pedido não encontrado'
      }, { status: 404 });
    }

    // Calcular tempo em aberto
    const timeOpenHours = order.status === 'pending' 
      ? (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60)
      : order.completedAt 
        ? (order.completedAt.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60)
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        timeOpenHours: Math.round(timeOpenHours * 100) / 100
      }
    });

  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const orderNumber = parseInt(params.orderNumber);
    const body = await request.json();
    
    if (isNaN(orderNumber)) {
      return NextResponse.json({
        success: false,
        error: 'Número de pedido inválido'
      }, { status: 400 });
    }

    const { action, status, seller, notes, completedBy } = body;

    let updatedOrder;

    switch (action) {
      case 'updateStatus':
        if (!status) {
          return NextResponse.json({
            success: false,
            error: 'Status é obrigatório'
          }, { status: 400 });
        }
        
        updatedOrder = await updateOrderStatus(orderNumber, status, completedBy, notes);
        break;

      case 'assignSeller':
        if (!seller) {
          return NextResponse.json({
            success: false,
            error: 'Vendedor é obrigatório'
          }, { status: 400 });
        }
        
        updatedOrder = await assignSellerToOrder(orderNumber, seller);
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Ação inválida. Use: updateStatus ou assignSeller'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}