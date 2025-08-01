# 🚀 Guia de Deploy - Catálogo Atacado Celular

## 📋 Pré-requisitos

- Node.js 18+ e npm 8+
- Conta na Vercel
- Banco PostgreSQL (Vercel Postgres ou externo)
- Conta Cloudinary para imagens
- Evolution API configurada para WhatsApp

## 🔧 Configuração das Variáveis de Ambiente

### 1. Variáveis Obrigatórias (.env.local)

```bash
# Database
DATABASE_URL="postgresql://usuario:senha@host:porta/database"

# NextAuth
NEXTAUTH_SECRET="seu-secret-muito-seguro-aqui"
NEXTAUTH_URL="https://seudominio.com" # ou http://localhost:3000 para dev

# Cloudinary
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="seu-api-secret"

# Evolution API
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua-api-key"
EVOLUTION_INSTANCE="sua-instancia"

# Meta Pixel (opcional)
NEXT_PUBLIC_META_PIXEL_ID="seu-pixel-id"

# Google Analytics (opcional)
NEXT_PUBLIC_GA_ID="UA-xxxxxxxx-x"
```

## 🚀 Deploy na Vercel

### Passo 1: Preparar o Repositório
```bash
# Clone o projeto
git clone https://github.com/seu-usuario/atacado-celular.git
cd atacado-celular

# Instalar dependências
npm install

# Verificar build local
npm run build
```

### Passo 2: Configurar Banco PostgreSQL

#### Opção A: Vercel Postgres
1. Acesse o dashboard da Vercel
2. Vá em "Storage" → "Create Database" → "Postgres"
3. Copie a `DATABASE_URL` gerada

#### Opção B: Banco Externo
- Neon.tech (recomendado)
- Supabase
- Railway
- PlanetScale

### Passo 3: Deploy na Vercel

#### Via CLI:
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Via Dashboard:
1. Acesse [vercel.com](https://vercel.com)
2. "New Project" → Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy

### Passo 4: Configurar Variáveis na Vercel
1. No dashboard do projeto → "Settings" → "Environment Variables"
2. Adicionar todas as variáveis do `.env.local`
3. Marcar todas para "Production", "Preview" e "Development"

### Passo 5: Executar Migrations

```bash
# Após deploy, executar migrations
npx prisma migrate deploy

# Seed inicial (opcional)
npx prisma db seed
```

## 🗄️ Configuração do Banco de Dados

### Migration e Seed
```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular banco com dados iniciais
npx prisma db seed
```

### Schema do Banco
O projeto utiliza Prisma ORM com as seguintes tabelas:
- `Admin` - Usuários administrativos
- `Category` - Categorias de produtos
- `Product` - Produtos do catálogo
- `Kit` - Kits de produtos
- `SiteConfig` - Configurações do site

## 🔌 APIs Externas

### 1. Evolution API (WhatsApp)
```bash
# Testar conexão
curl -X GET "https://sua-evolution-api.com/instance/connectionState/sua-instancia" \
  -H "apikey: sua-api-key"
```

### 2. Cloudinary (Imagens)
- Upload automático de imagens
- Otimização WebP/AVIF
- Redimensionamento responsivo

### 3. n8n Webhooks (Opcional)
```bash
# Webhook para leads
POST https://seu-n8n.com/webhook/leads

# Webhook para pedidos
POST https://seu-n8n.com/webhook/orders
```

## 🔐 Configurações de Segurança

### Headers de Segurança (já configurados)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- APIs limitadas por IP
- Proteção contra spam
- Cache inteligente

### Autenticação
- NextAuth com JWT
- Senhas criptografadas (bcrypt)
- Sessões seguras

## 📊 Monitoramento

### Performance
```bash
# Análise de bundle
npm run analyze

# Lighthouse audit
npm run lighthouse

# Performance audit
npm run perf
```

### Métricas Importantes
- **Bundle Size**: < 500KB (atual: ~336KB)
- **First Load**: < 2s
- **Lighthouse Score**: > 90
- **Core Web Vitals**: Todos verdes

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build e análise
npm run build
npm run analyze

# Testes de performance
npm run lighthouse
npm run perf

# Database
npm run db:migrate
npm run db:seed

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🛠️ Troubleshooting

### Problemas Comuns

#### 1. Erro de Build
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

#### 2. Erro de Database
```bash
# Reset database
npx prisma migrate reset
npx prisma db push
```

#### 3. Imagens não carregam
- Verificar configuração Cloudinary
- Checar domínios permitidos no next.config.ts

#### 4. WhatsApp não envia
- Testar Evolution API connection
- Verificar instância ativa
- Validar formato do número

### Logs e Debug

#### Vercel Logs
```bash
# Ver logs em tempo real
vercel logs seu-projeto-url

# Logs de função específica
vercel logs --function=api/contact
```

#### Local Debug
```bash
# Debug mode
DEBUG=* npm run dev

# Prisma debug
DEBUG="prisma*" npm run dev
```

## 📈 Otimizações Pós-Deploy

### 1. Performance
- Configurar CDN
- Otimizar imagens existentes
- Implementar service worker

### 2. SEO
- Sitemap automático (já configurado)
- Meta tags dinâmicas
- Schema.org markup

### 3. Analytics
- Meta Pixel configurado
- Google Analytics opcional
- Eventos personalizados

### 4. Backup
```bash
# Backup automático do banco
# Configurado via cron job na API
GET /api/cron/backup
```

## 🚨 Checklist Final

### Antes do Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local funcionando
- [ ] Testes passando
- [ ] Imagens otimizadas
- [ ] Rate limiting ativo

### Após Deploy
- [ ] Migrations executadas
- [ ] Admin criado no banco
- [ ] Evolution API conectada
- [ ] Cloudinary funcionando
- [ ] Lighthouse score > 90
- [ ] Todos os formulários testados

### Testes Críticos
- [ ] Fluxo completo de compra
- [ ] Admin criar/editar produto
- [ ] Upload de imagem
- [ ] WhatsApp recebendo mensagens
- [ ] Responsividade mobile
- [ ] Performance < 2s

## 📞 Suporte

### Documentação
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Vercel](https://vercel.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)

### Contato
Para suporte técnico, criar issue no repositório ou contatar o desenvolvedor.

---

## 🎯 Próximos Passos

1. **Monitoramento**: Configurar alertas de erro
2. **Analytics**: Implementar dashboard de métricas
3. **A/B Testing**: Testar variações da landing page
4. **SEO**: Otimizar para mecanismos de busca
5. **Mobile App**: Considerar PWA ou app nativo

**Status: ✅ Pronto para produção**