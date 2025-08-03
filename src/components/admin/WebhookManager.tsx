"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";

interface WebhookUrls {
  whatsapp_captured: string;
  order_completed: string;
  cart_abandoned: string;
  high_value_interest: string;
  session_ended: string;
}

interface WebhookConfig {
  mode: 'production' | 'test';
  urls: {
    production: WebhookUrls;
    test: WebhookUrls;
  };
}

export function WebhookManager() {
  const [config, setConfig] = useState<WebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/webhook-mode');
      const data = await response.json();
      
      if (data.success) {
        setConfig(data);
      } else {
        toast.error('Erro ao carregar configuração de webhooks');
      }
    } catch (error) {
      console.error('Error fetching webhook config:', error);
      toast.error('Erro ao carregar configuração');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = async (newMode: 'production' | 'test') => {
    setIsSwitching(true);
    
    try {
      const response = await fetch('/api/admin/webhook-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode: newMode }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setConfig(prev => prev ? { ...prev, mode: newMode } : null);
        toast.success(`Modo alterado para: ${newMode === 'production' ? 'Produção' : 'Teste'}`);
      } else {
        toast.error(data.error || 'Erro ao alterar modo');
      }
    } catch (error) {
      console.error('Error switching webhook mode:', error);
      toast.error('Erro ao alterar modo');
    } finally {
      setIsSwitching(false);
    }
  };

  const testWebhook = async (event: string) => {
    try {
      const response = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`Webhook ${event} enviado com sucesso!`);
      } else {
        toast.error(`Erro ao enviar webhook: ${data.error}`);
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Erro ao testar webhook');
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card className="p-6">
        <div className="text-red-600">Erro ao carregar configuração de webhooks</div>
      </Card>
    );
  }

  const currentUrls = config.urls[config.mode];

  return (
    <div className="space-y-6">
      {/* Seletor de Modo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">🔗 Configuração de Webhooks</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium">Modo Atual</h4>
            <p className="text-sm text-gray-600">
              {config.mode === 'production' ? '🟢 Produção' : '🟡 Teste'}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={config.mode === 'production' ? 'default' : 'outline'}
              onClick={() => switchMode('production')}
              disabled={isSwitching || config.mode === 'production'}
              size="sm"
            >
              {isSwitching && config.mode !== 'production' ? 'Alternando...' : 'Produção'}
            </Button>
            <Button
              variant={config.mode === 'test' ? 'default' : 'outline'}
              onClick={() => switchMode('test')}
              disabled={isSwitching || config.mode === 'test'}
              size="sm"
            >
              {isSwitching && config.mode !== 'test' ? 'Alternando...' : 'Teste'}
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-700">
            <strong>Produção:</strong> Envia webhooks para n8n.pmcell.shop<br/>
            <strong>Teste:</strong> Envia webhooks para httpbin.org (para debug)
          </p>
        </div>
      </Card>

      {/* URLs Ativas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📡 URLs Ativas ({config.mode})</h3>
        
        <div className="space-y-3">
          {Object.entries(currentUrls).map(([event, url]) => (
            <div key={event} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {event.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="text-xs text-gray-600 font-mono break-all">
                  {url || 'Não configurado'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => testWebhook(event)}
                disabled={!url}
                className="ml-2"
              >
                Testar
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Status dos Webhooks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Status dos Webhooks</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-medium text-green-800 mb-2">✅ Implementados</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• WhatsApp Captured</li>
              <li>• Order Completed</li>
              <li>• Cart Abandoned (novo)</li>
              <li>• High Value Interest (novo)</li>
              <li>• Session Ended (novo)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-800 mb-2">ℹ️ Informações</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 5 tipos de webhook ativos</li>
              <li>• Alternância automática de ambiente</li>
              <li>• Teste individual de cada webhook</li>
              <li>• Logs detalhados no console</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}