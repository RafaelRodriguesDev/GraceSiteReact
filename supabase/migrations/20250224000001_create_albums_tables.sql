-- Criar tabela de álbuns
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  capa_url TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de fotos
CREATE TABLE fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  titulo VARCHAR(255),
  descricao TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  ordem INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_albums_ativo_ordem ON albums(ativo, ordem);
CREATE INDEX idx_albums_ordem ON albums(ordem);
CREATE INDEX idx_fotos_album_id_ordem ON fotos(album_id, ordem);
CREATE INDEX idx_fotos_album_id ON fotos(album_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON albums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fotos_updated_at
  BEFORE UPDATE ON fotos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para álbuns
-- Permitir leitura pública de álbuns ativos
CREATE POLICY "Álbuns ativos são visíveis publicamente" ON albums
  FOR SELECT USING (ativo = true);

-- Permitir todas as operações para usuários autenticados (admin)
CREATE POLICY "Admins podem gerenciar álbuns" ON albums
  FOR ALL USING (auth.role() = 'authenticated');

-- Políticas de segurança para fotos
-- Permitir leitura pública de fotos de álbuns ativos
CREATE POLICY "Fotos de álbuns ativos são visíveis publicamente" ON fotos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM albums 
      WHERE albums.id = fotos.album_id 
      AND albums.ativo = true
    )
  );

-- Permitir todas as operações para usuários autenticados (admin)
CREATE POLICY "Admins podem gerenciar fotos" ON fotos
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar bucket no Storage para álbuns (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('albums', 'albums', true)
ON CONFLICT (id) DO NOTHING;

-- Política de storage para álbuns
CREATE POLICY "Permitir upload de imagens para admins" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'albums' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Permitir leitura pública de imagens" ON storage.objects
  FOR SELECT USING (bucket_id = 'albums');

CREATE POLICY "Permitir atualização de imagens para admins" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'albums' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Permitir exclusão de imagens para admins" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'albums' AND
    auth.role() = 'authenticated'
  );