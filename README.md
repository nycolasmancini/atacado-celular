# 📱 Atacado Celular - E-commerce Platform

Plataforma de e-commerce otimizada para vendas de celulares e acessórios no atacado, com sistema de gestão completo e integração WhatsApp.

## 🚀 Tecnologias

### Frontend & Backend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **NextAuth.js** - Autenticação

### Banco de Dados
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados (produção)
- **SQLite** - Banco de dados (desenvolvimento)

### Integrações
- **Cloudinary** - Upload e otimização de imagens
- **Meta Pixel** - Tracking de conversões
- **Evolution API** - WhatsApp Business
- **Web Vitals** - Monitoramento de performance

## 📋 Pré-requisitos

- Node.js >= 18.0.0
- npm >= 8.0.0
- Banco PostgreSQL (para produção)

## 🛠️ Instalação Local

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd atacado-celular
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações (veja seção de variáveis abaixo).

4. **Configure o banco de dados**
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrations
npx prisma migrate dev

# Popular banco com dados iniciais
npm run db:seed
```

5. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse `http://localhost:3000` no seu navegador.

## 🌐 Variáveis de Ambiente

### Obrigatórias para produção:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL do banco PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | URL base da aplicação | `https://seu-dominio.vercel.app` |
| `NEXTAUTH_SECRET` | Chave secreta JWT | Use `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Nome do cloud Cloudinary | `seu-cloud-name` |
| `CLOUDINARY_API_KEY` | API Key Cloudinary | |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary | |

### Opcionais:

- `NEXT_PUBLIC_META_PIXEL_ID` - ID do Meta Pixel
- `EVOLUTION_API_URL` - URL da Evolution API
- `EVOLUTION_API_KEY` - Chave da Evolution API

## 🚀 Deploy no Vercel

### 1. Preparação
```bash
# Teste o build local
npm run build

# Execute testes
npm run lint
```

### 2. Configuração no Vercel

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no dashboard
3. O deploy será automático a cada push

### 3. Configuração do banco
Para produção, recomendamos:
- **Neon** (PostgreSQL serverless)
- **PlanetScale** (MySQL serverless) 
- **Supabase** (PostgreSQL com mais recursos)

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (public)/          # Rotas públicas
│   ├── admin/             # Painel administrativo
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── admin/            # Componentes do admin
│   ├── cart/             # Carrinho de compras
│   ├── catalog/          # Catálogo de produtos
│   └── ui/               # Componentes base
├── lib/                  # Utilitários e configurações
├── hooks/                # Custom hooks
└── contexts/             # React contexts

prisma/
├── schema.prisma         # Schema do banco
├── migrations/           # Migrations do banco
└── seed.ts              # Script de seed
```

## 🔧 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Verificar problemas no código |
| `npm run postinstall` | Gerar cliente Prisma |
| `npm run db:migrate` | Executar migrations |
| `npm run db:seed` | Popular banco com dados |

## 🔐 Funcionalidades

### 🛍️ E-commerce
- Catálogo de produtos com filtros
- Carrinho de compras inteligente
- Sistema de preços no atacado
- Cálculo automático de descontos

### 📊 Painel Administrativo
- Gestão de produtos e categorias
- Análise de conversões
- Relatórios de vendas
- Upload de imagens

### 📱 Integrações
- WhatsApp Business automatizado
- Tracking Meta Pixel
- Otimização de imagens
- Analytics avançados

## 🎯 Performance

- **Lighthouse Score**: 95+ 
- **Core Web Vitals**: Otimizado
- **Bundle Size**: Otimizado com tree-shaking
- **Images**: Lazy loading + WebP

## 🔒 Segurança

- Autenticação segura com NextAuth.js
- Validação de dados com Zod
- Rate limiting nas APIs
- Sanitização de uploads

## 📈 Monitoramento

- Web Vitals automático
- Error tracking
- Performance monitoring
- Conversion tracking

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](link-do-repositorio/issues)
- Entre em contato: [seu-email@exemplo.com]

---

Desenvolvido com ❤️ para otimizar vendas no atacado
