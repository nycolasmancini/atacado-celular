# Guia de Integração - Sistema de Webhook para Evolution API

## 📋 Resumo da Implementação

Foi implementado um sistema completo de tracking de jornada do cliente que envia webhooks consolidados para sua Evolution API. O sistema captura o comportamento do usuário e envia dados inteligentes para automações no N8N.

## 🔧 Configuração

### 1. Banco de Dados
O sistema criou automaticamente as tabelas necessárias:
- `site_config`: Configurações do webhook
- `user_journeys`: Dados completos da jornada do cliente

### 2. Configuração no Admin
Acesse: `/admin/configuracoes`

**Campos disponíveis:**
- **URL do Webhook**: URL da sua instância Evolution API
- **Webhook Ativo**: Liga/desliga o sistema
- **Chave Secreta**: Para validação (opcional)
- **Tempo Mínimo de Sessão**: Tempo mínimo para enviar webhook (padrão: 5min)
- **Timeout de Sessão**: Tempo para considerar sessão finalizada (padrão: 30min)
- **Valor Alto**: Threshold para carrinho de alto valor (padrão: R$ 1000)

## 🎯 Quando o Webhook é Enviado

O webhook é enviado APENAS em situações relevantes:

1. **Cliente fornece WhatsApp** ⭐ (prioridade máxima)
2. **Sessão expira** após inatividade configurada
3. **Carrinho abandonado** com valor alto
4. **Score de interesse** maior que 7
5. **Sessão significativa** (tempo mínimo + atividade)

## 📊 Estrutura do Payload

```json
{
  "evento": "jornada_concluida",
  "timestamp": "2025-08-02T15:30:00Z",
  "motivo": "whatsapp_inserido",
  
  "cliente": {
    "whatsapp": "+5511999999999",
    "email": "cliente@email.com",
    "sessao_id": "session_123",
    "primeira_visita": true,
    "total_visitas": 1
  },
  
  "resumo_jornada": {
    "tempo_total": "18min 45s",
    "paginas_visitadas": 8,
    "origem_trafego": "Google Ads",
    "dispositivo": "Mobile",
    "localizacao": "São Paulo, SP",
    "score_interesse": 8.5
  },
  
  "produtos": {
    "visualizados": [
      {
        "id": 123,
        "nome": "iPhone 14 Pro",
        "tempo": "5min 20s",
        "interesse": "alto"
      }
    ],
    "carrinho_atual": [
      {
        "id": 123,
        "quantidade": 1,
        "valor": 3500.00
      }
    ],
    "valor_carrinho": 3500.00
  },
  
  "comportamento": {
    "buscas": ["iPhone 14", "smartphone"],
    "tempo_indecisao": "Alto",
    "sinais_urgencia": ["visualizou_mesmo_produto_multiplas_vezes"],
    "flags_comportamento": ["visualizacao_detalhada"]
  },
  
  "oportunidade": {
    "nivel": "QUENTE",
    "motivo": "Carrinho abandonado com produto de alto valor",
    "sugestao_abordagem": "Oferecer desconto ou condição especial",
    "melhor_momento_contato": "agora",
    "produtos_focar": [123]
  }
}
```

## 🤖 Automações Sugeridas no N8N

### 1. **Oportunidade QUENTE**
```
Webhook → Verificar nivel === "QUENTE" → Notificar vendedor imediatamente
```

### 2. **Carrinho Abandonado**
```
Webhook → Verificar carrinho_abandonado === true → Aguardar 5min → Enviar desconto via WhatsApp
```

### 3. **Lead Scoring**
```
Webhook → Avaliar score_interesse → Classificar lead → Workflow personalizado
```

### 4. **Produto Específico**
```
Webhook → Verificar produtos_focar → Enviar material específico do produto
```

## 🔨 Como Implementar nos Componentes

### 1. **Tracking de Produto**
```tsx
import { useTracking } from '@/contexts/TrackingContext'

function ProductCard({ product }) {
  const { trackProductView } = useTracking()
  
  useEffect(() => {
    const tracker = trackProductView({
      id: product.id,
      name: product.name,
      price: product.price
    })
    
    return tracker.onLeave // Chama quando sair do produto
  }, [product])
}
```

### 2. **Tracking de Carrinho**
```tsx
function CartButton({ product }) {
  const { trackCartAction } = useTracking()
  
  const handleAddToCart = () => {
    trackCartAction('add', {
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      addedAt: new Date()
    })
    
    // Sua lógica de carrinho...
  }
}
```

### 3. **Tracking de Busca**
```tsx
function SearchInput() {
  const { trackSearch } = useTracking()
  
  const handleSearch = (query) => {
    trackSearch(query)
    // Sua lógica de busca...
  }
}
```

### 4. **Tracking de WhatsApp**
```tsx
function WhatsAppModal() {
  const { trackWhatsAppProvided } = useTracking()
  
  const handleSubmit = (phoneNumber) => {
    trackWhatsAppProvided(phoneNumber)
    // Resto da lógica...
  }
}
```

## 🧪 Testando o Sistema

### 1. **Teste do Webhook**
- Acesse `/admin/configuracoes`
- Configure a URL do webhook
- Clique em "Testar Webhook"
- Verifique se recebeu o payload de teste

### 2. **Teste da Jornada**
- Navegue pelo site como cliente
- Visualize produtos
- Adicione ao carrinho
- Deixe a sessão expirar
- Verifique se o webhook foi enviado

## 🔍 Monitoramento

### 1. **Logs do Banco**
```sql
-- Ver jornadas recentes
SELECT * FROM user_journeys ORDER BY createdAt DESC LIMIT 10;

-- Ver webhooks enviados
SELECT sessionId, webhookSent, webhookSentAt, endReason 
FROM user_journeys WHERE webhookSent = 1;
```

### 2. **Debug**
O sistema salva automaticamente:
- Status do webhook (enviado/erro)
- Resposta da API
- Motivo do término da sessão

## 📈 Métricas de Score

O sistema calcula automaticamente um score de 0-10 baseado em:

- **Tempo de sessão** (máx 3 pontos)
- **Produtos visualizados** (máx 3 pontos)  
- **Tempo por produto** (máx 2 pontos)
- **Items no carrinho** (2 pontos)
- **Valor do carrinho** (máx 2 pontos)
- **Páginas visitadas** (máx 1 ponto)
- **Sinais de urgência** (máx 2 pontos)

## 🚨 Sinais de Urgência Detectados

- Visualizou mesmo produto múltiplas vezes
- Alternando produtos rapidamente
- Adicionando/removendo do carrinho
- Interessado em item de alto valor
- Busca específica detalhada
- Sessão longa com engajamento

## 📝 Headers do Webhook

```
Content-Type: application/json
User-Agent: atacado-celular-webhook/1.0
X-Webhook-Secret: [sua_chave_secreta] (se configurada)
```

## 🔐 Segurança

- Valide a chave secreta no header `X-Webhook-Secret`
- Implemente rate limiting na sua Evolution API
- Use HTTPS obrigatoriamente
- Valide a estrutura do payload

## ✅ Sistema Implementado e Funcionando

O sistema está completamente implementado e pronto para uso:

✅ Banco de dados migrado  
✅ Tracking integrado no contexto  
✅ APIs criadas  
✅ Interface admin configurada  
✅ Documentação completa  
✅ Testes de build passando  

**Próximos passos:** Configure sua URL da Evolution API no admin e comece a receber os webhooks inteligentes!