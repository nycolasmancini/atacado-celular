# Configuração do Cloudinary

## 1. Criar conta no Cloudinary
1. Acesse https://cloudinary.com
2. Crie uma conta gratuita
3. Acesse o Dashboard

## 2. Obter credenciais
No Dashboard do Cloudinary, você encontrará:
- **Cloud Name**: Nome da sua nuvem
- **API Key**: Sua chave de API  
- **API Secret**: Sua chave secreta

## 3. Configurar variáveis de ambiente
Adicione no arquivo `.env.local`:

```env
CLOUDINARY_CLOUD_NAME="seu-cloud-name"
CLOUDINARY_API_KEY="sua-api-key"
CLOUDINARY_API_SECRET="sua-api-secret"
```

## 4. Usar o upload
Após configurar as variáveis, o upload funcionará automaticamente na página admin/produtos.

### Recursos implementados:
- ✅ Upload por clique ou drag & drop
- ✅ Validação de tipo (apenas imagens)
- ✅ Validação de tamanho (máx 5MB)
- ✅ Redimensionamento automático para 800x800px
- ✅ Preview da imagem
- ✅ Opção de remover/alterar imagem
- ✅ Loading state durante upload

### Estrutura de pastas no Cloudinary:
- `atacado-celular/produtos/` - Imagens de produtos