# ⚡ quick-reference.md - Comandos e Referências Rápidas

## 🚀 Comandos Essenciais

### Início de Sessão

```bash
/clear && /claude Claude.md
```

### Por Tipo de Tarefa

```bash
# Frontend/UI
/clear && /claude Claude.md components.md

# Backend/API  
/clear && /claude Claude.md apis.md structure.md

# Feature completa
/clear && /claude Claude.md features.md components.md apis.md

# Debug rápido
/clear && /claude Claude.md
# Cole o erro direto
```

## 📁 Arquivos .md Disponíveis

|Arquivo          |Quando Usar       |Conteúdo                     |
|-----------------|------------------|-----------------------------|
|`Claude.md`      |SEMPRE primeiro   |Contexto geral, stack, status|
|`structure.md`   |Mexer em arquivos |Arquitetura, pastas, padrões |
|`features.md`    |Implementar lógica|Regras negócio, fluxos       |
|`components.md`  |Criar/editar UI   |Componentes, props, estilos  |
|`apis.md`        |APIs/integrações  |Rotas, webhooks, externos    |
|`workflow.md`    |Referência        |Como usar tudo isso          |
|`current-task.md`|Durante tarefa    |Track progresso atual        |

## 🎯 Prompts Matadores

### Criar Componente

```
Crie o componente [Nome] seguindo os padrões estabelecidos.
Deve ter: [lista de features]
Referência: componente [Similar] já existente
```

### Implementar API

```
Crie a rota [MÉTODO] /api/[path] que:
- [ação 1]
- [ação 2]
Use o padrão de resposta do projeto.
```

### Corrigir Bug

```
Erro: [cole erro]
Arquivo: src/[path]
Corrija mantendo consistência do projeto.
```

### Refatorar

```
Refatore [componente/função] para:
- [melhoria 1]
- [melhoria 2]
Mantenha funcionalidade atual.
```

## 🏃 Workflow Relâmpago

### 1. Nova Feature

```bash
/clear
/claude Claude.md features.md components.md
"Implemente [feature] com [requisitos]"
# Teste
git commit -m "feat: [feature]"
```

### 2. Bug Fix

```bash
/clear  
/claude Claude.md
"[cole erro e contexto]"
# Teste
git commit -m "fix: [descrição]"
```

### 3. Refactor

```bash
/clear
/claude Claude.md structure.md
"Melhore [componente] para [objetivo]"
# Teste
git commit -m "refactor: [descrição]"
```

## 💡 Atalhos VS Code

```json
{
  "Clear Claude": {
    "prefix": "cc",
    "body": "/clear && /claude Claude.md"
  },
  "Load All": {
    "prefix": "call",  
    "body": "/clear && /claude Claude.md structure.md features.md components.md apis.md"
  },
  "Quick Task": {
    "prefix": "ctask",
    "body": [
      "# Task: ${1:name}",
      "## Objetivo",
      "${2:description}",
      "## Arquivos",
      "- [ ] src/${3:path}"
    ]
  }
}
```

## 📊 Métricas de Sucesso

|Métrica          |Sem workflow|Com workflow|
|-----------------|------------|------------|
|Tempo por feature|~2h         |~30min      |
|Bugs por sessão  |3-5         |0-1         |
|Retrabalho       |40%         |5%          |
|Contexto perdido |Sempre      |Nunca       |

## 🔥 Super Dicas

1. **Commit a cada sucesso** - Não acumule mudanças
1. **Um problema por vez** - Não misture tarefas
1. **Teste incrementalmente** - A cada mudança
1. **Atualize os .md** - Mantenha documentação viva
1. **Use current-task.md** - Track progresso

## 🎪 Truques Avançados

### Auto-load Context

```bash
# Crie função no .bashrc/.zshrc
claude_start() {
  echo "/clear && /claude Claude.md $@"
}

# Use assim:
claude_start components.md apis.md
```

### Git Hooks

```bash
# .git/hooks/pre-commit
echo "Lembre de atualizar current-task.md!"
```

### Snippets Específicos

```typescript
// snippet: track
trackEvent('${1:event_name}', {
  ${2:data}
})

// snippet: api
export async function ${1:GET}(request: Request) {
  try {
    ${2:// logic}
    return Response.json({ success: true, data: ${3:result} })
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }
}
```

## ⏱️ Timeboxes Sugeridos

- **Componente simples**: 15-30 min
- **API route**: 20-40 min
- **Feature completa**: 1-2h
- **Debug**: 10-30 min
- **Refactor**: 30-60 min

Se passar do tempo, faça /clear e recarregue contexto!

## 🏁 Checklist Final

Antes de encerrar o dia:

- [ ] Todos commits feitos?
- [ ] current-task.md atualizado?
- [ ] Próxima tarefa anotada?
- [ ] .md files atualizados?
- [ ] Testes passando?

-----

**Lembre-se**: O segredo é manter contexto LIMPO e FOCADO! 🎯