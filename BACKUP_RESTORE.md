# Sistema de Backup e Restore

## Visão Geral

O sistema de backup implementado fornece backup automático e manual dos dados críticos do sistema, incluindo produtos, categorias, kits e dados de tracking.

## Estrutura do Backup

### Dados Incluídos no Backup

- **Produtos**: Todos os produtos (ativos e inativos) com preços, descrições e relacionamentos
- **Categorias**: Todas as categorias de produtos
- **Kits**: Kits promocionais e seus itens
- **Tracking**: Eventos de tracking dos últimos 30 dias
- **Configurações**: Configurações do sistema (SiteConfig)

### Formato do Backup

```json
{
  "timestamp": "2025-01-01T12:00:00.000Z",
  "version": "1.0",
  "data": {
    "products": [...],
    "categories": [...],
    "kits": [...],
    "kitItems": [...],
    "tracking": [...],
    "siteConfig": [...]
  },
  "metadata": {
    "totalRecords": 1250,
    "exportedAt": "2025-01-01T12:00:00.000Z",
    "databaseProvider": "sqlite"
  }
}
```

## Backup Automático

### Configuração

- **Frequência**: Diário às 3:00 AM (horário do servidor)
- **Cron Job**: Configurado no `vercel.json`
- **Endpoint**: `/api/cron/backup`
- **Autenticação**: Bearer token via `CRON_SECRET`

### Logs

Os backups automáticos são registrados no console com as seguintes informações:
- Timestamp do backup
- Número total de registros
- Tamanho do arquivo
- Status (sucesso/falha)

## Backup Manual

### Como Criar

1. Acesse o painel admin: `/admin/backup`
2. Clique em "Criar Backup"
3. O arquivo será baixado automaticamente

### Funcionalidades

- Download automático do arquivo JSON
- Validação de dados antes da exportação
- Feedback visual do progresso
- Informações detalhadas do backup criado

## Processo de Restore (Futuro)

### Implementação Planejada

O sistema de restore será implementado em fases futuras com as seguintes funcionalidades:

#### Fase 1: Restore Básico
- Upload de arquivo de backup via interface admin
- Validação de estrutura do backup
- Restore seletivo por tipo de dados
- Backup automático antes do restore

#### Fase 2: Restore Avançado
- Preview dos dados antes do restore
- Merge de dados (ao invés de substituição completa)
- Restore incremental
- Rollback automático em caso de falha

#### Fase 3: Gestão Avançada
- Histórico de restores
- Agendamento de restores
- Restore de pontos específicos no tempo
- Notificações por email

### Processo Manual de Restore (Atual)

Para restore manual usando o arquivo de backup:

1. **Preparação**
   ```bash
   # Fazer backup atual antes do restore
   cp database.db database.backup.db
   ```

2. **Validação do Arquivo**
   - Verificar se o arquivo JSON está válido
   - Confirmar que a estrutura está correta
   - Verificar compatibilidade da versão

3. **Restore via Prisma (Exemplo)**
   ```typescript
   // Código exemplo para restore futuro
   async function restoreFromBackup(backupData: BackupData) {
     // Limpar dados existentes (cuidado!)
     await prisma.trackingEvent.deleteMany();
     await prisma.kitItem.deleteMany();
     await prisma.kit.deleteMany();
     await prisma.product.deleteMany();
     await prisma.category.deleteMany();
     
     // Inserir dados do backup
     await prisma.category.createMany({ data: backupData.data.categories });
     await prisma.product.createMany({ data: backupData.data.products });
     // ... outros dados
   }
   ```

## Segurança

### Autenticação
- Backup manual: Requer autenticação de admin
- Backup automático: Protegido por token secreto

### Dados Sensíveis
- Passwords de admin não são incluídos no backup
- IPs e dados pessoais são incluídos nos tracking events
- Considere LGPD ao fazer restore de dados antigos

### Validação
- Validação de estrutura antes do export
- Verificação de integridade dos dados
- Logs detalhados para auditoria

## Monitoramento

### Logs Importantes
- Sucesso/falha de backups automáticos
- Tentativas de acesso não autorizado
- Tamanho dos arquivos de backup
- Tempo de execução

### Métricas Recomendadas
- Frequência de backups manuais
- Tamanho médio dos backups
- Tempo de execução dos backups
- Taxa de sucesso dos backups automáticos

## Configuração de Ambiente

### Variáveis Necessárias

```env
# Para backup automático
CRON_SECRET=your-secret-token-here

# Para integrações futuras
BACKUP_WEBHOOK_URL=https://webhook.example.com/backup
GITHUB_TOKEN=github_token_for_remote_backup
AWS_ACCESS_KEY_ID=for_s3_backup
AWS_SECRET_ACCESS_KEY=for_s3_backup
S3_BUCKET=backup-bucket-name
```

### Deploy

O sistema está configurado para funcionar automaticamente no Vercel:
- Cron jobs são executados automaticamente
- Não requer configuração adicional
- Funciona com bancos SQLite, PostgreSQL e MySQL

## Troubleshooting

### Problemas Comuns

1. **Backup automático não executa**
   - Verificar se `CRON_SECRET` está configurado
   - Confirmar que o cron job está ativo no Vercel
   - Verificar logs do Vercel Functions

2. **Backup manual falha**
   - Verificar autenticação do admin
   - Confirmar conectividade com banco de dados
   - Verificar logs de erro no console

3. **Arquivo de backup muito grande**
   - Considerar reduzir período de tracking (atual: 30 dias)
   - Implementar compressão de dados
   - Usar backup incremental

### Logs de Debug

```typescript
// Ativar logs detalhados
console.log('Backup debug info:', {
  timestamp: new Date().toISOString(),
  totalRecords: backupData.metadata.totalRecords,
  fileSize: Buffer.byteLength(JSON.stringify(backupData))
});
```

## Roadmap

### Próximas Implementações

1. **Interface de Restore** (Q1 2025)
   - Upload de arquivos via drag & drop
   - Preview de dados antes do restore
   - Validação automática

2. **Backup Remoto** (Q2 2025)
   - Integração com GitHub
   - Backup para AWS S3
   - Múltiplas opções de destino

3. **Backup Incremental** (Q2 2025)
   - Backup apenas de dados modificados
   - Redução significativa no tamanho
   - Restore mais rápido

4. **Notificações** (Q3 2025)
   - Email sobre falhas de backup
   - Relatórios periódicos
   - Alertas de espaço em disco

## Suporte

Para problemas relacionados ao sistema de backup:

1. Verificar logs do sistema
2. Consultar esta documentação
3. Verificar configurações de ambiente
4. Contatar administrador do sistema

---

**Nota**: Este documento será atualizado conforme novas funcionalidades forem implementadas.