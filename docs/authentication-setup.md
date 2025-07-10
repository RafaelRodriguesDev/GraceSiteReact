# Sistema de Autenticação - Configuração

Este documento explica como configurar e usar o sistema de autenticação do painel administrativo.

## Visão Geral

O sistema de autenticação permite que a fotógrafa acesse um painel privado para gerenciar agendamentos recebidos via WhatsApp. A autenticação é baseada em:

- **Telefone**: Usado como identificador único
- **Senha**: Configurada no Supabase
- **Supabase Auth**: Sistema de autenticação seguro

## Configuração Inicial

### 1. Configurar Usuário no Supabase

#### Método 1: Interface Web (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Selecione seu projeto

2. **Criar Usuário Administrador**
   - Navegue para `Authentication > Users`
   - Clique em `Add user`
   - Preencha:
     - **Email**: `[TELEFONE_SEM_ESPACOS]@gracefotografia.com`
     - **Password**: Sua senha escolhida
     - **Email Confirm**: ✅ Marque como confirmado
   - Clique em `Create user`

#### Método 2: SQL (Avançado)

Se preferir usar SQL, execute o script em `docs/setup-admin-user.sql`

### 2. Formato dos Dados

#### Telefone
- **Formato de entrada**: Apenas números (ex: `11987654321`)
- **Formato no Supabase**: `11987654321@gracefotografia.com`
- **Validação**: Deve ter DDD + número (11 dígitos total)

#### Exemplos

| Telefone Real | Email no Supabase | Login no App |
|---------------|-------------------|---------------|
| (11) 98765-4321 | 11987654321@gracefotografia.com | 11987654321 |
| (21) 99999-8888 | 21999998888@gracefotografia.com | 21999998888 |
| (85) 91234-5678 | 85912345678@gracefotografia.com | 85912345678 |

## Como Usar

### 1. Acessar o Sistema

1. **Ir para a página de login**
   - URL: `https://seusite.com/login`
   - Ou clique em um link direto no WhatsApp

2. **Fazer login**
   - **Telefone**: Digite apenas os números (ex: `11987654321`)
   - **Senha**: A senha configurada no Supabase
   - Clique em "Entrar"

3. **Acessar o dashboard**
   - Após login bem-sucedido, será redirecionado para `/dashboard`
   - O dashboard mostra todos os agendamentos

### 2. Gerenciar Agendamentos

#### Visualizar Estatísticas
- **Total**: Número total de agendamentos
- **Pendentes**: Aguardando confirmação
- **Confirmados**: Agendamentos confirmados
- **Cancelados**: Agendamentos cancelados
- **Concluídos**: Sessões realizadas

#### Filtrar Agendamentos
- Use o filtro no topo da lista
- Opções: Todos, Pendentes, Confirmados, Cancelados, Concluídos

#### Ações Disponíveis

**Para agendamentos pendentes:**
- ✅ **Confirmar**: Muda status para "Confirmado"
- ❌ **Cancelar**: Muda status para "Cancelado"

**Para agendamentos confirmados:**
- ✅ **Concluir**: Muda status para "Concluído" (após a sessão)
- ❌ **Cancelar**: Muda status para "Cancelado"

### 3. Informações dos Agendamentos

Cada agendamento mostra:
- **Nome do cliente**
- **Data e horário preferidos**
- **Telefone** (com máscara brasileira)
- **Email** (se fornecido)
- **Tipo de serviço**
- **Mensagem** (se fornecida)
- **Status atual**

### 4. Sair do Sistema

- Clique no botão "Sair" no canto superior direito
- Isso encerrará a sessão de forma segura

## Fluxo Completo

### 1. Cliente Agenda
1. Cliente preenche formulário no site
2. Sistema valida dados e salva no banco
3. WhatsApp é aberto com link para o dashboard
4. Fotógrafa recebe notificação

### 2. Fotógrafa Gerencia
1. Fotógrafa clica no link do WhatsApp
2. Faz login no sistema (se necessário)
3. Visualiza novo agendamento como "Pendente"
4. Confirma ou cancela o agendamento
5. Cliente pode ser notificado via WhatsApp

### 3. Acompanhamento
1. Agendamentos confirmados aparecem no dashboard
2. Após a sessão, fotógrafa marca como "Concluído"
3. Histórico fica disponível para consulta

## Segurança

### Recursos de Segurança
- **Autenticação obrigatória** para acessar dashboard
- **Sessões seguras** com tokens JWT
- **Proteção de rotas** - redirecionamento automático se não logado
- **Logout automático** em caso de inatividade
- **Validação de dados** em todas as operações

### Boas Práticas
- **Use uma senha forte** com letras, números e símbolos
- **Não compartilhe** suas credenciais
- **Faça logout** ao terminar de usar
- **Acesse apenas de dispositivos confiáveis**

## Solução de Problemas

### Não Consigo Fazer Login

1. **Verifique o telefone**
   - Digite apenas números (sem parênteses, espaços ou traços)
   - Inclua o DDD (ex: `11987654321`)

2. **Verifique a senha**
   - Certifique-se de usar a senha configurada no Supabase
   - Verifique se Caps Lock está desligado

3. **Limpe o cache**
   - Limpe cookies e cache do navegador
   - Tente em uma aba anônima/privada

### Erro "Credenciais Inválidas"

- Verifique se o usuário foi criado corretamente no Supabase
- Confirme que o email está no formato: `[telefone]@gracefotografia.com`
- Verifique se o usuário está marcado como "Email Confirmed"

### Dashboard Não Carrega

1. **Verifique a conexão**
   - Certifique-se de ter internet estável
   - Teste outros sites

2. **Verifique o Supabase**
   - Confirme que o projeto Supabase está ativo
   - Verifique as configurações de RLS (Row Level Security)

3. **Console do navegador**
   - Abra as ferramentas de desenvolvedor (F12)
   - Verifique se há erros no console

## Suporte

Se precisar de ajuda:

1. **Verifique este documento** primeiro
2. **Consulte os logs** no console do navegador
3. **Entre em contato** com o desenvolvedor
4. **Forneça detalhes** sobre o erro (prints, mensagens, etc.)

## Atualizações

Este sistema pode receber atualizações que incluem:
- Novas funcionalidades no dashboard
- Melhorias de segurança
- Correções de bugs
- Otimizações de performance

As atualizações são aplicadas automaticamente e não afetam os dados existentes.