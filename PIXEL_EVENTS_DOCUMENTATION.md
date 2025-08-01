# 📊 Documentação de Eventos do Pixel - Dashboard de Conversões

Este documento detalha todos os eventos implementados no sistema de tracking para facilitar a criação de públicos personalizados no Meta Ads Manager.

## 🎯 Eventos Padrão do Meta Pixel

### PageView
**Disparado:** Automaticamente em cada carregamento de página
```javascript
// Parâmetros enviados
{
  page: "/catalogo",
  referrer: "https://google.com",
  timestamp: "2025-08-01T10:30:00Z"
}
```
**Uso para Públicos:** Visitantes do site nos últimos 30 dias

### ViewContent
**Disparado:** Quando usuário visualiza um produto
```javascript
// Parâmetros enviados
{
  content_type: "product",
  content_ids: ["123"],
  content_name: "iPhone 15 Pro Max",
  value: 299.90,
  currency: "BRL"
}
```
**Uso para Públicos:** Pessoas interessadas em produtos específicos

### Lead
**Disparado:** Quando usuário envia WhatsApp
```javascript
// Parâmetros enviados
{
  content_name: "WhatsApp Form",
  value: 0,
  lead_type: "contact_form"
}
```
**Uso para Públicos:** Leads qualificados para campanhas de remarketing

### Purchase
**Disparado:** Quando pedido é confirmado
```javascript
// Parâmetros enviados
{
  content_ids: ["123", "456"],
  value: 599.80,
  currency: "BRL",
  num_items: 2,
  order_id: "ORDER_123"
}
```
**Uso para Públicos:** Compradores para campanhas de upsell/cross-sell

### AddToCart
**Disparado:** Quando produto é adicionado ao carrinho
```javascript
// Parâmetros enviados
{
  content_ids: ["789"],
  content_type: "product",
  value: 149.90,
  currency: "BRL"
}
```
**Uso para Públicos:** Abandono de carrinho

### Search
**Disparado:** Quando usuário faz uma busca
```javascript
// Parâmetros enviados
{
  query: "iPhone 15",
  search_results: 12
}
```
**Uso para Públicos:** Interesse em categorias específicas

## 🔧 Eventos Customizados

### TimeOnSite
**Disparado:** Quando usuário passa tempo significativo no site
```javascript
trackTimeOnSite(durationSeconds, pagesViewed)
// Parâmetros enviados
{
  duration_seconds: 180,
  pages_viewed: 5,
  engagement_level: "high" // high/medium/low
}
```
**Uso para Públicos:** Usuários altamente engajados

### CartAbandoned
**Disparado:** Quando usuário sai sem finalizar compra
```javascript
trackCartAbandoned(cartValue, itemsCount, items)
// Parâmetros enviados
{
  value: 450.00,
  items_count: 3,
  currency: "BRL",
  content_ids: ["123", "456", "789"],
  content_names: ["iPhone", "Película", "Carregador"]
}
```
**Uso para Públicos:** Campanha de recuperação de carrinho

### KitViewed
**Disparado:** Quando usuário visualiza um kit de produtos
```javascript
trackKitViewed(kitName, kitValue, products)
// Parâmetros enviados
{
  kit_name: "Kit Proteção Premium",
  kit_value: 89.90,
  currency: "BRL",
  content_ids: ["123", "456"],
  num_items: 2
}
```
**Uso para Públicos:** Interesse em ofertas especiais

### CategoryInterest
**Disparado:** Quando usuário mostra interesse em categoria
```javascript
trackCategoryInterest(categoryName, timeSpent, productsViewed)
// Parâmetros enviados
{
  category_name: "Capinhas iPhone",
  time_spent_seconds: 120,
  products_viewed: 8,
  interest_level: "medium"
}
```
**Uso para Públicos:** Segmentação por categoria de produto

### ScrollDepth
**Disparado:** Em marcos de scroll (25%, 50%, 75%, 100%)
```javascript
trackScrollDepth(percentage, pagePath)
// Parâmetros enviados
{
  scroll_percentage: 75,
  page_path: "/catalogo",
  engagement_milestone: "75%"
}
```
**Uso para Públicos:** Usuários com alto engajamento de conteúdo

### ProductComparison
**Disparado:** Quando usuário compara produtos
```javascript
trackProductComparison(productIds, comparisonType)
// Parâmetros enviados
{
  content_ids: [123, 456],
  comparison_type: "side_by_side",
  num_products: 2
}
```
**Uso para Públicos:** Usuários indecisos que precisam de incentivo

### SpecialPriceInterest
**Disparado:** Quando usuário vê preço especial
```javascript
trackSpecialPriceInterest(productId, originalPrice, specialPrice)
// Parâmetros enviados
{
  content_id: 123,
  original_price: 199.90,
  special_price: 149.90,
  discount_percentage: 25,
  currency: "BRL"
}
```
**Uso para Públicos:** Usuários sensíveis a preço/promoções

