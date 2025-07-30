# 🔌 apis.md - Referência de APIs

## API Routes Internas

### POST /api/unlock-prices

```typescript
// Libera preços por WhatsApp
Request: {
  whatsapp: string // validado com regex
}

Response: {
  success: boolean
  expiresAt: number // timestamp
}

// Também envia webhook para n8n
```

### GET /api/products

```typescript
// Lista produtos ativos
Query params:
- category?: string
- search?: string  
- page?: number
- limit?: number

Response: {
  products: Product[]
  total: number
  hasMore: boolean
}
```

### POST /api/order/complete

```typescript
// Finaliza pedido
Request: {
  whatsapp: string
  items: CartItem[]
  sessionId: string
}

Response: {
  success: boolean
  orderId: string
  messageId?: string // Evolution API
}

// Envia WhatsApp + Webhook n8n
```

### POST /api/tracking

```typescript
// Registra eventos
Request: {
  sessionId: string
  eventType: string
  eventData?: any
  whatsapp?: string
}

Response: { success: boolean }
```

### POST /api/auth/login

```typescript
// Login admin
Request: {
  email: string
  password: string
}

Response: {
  success: boolean
  token?: string
}
```

## APIs Administrativas

### POST /api/admin/products

```typescript
// CRUD produtos
GET    /api/admin/products      // listar
POST   /api/admin/products      // criar
PUT    /api/admin/products/:id  // atualizar
DELETE /api/admin/products/:id  // deletar

// Todas precisam Authorization header
```

### POST /api/admin/kits

```typescript
// Gerenciar kits
Request: {
  name: string
  description?: string
  items: {
    productId: number
    quantity: number
  }[]
}
```

### POST /api/admin/upload

```typescript
// Upload Cloudinary
FormData: {
  file: File
  folder: string // "products" | "kits"
}

Response: {
  url: string
  publicId: string
}
```

## Integrações Externas

### Evolution API

```typescript
// Cliente configurado
import { evolutionApi } from '@/lib/evolution'

// Enviar mensagem
await evolutionApi.sendText({
  number: "5511999999999",
  message: "Seu pedido...",
  delayMessage: 2
})

// Headers automáticos:
{
  "apikey": process.env.EVOLUTION_API_KEY,
  "Content-Type": "application/json"
}
```

### n8n Webhooks

```typescript
// Webhook de WhatsApp capturado
POST ${N8N_WEBHOOK_URL}/whatsapp-captured
{
  event: "whatsapp_captured",
  whatsapp: string,
  source: "landing" | "catalog",
  timestamp: Date
}

// Webhook de pedido completo
POST ${N8N_WEBHOOK_URL}/order-completed
{
  event: "order_completed",
  customer: {
    whatsapp: string,
    sessionId: string
  },
  cart: CartItem[],
  total: number,
  tracking: TrackingEvent[]
}
```

### Cloudinary

```typescript
// Upload config
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload com otimização
const result = await cloudinary.uploader.upload(file, {
  folder: 'atacado/products',
  transformation: [
    { width: 800, crop: 'limit' },
    { quality: 'auto:eco' },
    { format: 'auto' }
  ]
})
```

## Rate Limiting

### Configuração Middleware

```typescript
// middleware.ts
const rateLimits = {
  '/api/unlock-prices': {
    window: 15 * 60 * 1000, // 15 min
    max: 5 // tentativas
  },
  '/api/order/complete': {
    window: 60 * 1000, // 1 min
    max: 10
  },
  '/api/admin/*': {
    window: 60 * 1000,
    max: 100
  }
}
```

## Padrões de Resposta

### Sucesso

```typescript
return Response.json({
  success: true,
  data: result,
  message?: "Opcional"
}, { status: 200 })
```

### Erro

```typescript
return Response.json({
  success: false,
  error: {
    code: "INVALID_WHATSAPP",
    message: "WhatsApp inválido"
  }
}, { status: 400 })
```

### Validação com Zod

```typescript
import { z } from 'zod'

const schema = z.object({
  whatsapp: z.string().regex(WHATSAPP_REGEX),
  items: z.array(z.object({
    productId: z.number(),
    quantity: z.number().min(1)
  }))
})

const validated = schema.parse(body)
```