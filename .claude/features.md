# 🎯 features.md - Funcionalidades e Regras de Negócio

## Fluxo Principal do Usuário

```mermaid
1. Acessa Landing → 2. Vê Kits → 3. Insere WhatsApp
                                         ↓
6. Finaliza Pedido ← 5. Monta Carrinho ← 4. Preços Liberados
```

## Regras de Negócio Críticas

### 1. Liberação de Preços

- **Trigger**: WhatsApp válido inserido
- **Duração**: 7 dias (localStorage)
- **Validação**: Regex brasileiro obrigatório
- **Comportamento**: Mostra preços em TODO site

### 2. Pedido Mínimo

- **Quantidade**: 30 peças total (mix permitido)
- **Validação**: Soma de todos produtos ≥ 30
- **UI**: Barra progresso + contador visual
- **Bloqueio**: Botão finalizar desabilitado < 30

### 3. Sistema de Kits

- **Pré-definidos**: 3 kits (Giro Rápido, Loja Completa, Kit Barato)
- **Composição**: Múltiplos produtos com quantidades
- **Preço**: Calculado dinamicamente (sem desconto)
- **Customização**: Admin pode editar composição

### 4. Tracking Completo

```typescript
// Eventos capturados
- page_view: { page, referrer, timestamp }
- whatsapp_submitted: { number, source }
- product_viewed: { productId, timeSpent }
- product_zoomed: { productId }
- search_performed: { query, results }
- kit_viewed: { kitId, timeSpent }
- cart_updated: { action, productId, quantity }
- order_completed: { total, items, whatsapp }
```

## Integrações Externas

### Evolution API (WhatsApp)

```typescript
POST /message/sendText
{
  "number": "5511999999999",
  "message": "Novo pedido...",
  "delayMessage": 2
}
Headers: {
  "apikey": EVOLUTION_API_KEY,
  "Content-Type": "application/json"
}
```

### n8n Webhook

```typescript
POST https://n8n.url/webhook/atacado-order
{
  "event": "order_completed",
  "customer": { whatsapp, sessionId },
  "cart": [...items],
  "tracking": { ...allEvents },
  "timestamp": new Date()
}
```

## Estados da Aplicação

### Preços Liberados

```typescript
const checkPricesUnlocked = () => {
  const unlocked = localStorage.getItem('prices_unlocked')
  const expires = localStorage.getItem('unlock_expires')
  
  if (!unlocked || !expires) return false
  if (Date.now() > parseInt(expires)) return false
  
  return true
}
```

### Carrinho

```typescript
interface CartItem {
  productId: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isMinimumMet: boolean // >= 30
}
```

## Componentes Chave

### WhatsAppModal

- Aparece automaticamente se !pricesUnlocked
- Validação em tempo real
- Máscara brasileira
- Loading state durante envio
- Success feedback

### ProductCard

- Mostra “Libere preços” se bloqueado
- Zoom on hover/click
- Add to cart (se liberado)
- Badge categoria

### CartSummary

- Contador visual “X/30 peças”
- Progress bar colorida
- Lista items agrupados
- Botão WhatsApp condicional