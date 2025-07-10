-- Criar bucket para imagens do mosaico no Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'mosaico',
    'mosaico',
    true,
    10485760, -- 10MB limit
    '{"image/jpeg","image/jpg","image/png","image/webp","image/gif"}'
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Criar políticas de acesso para o bucket mosaico
-- Policy 1: Permitir leitura pública
CREATE POLICY "Permitir leitura pública das imagens do mosaico" ON storage.objects
    FOR SELECT USING (bucket_id = 'mosaico');

-- Policy 2: Permitir upload apenas para usuários autenticados
CREATE POLICY "Permitir upload apenas para usuários autenticados" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'mosaico' 
        AND auth.role() = 'authenticated'
    );

-- Policy 3: Permitir deleção apenas para usuários autenticados
CREATE POLICY "Permitir deleção apenas para usuários autenticados" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'mosaico' 
        AND auth.role() = 'authenticated'
    );

-- Policy 4: Permitir atualização apenas para usuários autenticados
CREATE POLICY "Permitir atualização apenas para usuários autenticados" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'mosaico' 
        AND auth.role() = 'authenticated'
    );

-- Verificar se as policies foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%mosaico%';

-- Comentários para documentação
COMMENT ON TABLE storage.buckets IS 'Buckets de armazenamento - inclui bucket mosaico para imagens de fundo';
