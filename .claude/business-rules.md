# business-rules.md - Regras de Negócio

## 🔐 Liberação de Preços

### Regras

1. Preços inicialmente ocultos
1. WhatsApp válido libera por 7 dias
1. Salvar em localStorage
1. Verificar expiração a cada acesso

### Implementação

```typescript
// Verificar se liberado
const checkPricesUnlocked = () => {
  const unlocked = localStorage.getItem('prices_unlocked')
  const expires = localStorage.getItem('unlock_expires')
  
  if (!unlocked || !expires) return false
  if (Date.now() > parseInt(expires)) {
    localStorage.removeItem('prices_unlocked')
    localStorage.removeItem('unlock_expires')
    return false
  }
  
  return true
}

// Liberar preços
const unlockPrices = (whatsapp: string) => {
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000)
  localStorage.setItem('prices_unlocked', 'true')
  localStorage.setItem('unlock_expires', expiresAt.toString())
}
```

## 🛒 Pedido Mínimo

### Regras

1. Mínimo 30 peças total
1. Pode ser mix de produtos
1. Botão finalizar desabilitado < 30
1. Mostrar progresso visual

### Validação

```typescript
const validateMinOrder = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.quantity, 0)
  return {
    isValid: total >= 30,
    current: total,
    remaining: Math.max(0, 30 - total)
  }
}
```

## 📦 Kits

### Composição

1. Kit = múltiplos produtos + quantidades
1. Preço = soma dos produtos
1. Sem desconto adicional
1. 3 kits pré-definidos

### Kits Padrão

```typescript
const defaultKits = [
  {
    name: "Kit Giro Rápido",
    description: "Produtos que mais vendem",
    colorTheme: "purple-pink"
  },
  {
    name: "Kit Loja Completa", 
    description: "Tudo para começar",
    colorTheme: "blue-green"
  },
  {
    name: "Kit Barato",
    description: "Melhor custo-benefício",
    colorTheme: "orange-yellow"
  }
]
```

## 📊 Tracking

### Eventos Obrigatórios

1. `page_view` - Toda navegação
1. `whatsapp_submitted` - WhatsApp inserido
1. `product_viewed` - Produto clicado
1. `order_completed` - Pedido finalizado

### Dados Coletados

```typescript
interface TrackingData {
  sessionId: string        // UUID único
  whatsapp?: string       // Após liberar
  timeOnSite: number      // Milliseconds
  pagesVisited: string[]  // URLs
  productsViewed: number[] // IDs
  searches: string[]      // Queries
  kitInterest?: string    // Kit visualizado
}
```

## 🚫 Restrições

### Produtos

- Sem estoque = isActive false = invisível
- Sem controle de quantidade
- Preço único para todos

### Clientes

- Sem cadastro/login
- Sem histórico de pedidos
- Sessão temporária (localStorage)

### Admin

- Acesso único (1 email/senha)
- Sem níveis de permissão
- Todas ações permitidas
```markdown
## 📊 Tracking e Conversões Meta

### Eventos Padrão Implementados
1. **PageView**: Todas as páginas
2. **ViewContent**: Visualização de produto
3. **AddToCart**: Produto adicionado
4. **InitiateCheckout**: Carrinho aberto
5. **Lead**: WhatsApp capturado
6. **Purchase**: Pedido finalizado
7. **Search**: Busca realizada
8. **CompleteRegistration**: Preços liberados

### Eventos Customizados
1. **WhatsAppSubmitted**: Detalhes da captura
2. **SpecialPriceActivated**: Preço especial atingido
3. **CategoryFiltered**: Filtro aplicado
4. **OrderCompleted**: Detalhes completos do pedido
5. **TimeOnSite**: Engajamento
6. **KitViewed**: Interest em kits

### Parâmetros Importantes
- Sempre incluir `value` e `currency`
- `content_ids` para produtos
- `contents` array para múltiplos items
- Hash dados sensíveis (telefone)

### Públicos Sugeridos no Meta
1. Visitantes que não viraram Lead
2. Leads que não compraram
3. Compradores de alto valor
4. Interessados em preço especial
5. Abandonaram carrinho

```markdown
## 💰 Sistema de Preços Diferenciados

### Regras de Preço
1. Todo produto tem 2 preços:
   - **Preço Atacado**: Padrão para qualquer quantidade
   - **Preço Especial**: Ativado ao comprar X+ unidades DO MESMO produto
   
2. Quantidade mínima varia por produto (30, 50, 100, 200 unidades)

3. Aplicação automática:
   - Sistema calcula melhor preço automaticamente
   - Visual destaca quando preço especial está ativo
   - Mostra economia em reais e porcentagem

4. No carrinho:
   - Cada produto calcula seu preço independente
   - Sugestões inteligentes de quantidade para economia
   - Total geral considera todos os descontos

### Cálculo de Preços
```typescript
function calculatePrice(product: Product, quantity: number) {
  if (quantity >= product.specialPriceMinQty) {
    return {
      unitPrice: product.specialPrice,
      totalPrice: product.specialPrice * quantity,
      savings: (product.price - product.specialPrice) * quantity,
      isSpecialPrice: true
    }
  }
  
  return {
    unitPrice: product.price,
    totalPrice: product.price * quantity,
    savings: 0,
    isSpecialPrice: false
  }
}