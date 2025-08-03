import { NextRequest, NextResponse } from 'next/server';
import { getOrders, getOrderMetrics } from '@/lib/orders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de consulta
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const seller = searchParams.get('seller') || undefined;
    const startDate = searchParams.get('startDate') 
      ? new Date(searchParams.get('startDate')!) 
      : undefined;
    const endDate = searchParams.get('endDate') 
      ? new Date(searchParams.get('endDate')!) 
      : undefined;

    // Se solicitou métricas
    if (searchParams.get('metrics') === 'true') {
      const metrics = await getOrderMetrics();
      return NextResponse.json({
        success: true,
        data: metrics
      });
    }

    // Buscar pedidos
    const result = await getOrders({
      page,
      limit,
      status,
      seller,
      startDate,
      endDate
    });

    // Calcular tempo em aberto para cada pedido
    const ordersWithTime = result.orders.map(order => {
      const timeOpenHours = order.status === 'pending' 
        ? (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60)
        : order.completedAt 
          ? (order.completedAt.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60)
          : 0;

      return {
        ...order,
        timeOpenHours: Math.round(timeOpenHours * 100) / 100 // 2 casas decimais
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        orders: ordersWithTime
      }
    });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}