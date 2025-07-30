# 🔄 workflow.md - Estratégia de Uso com /clear

## 🎯 Filosofia: Contexto Limpo e Focado

### Por que usar /clear?

1. **Evita confusão** - Claude não mistura implementações antigas
1. **Melhora precisão** - Foco total na tarefa atual
1. **Economiza tokens** - Contexto menor = respostas mais rápidas
1. **Facilita debugging** - Isola problemas

## 📋 Workflow Padrão

### 1. Início de Tarefa

```bash
# Se é uma nova feature/bug:
/clear

# Carregue o contexto necessário:
/claude Claude.md        # Sempre carregue primeiro
/claude structure.md     # Se mexer em arquivos
/claude features.md      # Se implementar lógica
/claude components.md    # Se criar UI
/claude apis.md         # Se criar/usar APIs
```

### 2. Durante a Tarefa

```bash
# Implemente focado em UMA coisa
# Teste o que foi feito
# Se funcionar, commite

git add .
git commit -m "feat: adiciona modal WhatsApp"
```

### 3. Fim da Tarefa

```bash
# Tarefa completa e testada?
/clear

# Próxima tarefa: repita o processo
```

## 🎨 Combinações Recomendadas

### Para Landing Page

```bash
/clear
/claude Claude.md
/claude components.md
/claude features.md
```

### Para APIs

```bash
/clear
/claude Claude.md
/claude apis.md
/claude structure.md
```

### Para Admin

```bash
/clear
/claude Claude.md
/claude components.md
/claude apis.md
```

### Para Debug

```bash
/clear
/claude Claude.md
# Cole o erro direto no prompt
```

## 📝 Templates de Prompt Eficazes

### Criar Componente

```
Baseado nos padrões em components.md, crie o componente CartSummary que:
- Mostra total de itens (X/30 peças)
- Barra de progresso visual
- Lista produtos agrupados
- Botão finalizar (desabilitado se < 30)
```

### Implementar API

```
Seguindo o padrão em apis.md, crie a rota POST /api/order/complete que:
- Valida carrinho (mínimo 30 peças)
- Envia mensagem via Evolution API  
- Dispara webhook para n8n
- Retorna sucesso/erro padronizado
```

### Corrigir Bug

```
Erro no componente WhatsAppModal:
[cole erro]

O modal está em src/components/landing/WhatsAppModal.tsx
Corrija mantendo os padrões do projeto.
```

## 🚀 Exemplo Prático Completo

### Tarefa: Implementar Sistema de Carrinho

#### Passo 1: Preparar contexto

```bash
/clear
/claude Claude.md
/claude features.md
/claude components.md
```

#### Passo 2: Criar Context

```
Crie o CartContext em src/contexts/CartContext.tsx com:
- Estado: items, totalItems, totalPrice, isMinimumMet
- Ações: addItem, removeItem, updateQuantity, clearCart
- Persistência no localStorage
- Hook useCart para consumir
```

#### Passo 3: Testar e commitar

```bash
npm run dev
# Testa adicionar/remover items
git add .
git commit -m "feat: adiciona CartContext com persistência"
```

#### Passo 4: Próxima parte

```bash
/clear
/claude Claude.md
/claude components.md

"Crie o componente CartDrawer que usa o useCart e mostra:
- Lista de items do carrinho
- Botões +/- para quantidade  
- Total e contador X/30
- Botão finalizar pedido"
```

## 💡 Dicas Avançadas

### 1. Crie Aliases Bash

```bash
# ~/.bashrc ou ~/.zshrc
alias cc="code ."
alias cclear="/clear && /claude Claude.md"
alias ccomp="/claude components.md"
alias capi="/claude apis.md"
alias cfeat="/claude features.md"
```

### 2. Use Comentários Guia

```tsx
// NEXT: Implementar validação de 30 peças
// TODO: Adicionar loading state
// FIXME: Corrigir tipo TypeScript
```

### 3. Mantenha Log de Sessão

```markdown
## Log 2024-01-15

### Sessão 1 (10:00)
- [x] Landing page hero
- [x] Kit cards
- Próximo: Modal WhatsApp

### Sessão 2 (14:00)  
- [x] Modal WhatsApp
- [x] Validação regex
- Próximo: Integração tracking
```

### 4. Atualize os .md

Após implementar algo importante:

```bash
# Adicione no arquivo relevante
echo "### Nova Feature X" >> features.md
echo "- Implementada em: /path/to/file" >> features.md
```

## 🎯 Checklist de Produtividade

Antes de cada /clear:

- [ ] Código funcionando?
- [ ] Commit feito?
- [ ] Próxima tarefa clara?

Ao carregar contexto:

- [ ] Claude.md sempre primeiro
- [ ] Apenas .md necessários
- [ ] Prompt específico e claro

Durante implementação:

- [ ] Uma feature por vez
- [ ] Teste incrementalmente
- [ ] Commite frequentemente

## 🔥 Comando Matador

Para máxima eficiência, comece sempre com:

```bash
/clear && /claude Claude.md && echo "Próxima tarefa: [DESCREVA AQUI]"
```

Isso garante contexto limpo, informação essencial e foco total!