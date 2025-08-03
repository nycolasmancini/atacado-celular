import { prisma } from '@/lib/prisma';

/**
 * Gera o próximo número sequencial de pedido
 */
export async function generateOrderNumber(): Promise<number> {
  // Busca o último pedido criado
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: 'desc' },
    select: { orderNumber: true }
  });

  // Se não há pedidos, começa do 27825 para dar impressão de site estabelecido
  if (!lastOrder) {
    return 27825;
  }

  // Se o último pedido for menor que 27825, pula para 27825
  if (lastOrder.orderNumber < 27825) {
    return 27825;
  }

  // Retorna o próximo número
  return lastOrder.orderNumber + 1;
}

/**
 * Cria um novo pedido no banco de dados
 */
export async function createOrder(data: {
  sessionId: string;
  originalWhatsapp: string;
  currentWhatsapp: string;
  totalValue: number;
  totalItems: number;
  chatwootContactId?: string;
  assignedSeller?: string;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isSpecialPrice: boolean;
    specialPriceMinQty?: number;
  }>;
}) {
  const orderNumber = await generateOrderNumber();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      sessionId: data.sessionId,
      originalWhatsapp: data.originalWhatsapp,
      currentWhatsapp: data.currentWhatsapp,
      totalValue: data.totalValue,
      totalItems: data.totalItems,
      chatwootContactId: data.chatwootContactId,
      assignedSeller: data.assignedSeller,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          isSpecialPrice: item.isSpecialPrice,
          specialPriceMinQty: item.specialPriceMinQty,
        }))
      }
    },
    include: {
      items: true
    }
  });

  return order;
}

/**
 * Busca pedidos com filtros e paginação
 */
export async function getOrders(options: {
  page?: number;
  limit?: number;
  status?: string;
  seller?: string;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const {
    page = 1,
    limit = 20,
    status,
    seller,
    startDate,
    endDate
  } = options;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (seller) {
    where.assignedSeller = seller;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
}

/**
 * Busca um pedido específico por número
 */
export async function getOrderByNumber(orderNumber: number) {
  return await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true
    }
  });
}

/**
 * Atualiza status do pedido
 */
export async function updateOrderStatus(
  orderNumber: number,
  status: string,
  completedBy?: string,
  notes?: string
) {
  const updateData: any = {
    status,
    updatedAt: new Date()
  };

  if (status === 'completed') {
    updateData.completedAt = new Date();
    updateData.completedBy = completedBy;
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  return await prisma.order.update({
    where: { orderNumber },
    data: updateData,
    include: {
      items: true
    }
  });
}

/**
 * Atribui vendedor ao pedido
 */
export async function assignSellerToOrder(
  orderNumber: number,
  seller: string
) {
  return await prisma.order.update({
    where: { orderNumber },
    data: {
      assignedSeller: seller,
      sellerAssignedAt: new Date(),
      status: 'processing'
    }
  });
}

/**
 * Calcula métricas dos últimos 7 dias
 */
export async function getOrderMetrics() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // Métricas dos últimos 7 dias
  const last7Days = await prisma.order.aggregate({
    where: {
      createdAt: { gte: sevenDaysAgo }
    },
    _avg: { totalValue: true },
    _count: true,
    _sum: { totalValue: true }
  });

  // Métricas dos 7 dias anteriores (para comparação)
  const previous7Days = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo
      }
    },
    _avg: { totalValue: true },
    _count: true
  });

  // Tempo médio entre pedido e finalização
  const completedOrders = await prisma.order.findMany({
    where: {
      status: 'completed',
      completedAt: { not: null },
      createdAt: { gte: sevenDaysAgo }
    },
    select: {
      createdAt: true,
      completedAt: true
    }
  });

  const avgCompletionTime = completedOrders.length > 0
    ? completedOrders.reduce((sum, order) => {
        const diff = order.completedAt!.getTime() - order.createdAt.getTime();
        return sum + diff;
      }, 0) / completedOrders.length / (1000 * 60 * 60) // em horas
    : 0;

  return {
    last7Days: {
      count: last7Days._count || 0,
      totalValue: last7Days._sum.totalValue || 0,
      avgTicket: last7Days._avg.totalValue || 0
    },
    previous7Days: {
      count: previous7Days._count || 0,
      avgTicket: previous7Days._avg.totalValue || 0
    },
    avgCompletionTimeHours: avgCompletionTime
  };
}