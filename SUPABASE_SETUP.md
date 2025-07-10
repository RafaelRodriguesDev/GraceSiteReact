# Configuração do Supabase CLI - Grace Site React

## Instalação do Supabase CLI

### Opção 1: Instalação via npm (Recomendado)

```bash
npm install -g supabase
```

### Opção 2: Instalação via Chocolatey (Windows)

```bash
choco install supabase
```

### Opção 3: Download direto

Baixe o executável em: https://github.com/supabase/cli/releases

## Configuração Inicial

### 1. Login no Supabase

```bash
supabase login
```

### 2. Inicializar o projeto (se necessário)

```bash
supabase init
```

### 3. Conectar ao projeto remoto

```bash
supabase link --project-ref SEU_PROJECT_REF
```

## Aplicar Migrações

### Aplicar todas as migrações pendentes

```bash
supabase db push
```

### Aplicar migração específica

```bash
supabase migration up --file 20250101000000_fix_propostas_storage.sql
```

### Verificar status das migrações

```bash
supabase migration list
```

## Comandos Importantes

### Verificar status do projeto

```bash
supabase status
```

### Gerar tipos TypeScript

```bash
supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/supabase.ts
```

### Resetar banco local (desenvolvimento)

```bash
supabase db reset
```

### Criar nova migração

```bash
supabase migration new nome_da_migracao
```

## Configuração Manual (Alternativa)

Se não conseguir instalar o CLI, você pode aplicar as migrações manualmente:

### 1. Acesse o Dashboard do Supabase

- Vá para https://supabase.com/dashboard
- Selecione seu projeto
- Vá para "SQL Editor"

### 2. Execute as migrações na ordem:

#### Primeira migração: `20250224000000_create_propostas_table.sql`

```sql
-- Conteúdo da migração de criação da tabela
-- (Execute o conteúdo do arquivo de migração)
```

#### Segunda migração: `20250101000000_fix_propostas_storage.sql`

```sql
-- Criar bucket de storage para propostas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propostas',
  'propostas',
  true,
  104857600, -- 100MB
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de segurança
-- (Execute o resto do conteúdo da migração)
```

### 3. Verificar Storage

- Vá para "Storage" no dashboard
- Verifique se o bucket "propostas" foi criado
- Confirme as políticas de segurança

## Troubleshooting

### Erro: "supabase command not found"

**Solução**: Instale o Supabase CLI usando uma das opções acima.

### Erro: "Project not linked"

**Solução**: Execute `supabase link --project-ref SEU_PROJECT_REF`

### Erro: "Migration already applied"

**Solução**: Normal, a migração já foi aplicada anteriormente.

## Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## Scripts NPM Sugeridos

Adicione ao `package.json`:

```json
{
  "scripts": {
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:push": "supabase db push",
    "supabase:types": "supabase gen types typescript --local > src/types/supabase.ts"
  }
}
```

## Status das Correções

✅ **Migração de storage criada**: `20250101000000_fix_propostas_storage.sql`
✅ **README documentado**: Estrutura e configurações explicadas
✅ **Service corrigido**: `PropostasService` usando métodos estáticos
✅ **Upload implementado**: Integração com Supabase Storage
✅ **Validações atualizadas**: Limite de 100MB para PDFs

⚠️ **Pendente**: Aplicar migrações no banco de dados (requer Supabase CLI)