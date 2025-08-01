"use client";

import { useState } from 'react';

interface BackupInfo {
  timestamp: string;
  totalRecords: number;
  size: string;
  filename: string;
}

export default function BackupPage() {
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    setError(null);
    setBackupInfo(null);

    try {
      const response = await fetch('/api/backup');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar backup');
      }

      // Get backup info from headers
      const contentLength = response.headers.get('content-length');
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'backup.json';

      // Create blob and download
      const blob = await response.blob();
      const backupData = JSON.parse(await blob.text());
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Set backup info for display
      setBackupInfo({
        timestamp: new Date(backupData.timestamp).toLocaleString('pt-BR'),
        totalRecords: backupData.metadata.totalRecords,
        size: contentLength ? `${Math.round(parseInt(contentLength) / 1024)} KB` : 'Unknown',
        filename,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Backup error:', err);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Backup do Sistema</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Gerencie backups da base de dados do sistema
      </p>

      {/* Manual Backup Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Backup Manual</h2>
        <p className="text-gray-600 mb-4">
          Crie um backup completo dos dados do sistema incluindo produtos, categorias, kits e dados de tracking (últimos 30 dias).
        </p>
        
        <button
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isCreatingBackup
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isCreatingBackup ? (
            <>
              <span className="inline-block mr-2">⏳</span>
              Criando Backup...
            </>
          ) : (
            <>
              <span className="inline-block mr-2">💾</span>
              Criar Backup
            </>
          )}
        </button>
      </div>

      {/* Backup Success Info */}
      {backupInfo && (
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ Backup Criado com Sucesso
          </h3>
          <div className="space-y-2 text-green-700">
            <p><strong>Arquivo:</strong> {backupInfo.filename}</p>
            <p><strong>Data/Hora:</strong> {backupInfo.timestamp}</p>
            <p><strong>Total de Registros:</strong> {backupInfo.totalRecords.toLocaleString('pt-BR')}</p>
            <p><strong>Tamanho:</strong> {backupInfo.size}</p>
          </div>
          <p className="text-green-600 text-sm mt-2">
            O arquivo foi baixado automaticamente para o seu computador.
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Erro ao Criar Backup
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Automated Backup Info */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Backup Automático</h2>
        <div className="space-y-2 text-blue-800">
          <p><strong>Frequência:</strong> Diariamente às 3:00 da manhã</p>
          <p><strong>Status:</strong> Ativo</p>
          <p><strong>Próximo backup:</strong> {
            new Date(new Date().setHours(3, 0, 0, 0) + (new Date().getHours() >= 3 ? 24 * 60 * 60 * 1000 : 0))
              .toLocaleString('pt-BR')
          }</p>
        </div>
        <p className="text-blue-600 text-sm mt-3">
          Os backups automáticos são executados via Vercel Cron Jobs e registrados nos logs do sistema.
        </p>
      </div>

      {/* Backup Content Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conteúdo do Backup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">📦</span>
              <div>
                <p className="font-medium">Produtos</p>
                <p className="text-gray-500 text-sm">Todos os produtos ativos e inativos</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">🏷️</span>
              <div>
                <p className="font-medium">Categorias</p>
                <p className="text-gray-500 text-sm">Todas as categorias de produtos</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">🎁</span>
              <div>
                <p className="font-medium">Kits</p>
                <p className="text-gray-500 text-sm">Kits e itens relacionados</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">📊</span>
              <div>
                <p className="font-medium">Dados de Tracking</p>
                <p className="text-gray-500 text-sm">Últimos 30 dias de analytics</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">⚙️</span>
              <div>
                <p className="font-medium">Configurações</p>
                <p className="text-gray-500 text-sm">Configurações do sistema</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Future Features Note */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mt-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          🚧 Funcionalidades Futuras
        </h3>
        <ul className="text-yellow-700 space-y-1 text-sm">
          <li>• Restauração de backup (importação)</li>
          <li>• Lista de backups disponíveis</li>
          <li>• Notificações por email sobre backup automático</li>
          <li>• Integração com GitHub para armazenamento remoto</li>
          <li>• Backup incremental</li>
        </ul>
      </div>
    </div>
  );
}