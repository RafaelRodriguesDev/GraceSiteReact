-- Criar tabela para gerenciar imagens do mosaico
CREATE TABLE IF NOT EXISTS mosaico_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    ordem INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_mosaico_images_ordem ON mosaico_images(ordem);
CREATE INDEX IF NOT EXISTS idx_mosaico_images_created_at ON mosaico_images(created_at);

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_mosaico_images_updated_at ON mosaico_images;
CREATE TRIGGER update_mosaico_images_updated_at
    BEFORE UPDATE ON mosaico_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional - baseado nas imagens estáticas existentes)
INSERT INTO mosaico_images (filename, url, ordem) VALUES
    ('image1.jpg', '/images/image1.jpg', 1),
    ('image2.jpg', '/images/image2.jpg', 2),
    ('image3.jpg', '/images/image3.jpg', 3),
    ('image4.jpg', '/images/image4.jpg', 4),
    ('image5.jpg', '/images/image5.jpg', 5),
    ('image6.jpg', '/images/image6.jpg', 6),
    ('image7.jpg', '/images/image7.jpg', 7),
    ('image8.jpg', '/images/image8.jpg', 8),
    ('image9.jpg', '/images/image9.jpg', 9),
    ('image10.jpg', '/images/image10.jpg', 10)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS (Row Level Security) se necessário
ALTER TABLE mosaico_images ENABLE ROW LEVEL SECURITY;

-- Criar policy para permitir leitura pública das imagens
CREATE POLICY "Permitir leitura pública de imagens do mosaico" ON mosaico_images
    FOR SELECT USING (true);

-- Criar policy para permitir apenas usuários autenticados modificarem
CREATE POLICY "Permitir modificação apenas para usuários autenticados" ON mosaico_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Comentários para documentação
COMMENT ON TABLE mosaico_images IS 'Tabela para armazenar metadados das imagens do mosaico de fundo';
COMMENT ON COLUMN mosaico_images.filename IS 'Nome original do arquivo da imagem';
COMMENT ON COLUMN mosaico_images.url IS 'URL pública da imagem no Supabase Storage';
COMMENT ON COLUMN mosaico_images.ordem IS 'Ordem de exibição da imagem no mosaico';
