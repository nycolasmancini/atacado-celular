"use client";

import React, { useState, useEffect } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isSpecialPrice: boolean;
}

interface WhatsappChange {
  id: number;
  previousNumber: string;
  newNumber: string;
  changeReason: string;
  changedBy?: string;
  ipAddress?: string;
  notes?: string;
  createdAt: string;
}

interface Order {
  id: number;
  orderNumber: number;
  originalWhatsapp: string;
  currentWhatsapp: string;
  totalValue: number;
  totalItems: number;
  status: string;
  assignedSeller?: string;
  chatwootContactId?: string;
  timeOpenHours: number;
  createdAt: string;
  completedAt?: string;
  items: OrderItem[];
  whatsappHistory?: WhatsappChange[];
}

interface OrderMetrics {
  last7Days: {
    count: number;
    totalValue: number;
    avgTicket: number;
  };
  previous7Days: {
    count: number;
    avgTicket: number;
  };
  avgCompletionTimeHours: number;
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [metrics, setMetrics] = useState<OrderMetrics | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [whatsappHistory, setWhatsappHistory] = useState<WhatsappChange[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');

  // Carregar pedidos e métricas
  useEffect(() => {
    loadOrders();
    loadMetrics();
  }, [statusFilter, sellerFilter]);

  const loadOrders = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sellerFilter !== 'all') params.append('seller', sellerFilter);

      const response = await fetch(`/api/orders?${params}`);
      const result = await response.json();

      if (result.success) {
        setOrders(result.data?.orders || []);
      } else {
        setError(result.error || 'Erro ao carregar pedidos');
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setError('Erro de conexão ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const response = await fetch('/api/orders?metrics=true');
      const result = await response.json();

      if (result.success) {
        setMetrics(result.data || null);
      }
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      // Não mostrar erro para métricas, apenas não exibir
    }
  };

