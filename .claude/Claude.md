# Claude.md - Contexto Base do Projeto

## 🎯 Projeto: Atacado Acessórios Celular

Site catálogo atacadista com conversão via WhatsApp. Landing (kits) → Captura WhatsApp → Libera preços → Pedido mínimo 30 peças.

## 🛠️ Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- NextAuth (admin)
- Cloudinary (imagens)
- Evolution API (WhatsApp)

## 📁 Estrutura Principal

```
src/
├── app/
│   ├── (public)/      # Layout laranja
│   ├── admin/         # Layout neutro
│   └── api/           # API routes
├── components/
├── contexts/
└── lib/
```

## 🔑 Regras Críticas

1. **WhatsApp**: Validar formato BR `(XX) XXXXX-XXXX`
1. **Preços**: Liberar por 7 dias no localStorage
1. **Pedido**: Mínimo 30 peças total
1. **Cores**: Landing roxo/rosa, Catálogo laranja, Admin neutro

## 📊 Status Atual

- [x] Projeto iniciado
- [x] Prisma configurado
- [ ] Landing page
- [ ] Sistema WhatsApp
- [ ] Catálogo
- [ ] Carrinho
- [ ] Admin

## 🚨 Decisões Tomadas

- App Router (não Pages)
- Context API para carrinho
- localStorage para preços
- Rate limiting nas APIs