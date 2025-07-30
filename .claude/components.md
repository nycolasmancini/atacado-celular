# components-specs.md - Especificações de Componentes

## 🎨 Componentes Base (UI)

### Button

```tsx
<Button 
  variant="primary|secondary|outline" 
  size="sm|md|lg"
  loading={boolean}
  disabled={boolean}
  fullWidth={boolean}
/>
```

### Input

```tsx
<Input
  type="text|email|tel"
  mask="(99) 99999-9999"
  error="mensagem erro"
  icon={ReactNode}
/>
```

### Modal

```tsx
<Modal
  isOpen={boolean}
  onClose={() => void}
  title="Título"
  size="sm|md|lg"
/>
```

## 📱 Componentes Específicos

### WhatsAppModal

- Auto-abre se !pricesUnlocked
- Validação regex: `/^(\+?55\s?)?(\(?\d{2}\)?)\s?\d{4,5}-?\d{4}$/`
- Salva localStorage: `prices_unlocked` e `unlock_expires`
- Envia webhook n8n
- Loading state
- Toast sucesso/erro

### ProductCard

```tsx
// Props
{
  product: Product
  pricesUnlocked: boolean
  onAddToCart: (product) => void
}

// Estados
- Preço bloqueado: "Libere para ver preço"
- Preço liberado: "R$ X,XX"
- Hover: scale(1.05)
- Loading: skeleton
```

### CartSummary

```tsx
// Elementos
- Contador: "X/30 peças (mínimo)"
- ProgressBar: width baseado em %
- Lista items agrupados
- Total: R$ X,XX
- Botão finalizar (disabled < 30)
```

### KitCard

```tsx
// Props
{
  kit: Kit & { items: KitItem[] }
  pricesUnlocked: boolean
}

// Cálculo preço
const total = kit.items.reduce((sum, item) => 
  sum + (item.product.price * item.quantity), 0
)

// Visual
- Gradiente baseado em colorTheme
- Lista produtos inclusos
- Badge "Mais Vendido" se aplicável
```

## 🎨 Padrões Visuais

### Cores por Contexto

```css
/* Landing */
.landing { @apply bg-gradient-to-br from-purple-600 to-pink-600 }

/* Catálogo */
.catalog { @apply bg-orange-500 hover:bg-orange-600 }

/* Admin */
.admin { @apply bg-gray-100 text-gray-900 }
```

### Estados

```css
/* Loading */
.loading { @apply animate-pulse opacity-50 }

/* Disabled */
.disabled { @apply opacity-50 cursor-not-allowed }

/* Error */
.error { @apply border-red-500 text-red-600 }
```

### Responsivo

```css
/* Mobile First */
.container { @apply px-4 md:px-6 lg:px-8 }
.grid { @apply grid-cols-1 md:grid-cols-2 lg:grid-cols-3 }
.text { @apply text-sm md:text-base }
```