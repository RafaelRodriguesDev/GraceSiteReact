# Comandos Supabase CLI - Guia Completo

Este documento contém todos os comandos `npx supabase` utilizados no projeto, com explicações detalhadas sobre quando e como usar cada um.

## 🔐 Autenticação

### `npx supabase login`
**Função:** Autentica o usuário no Supabase CLI
**Quando usar:** Primeira vez configurando o projeto ou quando o token de acesso expira
**Exemplo:**
```bash
npx supabase login
```
**O que faz:**
- Abre o navegador para login na conta Supabase
- Gera um token de acesso local
- Permite acesso aos projetos da conta

---

## 🔗 Configuração do Projeto

### `npx supabase link`
**Função:** Conecta o projeto local com um projeto remoto no Supabase
**Quando usar:** Após o login, para vincular com um projeto específico
**Exemplo:**
```bash
npx supabase link --project-ref iasmacaacbirfkjvgpda
```
**O que faz:**
- Estabelece conexão entre código local e projeto remoto
- Salva a referência do projeto em `.temp/project-ref`
- Permite sincronização de migrations e configurações

**Parâmetros:**
- `--project-ref`: ID único do projeto Supabase

---

## 📊 Gerenciamento de Banco de Dados

### `npx supabase db push`
**Função:** Aplica todas as migrations locais no banco de dados remoto
**Quando usar:** Após criar/modificar migrations ou quando o banco está desatualizado
**Exemplo:**
```bash
npx supabase db push
```
**O que faz:**
- Executa migrations na ordem cronológica
- Atualiza o schema do banco remoto
- Sincroniza estrutura local com remota

### `npx supabase db diff`
**Função:** Compara o schema local com o remoto e mostra diferenças
**Quando usar:** Para verificar se há diferenças entre local e remoto
**Exemplo:**
```bash
npx supabase db diff
```
**O que faz:**
- Analisa diferenças estruturais
- Mostra SQL necessário para sincronizar
- Útil para debug de problemas de schema

### `npx supabase db reset`
**Função:** Reseta o banco local e reaplica todas as migrations
**Quando usar:** Para limpar dados de teste ou resolver conflitos
**Exemplo:**
```bash
npx supabase db reset
```
**⚠️ Cuidado:** Remove todos os dados do banco local

---

## 🔄 Migrations

### `npx supabase migration new`
**Função:** Cria uma nova migration com timestamp
**Quando usar:** Para adicionar novas mudanças no schema
**Exemplo:**
```bash
npx supabase migration new add_preferred_columns
```
**O que faz:**
- Cria arquivo SQL com timestamp único
- Adiciona na pasta `supabase/migrations/`
- Permite versionamento de mudanças no banco

### `npx supabase migration list`
**Função:** Lista todas as migrations e seu status
**Quando usar:** Para verificar quais migrations foram aplicadas
**Exemplo:**
```bash
npx supabase migration list
```
**O que mostra:**
- ✅ Migrations aplicadas
- ❌ Migrations pendentes
- Timestamps e nomes dos arquivos

---

## 🚀 Desenvolvimento Local

### `npx supabase start`
**Função:** Inicia ambiente Supabase local com Docker
**Quando usar:** Para desenvolvimento local sem afetar produção
**Exemplo:**
```bash
npx supabase start
```
**O que faz:**
- Inicia containers Docker (PostgreSQL, Auth, API, etc.)
- Cria banco local isolado
- Fornece URLs locais para desenvolvimento

### `npx supabase stop`
**Função:** Para todos os serviços locais do Supabase
**Quando usar:** Ao finalizar desenvolvimento local
**Exemplo:**
```bash
npx supabase stop
```

### `npx supabase status`
**Função:** Mostra status dos serviços locais
**Quando usar:** Para verificar se ambiente local está rodando
**Exemplo:**
```bash
npx supabase status
```
**O que mostra:**
- Status dos containers
- URLs dos serviços
- Portas utilizadas

---

## 🔧 Utilitários

### `npx supabase gen types typescript`
**Função:** Gera tipos TypeScript baseados no schema do banco
**Quando usar:** Após mudanças no schema para manter tipos atualizados
**Exemplo:**
```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```
**O que faz:**
- Analisa schema do banco
- Gera interfaces TypeScript
- Melhora type safety no código

### `npx supabase functions new`
**Função:** Cria uma nova Edge Function
**Quando usar:** Para adicionar lógica serverless
**Exemplo:**
```bash
npx supabase functions new my-function
```

### `npx supabase functions deploy`
**Função:** Faz deploy de Edge Functions
**Quando usar:** Para publicar funções serverless
**Exemplo:**
```bash
npx supabase functions deploy my-function
```

---

## 📋 Sequência Típica de Comandos

### Configuração Inicial
```bash
# 1. Login
npx supabase login

# 2. Vincular projeto
npx supabase link --project-ref iasmacaacbirfkjvgpda

# 3. Aplicar migrations
npx supabase db push
```

### Desenvolvimento com Mudanças no Schema
```bash
# 1. Criar nova migration
npx supabase migration new nome_da_mudanca

# 2. Editar arquivo SQL gerado
# 3. Aplicar no banco remoto
npx supabase db push

# 4. Verificar se aplicou corretamente
npx supabase migration list
```

### Desenvolvimento Local
```bash
# 1. Iniciar ambiente local
npx supabase start

# 2. Verificar status
npx supabase status

# 3. Desenvolver...

# 4. Parar ambiente
npx supabase stop
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find project ref"
**Solução:**
```bash
npx supabase link --project-ref iasmacaacbirfkjvgpda
```

### Erro: "Access token not provided"
**Solução:**
```bash
npx supabase login
```

### Erro: "Failed to connect to postgres"
**Soluções:**
1. Verificar se está usando projeto remoto (não local)
2. Verificar credenciais
3. Usar connection string direta se necessário

### Erro: "Docker not running"
**Solução:**
- Iniciar Docker Desktop
- Ou usar apenas comandos remotos (push, link, etc.)

---

## 📝 Notas Importantes

1. **Sempre fazer backup** antes de executar `db reset`
2. **Testar migrations localmente** antes de aplicar em produção
3. **Usar ambiente local** para desenvolvimento quando possível
4. **Manter migrations versionadas** no Git
5. **Verificar status** antes de fazer mudanças importantes

---

## 🔗 Informações do Projeto

- **Project Ref:** `iasmacaacbirfkjvgpda`
- **Region:** `us-east-1`
- **Connection String:** `postgresql://postgres.iasmacaacbirfkjvgpda:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

---

*Documento gerado para o projeto GraceSite - Sistema de Agendamento*