-- Migração completa para sistema de propostas
-- Criação da tabela propostas + configuração do storage

-- 1. Criação da tabela propostas
CREATE TABLE IF NOT EXISTS propostas (
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

-- 2. Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_propostas_ativo ON propostas(ativo);
CREATE INDEX IF NOT EXISTS idx_propostas_ordem ON propostas(ordem);
CREATE INDEX IF NOT EXISTS idx_propostas_created_at ON propostas(created_at);

-- 3. RLS (Row Level Security)
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança para a tabela propostas
DROP POLICY IF EXISTS "Propostas ativas são visíveis publicamente" ON propostas;
DROP POLICY IF EXISTS "Administradores podem gerenciar propostas" ON propostas;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar propostas" ON propostas;

-- Política para leitura pública de propostas ativas
CREATE POLICY "Propostas ativas são visíveis publicamente" ON propostas
  FOR SELECT USING (ativo = true);

-- Política para usuários autenticados poderem fazer tudo
CREATE POLICY "Usuários autenticados podem gerenciar propostas" ON propostas
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_propostas_updated_at ON propostas;
CREATE TRIGGER update_propostas_updated_at BEFORE UPDATE ON propostas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Criar bucket de storage para propostas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'propostas',
  'propostas',
  true,
  104857600, -- 100MB
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 7. Políticas de segurança para o storage
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload" ON storage.objects;
DROP POLICY IF EXISTS "Arquivos de propostas são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar arquivos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar arquivos" ON storage.objects;

-- Política para permitir upload de arquivos (usuários autenticados)
CREATE POLICY "Usuários autenticados podem fazer upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'propostas' AND 
    auth.role() = 'authenticated'
  );

-- Política para permitir leitura pública dos arquivos
CREATE POLICY "Arquivos de propostas são públicos" ON storage.objects
  FOR SELECT USING (bucket_id = 'propostas');

-- Política para permitir atualização de arquivos (usuários autenticados)
CREATE POLICY "Usuários autenticados podem atualizar arquivos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'propostas' AND 
    auth.role() = 'authenticated'
  );

-- Política para permitir exclusão de arquivos (usuários autenticados)
CREATE POLICY "Usuários autenticados podem deletar arquivos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'propostas' AND 
    auth.role() = 'authenticated'
  );

-- 8. Comentários explicativos
COMMENT ON COLUMN propostas.arquivo_url IS 'URL do arquivo PDF armazenado no Supabase Storage';
COMMENT ON TABLE propostas IS 'Tabela para armazenar propostas de serviços fotográficos com arquivos PDF';

-- 9. Inserir algumas propostas de exemplo (baseadas nos PDFs existentes)
INSERT INTO propostas (titulo, descricao, arquivo_url, ativo, ordem) VALUES
('15 Anos', 'Proposta especial para festa de 15 anos com cobertura fotográfica completa', '/propostas/15 ANOS.pdf', true, 1),
('Acompanhamento', 'Sessão de acompanhamento fotográfico personalizada', '/propostas/Acompanhamento .pdf', true, 2),
('Batizado', 'Cobertura fotográfica para cerimônias de batizado', '/propostas/BATIZADO.pdf', true, 3),
('Festa Infantil 2024', 'Proposta para festas infantis com pacote completo', '/propostas/FESTA INFANTIL.2024.pdf', true, 4),
('Fotografia de Parto 2025', 'Acompanhamento fotográfico do parto com sensibilidade e discrição', '/propostas/Fotografia de parto 2025.pdf', true, 5),
('Proposta 2024', 'Proposta geral de serviços fotográficos', '/propostas/Proposta_2024.pdf', true, 6)
ON CONFLICT (id) DO NOTHING;