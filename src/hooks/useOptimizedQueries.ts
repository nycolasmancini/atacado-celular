import { useState, useEffect, useCallback, useMemo } from 'react';
import { prisma } from '@/lib/prisma';

interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para consultas otimizadas com cache e debounce
 */
export function useOptimizedQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
): QueryResult<T> {
  const { enabled = true, refetchInterval, staleTime = 5 * 60 * 1000 } = options; // 5 min default cache
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    // Check if data is still fresh
    const now = Date.now();
    if (data && staleTime && (now - lastFetch) < staleTime) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      setLastFetch(now);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, data, staleTime, lastFetch]);

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [refetch, enabled]);

  // Auto refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(refetch, refetchInterval);
    return () => clearInterval(interval);
  }, [refetch, refetchInterval, enabled]);

  return { data, loading, error, refetch };
}

/**
 * Hook específico para produtos com otimizações
 */
export function useOptimizedProducts(categoryId?: number) {
  const queryFn = useCallback(async () => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' },
      ],
    });

    return products;
  }, [categoryId]);

  return useOptimizedQuery(
    `products-${categoryId || 'all'}`,
    queryFn,
    {
      staleTime: 2 * 60 * 1000, // 2 minutos para produtos
    }
  );
}

/**
 * Hook para categorias com cache longo
 */
export function useOptimizedCategories() {
  const queryFn = useCallback(async () => {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }, []);

  return useOptimizedQuery(
    'categories',
    queryFn,
    {
      staleTime: 10 * 60 * 1000, // 10 minutos para categorias
    }
  );
}

/**
 * Hook para kits otimizado
 */
export function useOptimizedKits() {
  const queryFn = useCallback(async () => {
    return await prisma.kit.findMany({
      where: { isActive: true },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                specialPrice: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }, []);

  return useOptimizedQuery(
    'kits',
    queryFn,
    {
      staleTime: 5 * 60 * 1000, // 5 minutos para kits
    }
  );
}

/**
 * Hook para orders com paginação otimizada
 */
export function useOptimizedOrders(page: number = 1, limit: number = 20) {
  const queryFn = useCallback(async () => {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          items: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              totalPrice: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count(),
    ]);

    return {
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + orders.length < total,
    };
  }, [page, limit]);

  return useOptimizedQuery(
    `orders-page-${page}-limit-${limit}`,
    queryFn,
    {
      staleTime: 30 * 1000, // 30 segundos para orders
    }
  );
}

/**
 * Hook para analytics dashboard
 */
export function useOptimizedAnalytics(dateRange?: { from: Date; to: Date }) {
  const queryFn = useCallback(async () => {
    const whereClause = dateRange ? {
      createdAt: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    } : {};

    const [
      totalOrders,
      totalRevenue,
      averageOrderValue,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      // Total de pedidos
      prisma.order.count({ where: whereClause }),
      
      // Receita total
      prisma.order.aggregate({
        where: whereClause,
        _sum: { totalValue: true },
      }),
      
      // Valor médio dos pedidos
      prisma.order.aggregate({
        where: whereClause,
        _avg: { totalValue: true },
      }),
      
      // Top produtos mais vendidos
      prisma.orderItem.groupBy({
        by: ['productName'],
        where: dateRange ? {
          order: { createdAt: whereClause.createdAt },
        } : {},
        _sum: { quantity: true },
        _count: true,
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 10,
      }),
      
      // Pedidos recentes
      prisma.order.findMany({
        where: whereClause,
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          totalValue: true,
          status: true,
          currentWhatsapp: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalValue || 0,
      averageOrderValue: averageOrderValue._avg.totalValue || 0,
      topProducts,
      recentOrders,
    };
  }, [dateRange]);

  return useOptimizedQuery(
    `analytics-${dateRange?.from.toISOString()}-${dateRange?.to.toISOString()}`,
    queryFn,
    {
      staleTime: 60 * 1000, // 1 minuto para analytics
    }
  );
}

/**
 * Cache simples em memória para consultas frequentes
 */
class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const queryCache = new SimpleCache();