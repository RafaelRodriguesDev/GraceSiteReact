# Sistema de Propostas - Design e Implementação

## Visão Geral
Sistema completo para gerenciamento de propostas com área administrativa para manipulação e página pública com carrossel para visualização.

## Estrutura do Sistema

### 1. Área Administrativa (Dashboard)
- **Localização**: `/dashboard/propostas`
- **Funcionalidades**:
  - Listar todas as propostas
  - Adicionar nova proposta
  - Editar proposta existente
  - Excluir proposta
  - Ativar/Desativar proposta para exibição pública
  - Upload de arquivos PDF
  - Visualização de thumbnail

### 2. Página Pública
- **Localização**: `/propostas`
- **Funcionalidades**:
  - Carrossel com 3 propostas visíveis
  - Navegação esquerda/direita
  - Auto-play opcional
  - Responsivo para mobile
  - Download direto do PDF

## Estrutura de Dados

### Tabela: `propostas`
```sql
CREATE TABLE propostas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Componentes React

### 1. Área Administrativa

#### `PropostasAdmin.tsx`
- Lista de propostas em formato de cards
- Botões de ação (editar, excluir, ativar/desativar)
- Modal para adicionar/editar
- Upload de arquivos

#### `PropostaForm.tsx`
- Formulário para criar/editar proposta
- Upload de PDF
- Geração automática de thumbnail
- Validação de campos

#### `PropostaCard.tsx`
- Card individual para exibição na lista admin
- Preview do PDF
- Status ativo/inativo
- Ações rápidas

### 2. Página Pública

#### `PropostasPublic.tsx`
- Página principal com carrossel
- Título e descrição da seção
- Integração com o carrossel

#### `PropostasCarousel.tsx`
- Carrossel principal
- 3 itens visíveis
- Navegação com setas
- Indicadores de posição
- Responsivo

#### `PropostaSlide.tsx`
- Slide individual do carrossel
- Thumbnail da proposta
- Título e descrição
- Botão de download

## Design System

### Cores
- **Primária**: `gray-900` (títulos)
- **Secundária**: `gray-600` (textos)
- **Accent**: `blue-600` (botões e links)
- **Background**: `white` e `gray-50`
- **Borders**: `gray-200`

### Tipografia
- **Títulos**: `font-bold text-2xl`
- **Subtítulos**: `font-semibold text-lg`
- **Corpo**: `text-base`
- **Captions**: `text-sm text-gray-500`

### Espaçamento
- **Container**: `max-w-7xl mx-auto px-4`
- **Seções**: `py-16`
- **Cards**: `p-6`
- **Gaps**: `gap-6` para grids

## Funcionalidades do Carrossel

### Navegação
- Setas esquerda/direita
- Indicadores de posição (dots)
- Swipe em dispositivos touch
- Navegação por teclado (acessibilidade)

### Responsividade
- **Desktop**: 3 itens visíveis
- **Tablet**: 2 itens visíveis
- **Mobile**: 1 item visível

### Animações
- Transição suave entre slides
- Hover effects nos cards
- Loading states

## Estrutura de Arquivos

```
src/
├── pages/
│   ├── Propostas.tsx (página pública)
│   └── admin/
│       └── PropostasAdmin.tsx
├── components/
│   ├── propostas/
│   │   ├── PropostasCarousel.tsx
│   │   ├── PropostaSlide.tsx
│   │   ├── PropostaCard.tsx
│   │   └── PropostaForm.tsx
│   └── ui/
│       ├── Modal.tsx
│       └── FileUpload.tsx
├── services/
│   └── propostasService.ts
└── types/
    └── propostas.ts
```

## Serviços e API

### `propostasService.ts`
```typescript
// Funções para:
- getAllPropostas()
- getPropostasAtivas()
- createProposta()
- updateProposta()
- deleteProposta()
- uploadPDF()
- generateThumbnail()
```

## Integração com Supabase

### Storage
- Bucket para PDFs: `propostas-pdfs`
- Bucket para thumbnails: `propostas-thumbnails`
- Políticas de acesso público para leitura

### RLS (Row Level Security)
- Leitura pública para propostas ativas
- Escrita apenas para usuários autenticados (admin)

## Implementação por Fases

### Fase 1: Estrutura Base
1. Criar migração da tabela
2. Configurar storage no Supabase
3. Criar tipos TypeScript
4. Implementar serviços básicos

### Fase 2: Área Administrativa
1. Criar página admin
2. Implementar CRUD completo
3. Sistema de upload
4. Geração de thumbnails

### Fase 3: Página Pública
1. Criar página pública
2. Implementar carrossel
3. Responsividade
4. Animações e transições

### Fase 4: Melhorias
1. Otimizações de performance
2. Testes
3. Acessibilidade
4. SEO

## Considerações Técnicas

### Performance
- Lazy loading de PDFs
- Otimização de imagens
- Paginação na área admin
- Cache de thumbnails

### Acessibilidade
- ARIA labels
- Navegação por teclado
- Screen reader support
- Contraste adequado

### SEO
- Meta tags dinâmicas
- Structured data
- URLs amigáveis
- Sitemap atualizado

## Próximos Passos

1. **Criar migração da tabela propostas**
2. **Implementar área administrativa**
3. **Desenvolver página pública com carrossel**
4. **Adicionar rotas ao sistema**
5. **Testes e refinamentos**

Este documento serve como guia completo para implementação do sistema de propostas, garantindo uma experiência consistente tanto para administradores quanto para visitantes do site.