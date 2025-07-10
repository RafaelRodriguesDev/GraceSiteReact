# Configuração do Supabase - Grace Site React

## Estrutura do Banco de Dados

### Tabela `propostas`

A tabela `propostas` foi criada para armazenar propostas de serviços fotográficos com upload de arquivos PDF.

#### Estrutura da Tabela

```sql
CREATE TABLE propostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  tipo_evento VARCHAR(100) NOT NULL,
  data_evento DATE NOT NULL,
  local_evento TEXT,
  descricao TEXT,
  arquivo_url TEXT, -- URL do arquivo PDF no Supabase Storage
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Correções Implementadas

1. **Campo `arquivo_url`**: O campo correto na tabela é `arquivo_url` (string) e não `arquivo` (File object)
2. **Storage Bucket**: Criado bucket `propostas` para armazenar arquivos PDF
3. **Políticas de Segurança**: Configuradas políticas RLS para upload, leitura, atualização e exclusão

## Storage Configuration

### Bucket `propostas`

- **Nome**: `propostas`
- **Público**: Sim (para leitura)
- **Limite de tamanho**: 100MB
- **Tipos MIME permitidos**: `application/pdf`

### Políticas de Segurança

1. **Upload**: Usuários autenticados podem fazer upload
2. **Leitura**: Arquivos são públicos para leitura
3. **Atualização**: Usuários autenticados podem atualizar
4. **Exclusão**: Usuários autenticados podem deletar

## Migrações

### Migração Unificada

- `20250224000000_create_propostas_table.sql` - Migração completa que inclui:
  - Criação da tabela propostas
  - Configuração do storage bucket
  - Políticas de segurança (RLS)
  - Dados de exemplo

### Como Aplicar a Migração

#### Via Dashboard Supabase (Recomendado)
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Execute o conteúdo do arquivo `20250224000000_create_propostas_table.sql`

### 2. Execute a migração unificada:

#### Migração: `20250224000000_create_propostas_table.sql`

```sql
-- Migração completa para sistema de propostas
-- Criação da tabela propostas + configuração do storage

-- 1. Criação da tabela propostas
CREATE TABLE IF NOT EXISTS propostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  -- ... resto da estrutura
);

-- 2. Configuração do storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propostas',
  'propostas',
  true,
  104857600, -- 100MB
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de segurança
-- (Execute o conteúdo completo do arquivo)
```

#### Via CLI (se disponível)
```bash
# Aplicar todas as migrações pendentes
supabase db push

# Ou aplicar uma migração específica
supabase migration up
```

## Configuração do Frontend

### Service Layer

O `PropostasService` foi configurado para:

1. **Upload de Arquivos**: Método `uploadArquivo()` para enviar PDFs ao storage
2. **CRUD Operations**: Métodos estáticos para criar, ler, atualizar e deletar propostas
3. **Integração**: Uso correto do campo `arquivo_url` em vez de `arquivo`

### Validações

- **Tamanho do arquivo**: Máximo 100MB
- **Tipo de arquivo**: Apenas PDFs
- **Campos obrigatórios**: Nome, email, tipo de evento, data do evento

## Troubleshooting

### Erro: "Could not find the 'arquivo' column"

**Causa**: O código estava tentando inserir um campo `arquivo` que não existe na tabela.

**Solução**: 
1. Usar o campo correto `arquivo_url`
2. Fazer upload do arquivo primeiro para o storage
3. Inserir a URL retornada na tabela

### Erro: "propostasService.createProposta is not a function"

**Causa**: Tentativa de instanciar uma classe com métodos estáticos.

**Solução**: Usar os métodos estáticos diretamente: `PropostasService.createProposta()`

## Comandos Úteis

```bash
# Verificar status do Supabase
supabase status

# Resetar banco de dados local
supabase db reset

# Gerar tipos TypeScript
supabase gen types typescript --local > src/types/supabase.ts

# Criar nova migração
supabase migration new nome_da_migracao
```

## Estrutura de Arquivos

```
supabase/
├── migrations/
│   ├── 20250224000000_create_propostas_table.sql
│   └── 20250101000000_fix_propostas_storage.sql
└── README.md (este arquivo)
```

## Próximos Passos

1. Aplicar as migrações no ambiente de produção
2. Configurar backup automático do storage
3. Implementar logs de auditoria para propostas
4. Adicionar validação de vírus para uploads