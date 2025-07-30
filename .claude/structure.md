# 📁 structure.md - Arquitetura e Estrutura

## Arquitetura de Pastas

```
src/
├── app/                    # App Router Next.js 14
│   ├── (public)/          # Grupo com layout público
│   ├── admin/             # Grupo com layout admin  
│   └── api/               # API Routes
├── components/            
│   ├── ui/                # Componentes reutilizáveis
│   ├── landing/           # Específicos da landing
│   ├── catalog/           # Específicos do catálogo
│   └── admin/             # Específicos do admin
├── contexts/              # Context API providers
├── hooks/                 # Custom hooks
├── lib/                   # Utilitários e configs
├── types/                 # TypeScript types
└── utils/                 # Funções auxiliares
```

## Padrões de Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`formatPrice.ts`)
- **API Routes**: kebab-case (`/api/unlock-prices`)
- **Páginas**: kebab-case folders

## Imports Organizados

```typescript
// 1. React/Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Bibliotecas externas
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

// 3. Componentes internos
import { Button } from '@/components/ui/Button'

// 4. Utils/Types/Lib
import { formatWhatsApp } from '@/utils/format'
import type { Product } from '@/types'
```

## Convenções de Código

1. **Componentes**: Sempre funcionais com TypeScript
1. **Estado**: useState para local, Context para global
1. **Side Effects**: useEffect com cleanup sempre
1. **Formulários**: react-hook-form + zod
1. **Estilos**: Tailwind classes, sem CSS modules

## API Routes Pattern

```typescript
// app/api/[resource]/route.ts
export async function GET(request: Request) {
  // Validação
  // Lógica
  // Response
}

export async function POST(request: Request) {
  const body = await request.json()
  // Validação com zod
  // Processamento
  // Response padronizada
}
```