'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface EvolutionStatusData {
  success: boolean;
  status: 'connected' | 'disconnected' | 'connected_but_send_failed' | 'error';
  message: string;
  messageId?: string;
  error?: string;
  timestamp?: string;
}

export function EvolutionStatus() {
  const [status, setStatus] = useState<EvolutionStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-evolution', {
        method: 'GET',
        credentials: 'include'
      });
      
      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date());
    } catch (error) {
      setStatus({
        success: false,
        status: 'error',
        message: 'Erro ao conectar com servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestMessage = async () => {
    const number = prompt('Digite o número para teste (formato: 5511981326609):');
    if (!number) return;

    const message = prompt('Digite a mensagem de teste:');
    if (!message) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/test-evolution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ number, message })
      });

      const data = await response.json();
      setStatus(data);
      setLastChecked(new Date());
      
      if (data.success) {
        alert('Mensagem enviada com sucesso! ID: ' + data.messageId);
      } else {
        alert('Falha ao enviar: ' + data.error);
      }
    } catch (error) {
      alert('Erro: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = () => {
    if (!status) return 'bg-gray-500';
    
    switch (status.status) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
      case 'connected_but_send_failed':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!status) return 'Verificando...';
    
    switch (status.status) {
      case 'connected':
        return 'Conectado ✅';
      case 'disconnected':
        return 'Desconectado ⚠️';
      case 'connected_but_send_failed':
        return 'Conectado mas falha no envio ⚠️';
      case 'error':
        return 'Erro ❌';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Status Evolution API
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
        </div>
      </div>

      {status && (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">
              <strong>Status:</strong> {status.message}
            </p>
            
            {status.error && (
              <p className="text-sm text-red-600 mt-1">
                <strong>Erro:</strong> {status.error}
              </p>
            )}
            
            {status.messageId && (
              <p className="text-sm text-green-600 mt-1">
                <strong>ID da Mensagem:</strong> {status.messageId}
              </p>
            )}
          </div>

          {lastChecked && (
            <p className="text-xs text-gray-500">
              Última verificação: {lastChecked.toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}

      <div className="flex space-x-3 mt-4">
        <Button
          onClick={checkConnection}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? 'Verificando...' : 'Verificar Conexão'}
        </Button>
        
        <Button
          onClick={sendTestMessage}
          disabled={isLoading || status?.status !== 'connected'}
          variant="outline"
          size="sm"
        >
          Enviar Teste
        </Button>
      </div>

      {/* Documentação rápida */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Possíveis Erros e Soluções:
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <strong>ECONNREFUSED:</strong> Evolution API não está rodando na URL configurada
          </div>
          <div>
            <strong>401 Unauthorized:</strong> API Key inválida ou não configurada
          </div>
          <div>
            <strong>Instance state: close:</strong> Instância desconectada do WhatsApp
          </div>
          <div>
            <strong>Timeout:</strong> Evolution API está lento ou sobrecarregado
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <strong>Variáveis necessárias no .env:</strong><br/>
          • EVOLUTION_API_URL<br/>
          • EVOLUTION_API_KEY<br/>
          • EVOLUTION_INSTANCE
        </div>
      </div>
    </div>
  );
}