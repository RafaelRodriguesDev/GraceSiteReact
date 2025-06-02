-- Script para configurar o usuário administrador no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- SCRIPT FUNCIONAL PARA INSERIR USUÁRIO
-- Substitua os valores conforme necessário

-- Primeiro, vamos inserir o usuário de forma mais simples
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  phone,
  phone_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  '15981055169@gracefotografia.com',
  crypt('SuaSenhaSegura123', gen_salt('bf')),
  NOW(),
  '+5515981055169',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"phone": "+5515981055169"}',
  false
);

-- Verificar se o usuário foi criado
SELECT id, email, phone, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = '15981055169@gracefotografia.com';


-- MÉTODO MAIS SIMPLES: Use o Supabase Auth Admin
-- 1. Vá para o Supabase Dashboard
-- 2. Navegue para Authentication > Users
-- 3. Clique em "Add user"
-- 4. Preencha:
--    - Email: 15981055169@gracefotografia.com (substitua pelo telefone real)
--    - Password: sua senha escolhida
--    - Email Confirm: true
-- 5. Clique em "Create user"

-- Configurações recomendadas:
-- Email: [TELEFONE_DO_FOTOGRAFO]@gracefotografia.com
-- Exemplo: 15981055169@gracefotografia.com
-- Password: Uma senha segura de sua escolha

-- IMPORTANTE:
-- 1. Substitua "11999999999" pelo telefone real do fotógrafo (apenas números)
-- 2. Mantenha o formato: [telefone]@gracefotografia.com
-- 3. Anote a senha escolhida para usar no login
-- 4. O telefone deve estar no formato: +55[DDD][NUMERO] (ex: +5511987654321)

-- Exemplo de dados para teste:
-- Telefone: 15981055169
-- Email no Supabase: 15981055169@gracefotografia.com
-- Senha: SuaSenhaSegura123
-- Login no app: Digite apenas "15981055169" (sem +55)