  const loadWhatsappHistory = async (orderNumber: number) => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`/api/orders/update-whatsapp?orderId=${orderNumber}`);
      const result = await response.json();
      
      if (result.success && result.data?.history) {
        setWhatsappHistory(result.data.history);
      } else {
        setWhatsappHistory([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de WhatsApp:', error);
      setWhatsappHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const updateOrderStatus = async (orderNumber: number, status: string, completedBy?: string) => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateStatus',
          status,
          completedBy
        })
      });

      const result = await response.json();
      if (result.success) {
        loadOrders(); // Recarregar lista
        setSelectedOrder(null); // Fechar modal
      }
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Em Andamento';
      case 'completed': return 'Finalizado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatCurrency = (value: number | string | any) => {
    // Converter para number se necessário
    const numValue = typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
    
    // Verificar se é um número válido
    if (isNaN(numValue)) {
      return 'R$ 0,00';
    }
    
    return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const formatWhatsApp = (whatsapp: string) => {
    // Formatar número para exibição mais legível
    return whatsapp;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar pedidos</h3>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                loadOrders();
                loadMetrics();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Pedidos (7 dias)</h3>
              <p className="text-2xl font-bold text-gray-900">{metrics.last7Days?.count || 0}</p>
              <p className="text-sm text-gray-600">
                Média: {((metrics.last7Days?.count || 0) / 7).toFixed(1)}/dia
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Ticket Médio (7 dias)</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.last7Days?.avgTicket || 0)}
              </p>
              <p className="text-sm text-gray-600">
                Anterior: {formatCurrency(metrics.previous7Days?.avgTicket || 0)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Volume Total (7 dias)</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.last7Days?.totalValue || 0)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Tempo Médio de Finalização</h3>
              <p className="text-2xl font-bold text-gray-900">
                {(metrics.avgCompletionTimeHours || 0).toFixed(1)}h
              </p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="processing">Em Andamento</option>
                <option value="completed">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
              <select
                value={sellerFilter}
                onChange={(e) => setSellerFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Todos</option>
                <option value="">Não Atribuído</option>
                {/* Aqui você pode adicionar vendedores dinamicamente */}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Pedidos</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tempo Aberto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.totalItems} itens
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatWhatsApp(order.currentWhatsapp)}
                      </div>
                      {order.currentWhatsapp !== order.originalWhatsapp && (
                        <div className="text-xs text-orange-600">
                          Original: {formatWhatsApp(order.originalWhatsapp)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.assignedSeller || 'Não atribuído'}
                      </div>
                      {order.chatwootContactId && (
                        <div className="text-xs text-blue-600">
                          Chatwoot: {order.chatwootContactId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalValue || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.timeOpenHours.toFixed(1)}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          loadWhatsappHistory(order.orderNumber);
                        }}
                        className="text-orange-600 hover:text-orange-900 mr-4"
                      >
                        Ver Detalhes
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.orderNumber, 'completed', 'Admin')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Finalizar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalhes do Pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Pedido #{selectedOrder.orderNumber}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Informações do Pedido */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp Atual</label>
                  <p className="text-sm text-gray-900">{selectedOrder.currentWhatsapp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">WhatsApp Original</label>
                  <p className="text-sm text-gray-900">{selectedOrder.originalWhatsapp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vendedor</label>
                  <p className="text-sm text-gray-900">{selectedOrder.assignedSeller || 'Não atribuído'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>

              {/* Histórico de WhatsApp */}
              {selectedOrder.currentWhatsapp !== selectedOrder.originalWhatsapp && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">
                    Histórico de Alterações de WhatsApp
                  </h4>
                  
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                      <span className="ml-2 text-sm text-gray-600">Carregando histórico...</span>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="space-y-3">
                        {/* Registro inicial */}
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">WhatsApp Original:</span>
                              <span className="ml-2 font-mono text-green-700">{selectedOrder.originalWhatsapp}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(selectedOrder.createdAt)} - Cliente informou no acesso
                            </div>
                          </div>
                        </div>
                        
                        {/* Alterações */}
                        {whatsappHistory.map((change, index) => (
                          <div key={change.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">Alterado para:</span>
                                <span className="ml-2 font-mono text-orange-700">{change.newNumber}</span>
                                {change.changedBy && (
                                  <span className="ml-2 text-gray-500">por {change.changedBy}</span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(change.createdAt)}
                                {change.changeReason === 'user_request' && ' - Solicitação do cliente'}
                                {change.changeReason === 'admin_change' && ' - Alteração administrativa'}
                                {change.changeReason === 'correction' && ' - Correção'}
                              </div>
                              {change.notes && (
                                <div className="text-xs text-gray-600 mt-1 italic">
                                  "{change.notes}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        
                        {/* Status atual */}
                        <div className="flex items-start space-x-3 border-t border-yellow-300 pt-3">
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">WhatsApp Atual:</span>
                              <span className="ml-2 font-mono text-blue-700 font-bold">{selectedOrder.currentWhatsapp}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Este é o número que será usado para contato
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {whatsappHistory.length === 0 && !loadingHistory && (
                        <div className="text-sm text-gray-600 text-center py-2">
                          <p>Histórico de alterações não encontrado ou ainda não carregado.</p>
                          <p className="text-xs mt-1">
                            Número foi alterado de {selectedOrder.originalWhatsapp} para {selectedOrder.currentWhatsapp}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Itens do Pedido */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qtd</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {item.productName}
                            {item.isSpecialPrice && (
                              <span className="ml-2 text-xs text-green-600">(Preço Especial)</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(item.unitPrice || 0)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900">{formatCurrency(item.totalPrice || 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                          Total do Pedido:
                        </td>
                        <td className="px-3 py-2 text-sm font-bold text-gray-900">
                          {formatCurrency(selectedOrder.totalValue || 0)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Fechar
                </button>
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.orderNumber, 'completed', 'Admin')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Finalizar Pedido
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}