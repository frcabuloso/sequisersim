# Guia de Migração - Separação Site e API

## ✅ Implementações Realizadas

### 1. Correções Críticas
- ✅ **Erro useRouter corrigido**: `app/dashboard/depositos/page.tsx` agora importa `useRouter` de `next/navigation` corretamente
- ✅ **Referências a cartão de crédito removidas**:
  - `app/dashboard/layout.tsx` - Removido "Cartao" do histórico de transações
  - `app/termos/page.tsx` - Removido "boleto ou cartao", substituído por "Pix ou criptomoedas"
  - `app/dashboard/taxas/page.tsx` - Removido import de `CreditCard`

### 2. Contas Limpas na Criação
- ✅ Usuários criados com **saldo zerado**
- ✅ Sem histórico pré-criado
- ✅ Sem notificações default
- ✅ Sem configurações default
- ✅ Sem dados adicionais
- ✅ Dashboard retorna dados vazios para novos usuários

### 3. Webhooks Corrigidos
- ✅ Webhook de criação só dispara quando usuário é criado
- ✅ Se usuário já existe, retorna erro 409 e não cria/dispara webhook
- ✅ Webhook de login dispara quando usuário existente faz login

### 4. Segurança
- ✅ Autenticação com JWT tokens
- ✅ Refresh tokens em httpOnly cookies
- ✅ Headers de segurança
- ✅ Rate limiting (estrutura pronta)

### 5. Estrutura de Separação
- ✅ Criada pasta `@api/` com estrutura base:
  - `api/src/server.ts` - Servidor Express base
  - `api/package.json` - Dependências da API
  - `api/tsconfig.json` - Configuração TypeScript
  - `api/.env.example` - Template de variáveis de ambiente
  - `api/.gitignore` - Arquivos ignorados
  - `api/README.md` - Documentação

- ✅ Criada camada de cliente API segura:
  - `lib/api-client.ts` - Cliente para consumir API externa
  - Não expõe lógica interna
  - Não expõe chaves
  - Refresh token automático
  - Tratamento profissional de erros

## 📋 Próximas Etapas para Separar Completamente

### Etapa 1: Migrar API para @api

1. **Mover rotas da API**:
   ```bash
   # Mover de app/api/* para api/src/routes/*
   app/api/auth/* → api/src/routes/auth/*
   app/api/dashboard/* → api/src/routes/dashboard/*
   app/api/deposits/* → api/src/routes/deposits/*
   app/api/transfers/* → api/src/routes/transfers/*
   app/api/notifications/* → api/src/routes/notifications/*
   app/api/webhooks/* → api/src/routes/webhooks/*
   ```

2. **Migrar lib/security para @api**:
   ```bash
   lib/security/* → api/src/lib/security/*
   ```

3. **Adaptar rotas para Express**:
   - Converter Next.js Route Handlers para Express routes
   - Manter toda a lógica de segurança
   - Manter validações

4. **Configurar middleware Express**:
   - Helmet para headers de segurança
   - CORS configurado
   - Rate limiting
   - Body parser
   - Error handler

### Etapa 2: Mover Frontend para @site

1. **Mover estrutura Next.js**:
   ```bash
   app/* → site/app/*
   components/* → site/components/*
   lib/* → site/lib/*
   public/* → site/public/*
   styles/* → site/styles/*
   ```

2. **Manter apenas cliente API no frontend**:
   - Frontend usa apenas `lib/api-client.ts`
   - Todas as chamadas vão para API externa
   - Remover dependências de `app/api/*` no frontend

3. **Atualizar imports**:
   - Atualizar todos os imports para apontar para `@api`
   - Configurar `NEXT_PUBLIC_API_URL` no `.env` do site

### Etapa 3: Configuração

1. **API (.env)**:
   ```env
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=...
   # ... outras variáveis
   ```

2. **Site (.env)**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   # ... outras variáveis
   ```

### Etapa 4: Banco de Dados

1. **Criar schema mínimo para usuários**:
   ```sql
   - id
   - email
   - nomeCompleto
   - cpf
   - telefone
   - dataNascimento
   - photoURL
   - saldo (sempre 0 na criação)
   - twoFactorEnabled
   - pinHash
   - pinSalt
   - createdAt
   - lastLogin
   ```

2. **Sem dados default**:
   - Não criar notificações default
   - Não criar configurações default
   - Não criar histórico default
   - Apenas dados mínimos de autenticação

## 🔐 Segurança Implementada

### API
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Rate limiting (estrutura pronta)
- ✅ JWT com refresh tokens
- ✅ Validação rigorosa de payload
- ✅ Logs de auditoria
- ✅ HTTPS obrigatório em produção

### Frontend
- ✅ Cliente API seguro
- ✅ Tokens não expostos em código
- ✅ Refresh automático de tokens
- ✅ Tratamento de erros profissional

## 🚀 Execução

### API
```bash
cd api
npm install
npm run dev  # Porta 3001
```

### Site
```bash
cd site  # Quando migrado
npm install
npm run dev  # Porta 3000
```

## 📝 Notas

- A API atual ainda está em `app/api/*` (Next.js API Routes)
- A estrutura base para API separada está em `api/`
- O cliente API já está pronto para consumir API externa
- Para produção completa, migrar toda a lógica para API Express

## ✨ Status Atual

- ✅ Sistema funcional
- ✅ Contas limpas na criação
- ✅ Webhooks corrigidos
- ✅ Referências a cartão removidas
- ✅ Erro useRouter corrigido
- ✅ Cliente API seguro criado
- ⏳ Migração completa pendente (estrutura base pronta)