### UserFeedback
**Disparado:** Quando usuário dá feedback
```javascript
trackUserFeedback(rating, feedback, context)
// Parâmetros enviados
{
  rating: 5,
  feedback_text: "Excelente atendimento",
  context: "service",
  satisfaction_level: "high"
}
```
**Uso para Públicos:** Clientes satisfeitos para testimonials

### CatalogDownload  
**Disparado:** Quando usuário baixa catálogo
```javascript
trackCatalogDownload(catalogType, source)
// Parâmetros enviados
{
  catalog_type: "Atacado",
  download_source: "landing_page",
  content_name: "Catálogo Atacado"
}
```
**Uso para Públicos:** Leads qualificados B2B

### NotificationPermission
**Disparado:** Quando usuário interage com notificações
```javascript
trackNotificationPermission(permission, context)
// Parâmetros enviados
{
  permission_status: "granted",
  request_context: "cart_abandonment",
  engagement_intent: "high"
}
```
**Uso para Públicos:** Usuários com alta intenção de compra

## 🎯 Criando Públicos Personalizados no Meta

### 1. Usuários Altamente Engajados
```
Condições:
- TimeOnSite.engagement_level = "high" OU
- ScrollDepth.scroll_percentage >= 75 OU
- CategoryInterest.interest_level = "high"
```

### 2. Abandono de Carrinho por Valor
```
Condições:
- CartAbandoned.value >= 200 nos últimos 3 dias
- NÃO Purchase nos últimos 3 dias
```

### 3. Interesse em Categoria Específica
```
Condições:
- ViewContent.content_name contém "iPhone" OU
- CategoryInterest.category_name = "iPhone" OU
- Search.query contém "iPhone"
```

### 4. Usuários Prontos para Comprar
```
Condições:
- SpecialPriceInterest nos últimos 7 dias E
- AddToCart nos últimos 3 dias E
- TimeOnSite.engagement_level = "high"
```

### 5. Leads Qualificados
```
Condições:
- Lead nos últimos 7 dias OU
- CatalogDownload nos últimos 14 dias OU
- UserFeedback.satisfaction_level = "high"
```

### 6. Comparadores (Indecisos)
```
Condições:
- ProductComparison nos últimos 7 dias E
- NÃO Purchase nos últimos 7 dias
```

## 📈 Otimizações de Campanha

### Para E-commerce
1. **Campanha de Recuperação:** Target = CartAbandoned + AddToCart
2. **Upsell/Cross-sell:** Target = Purchase (últimos 30 dias)
3. **Novos Clientes:** Exclude = Purchase (últimos 180 dias)

### Para Geração de Leads
1. **Remarketing:** Target = ViewContent + NÃO Lead
2. **Lookalike de Compradores:** Source = Purchase
3. **Lookalike de Leads:** Source = Lead

### Por Nível de Engajamento
1. **Alto Engajamento:** TimeOnSite.high + ScrollDepth ≥ 50%
2. **Médio Engajamento:** ViewContent + CategoryInterest
3. **Baixo Engajamento:** PageView apenas

## 🔄 Server-Side Tracking (Meta Conversions API)

Para maior precisão e contornar limitações de tracking client-side:

### Eventos Cruciais para Server-Side:
1. **Purchase** - Máxima precisão em vendas
2. **Lead** - Captura leads mesmo com adblockers  
3. **ViewContent** - Para produtos de alto valor
4. **PageView** - Para páginas de conversão

### Implementação:
```javascript
import { trackServerSidePurchase } from '@/lib/meta-conversions-api'

// Exemplo de uso
await trackServerSidePurchase(
  userData,
  purchaseData,
  eventSourceUrl,
  eventId
)
```

## 📋 Checklist de Implementação

- [x] Pixel base instalado
- [x] Eventos padrão configurados
- [x] Eventos customizados implementados
- [x] Dashboard de debug criado
- [x] Conversions API preparada
- [ ] Testes em produção
- [ ] Públicos personalizados criados
- [ ] Campanhas configuradas

## 🚀 Próximos Passos

1. **Validar Eventos:** Use o dashboard de debug para verificar se todos os eventos estão sendo disparados
2. **Criar Públicos:** Configure os públicos personalizados no Meta Ads Manager
3. **Testar Conversions API:** Implemente server-side tracking para eventos críticos
4. **Otimizar Campanhas:** Use os dados para criar campanhas mais eficazes
5. **Monitorar Performance:** Acompanhe métricas no dashboard de conversões

---

💡 **Dica:** Sempre teste os eventos usando as ferramentas de debug do Meta (Facebook Pixel Helper e Event Manager) antes de criar campanhas baseadas neles.