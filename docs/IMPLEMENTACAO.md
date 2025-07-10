# Sistema de Agendamento com WhatsApp

## Visão Geral
Implementação de um sistema de agendamento integrado com WhatsApp para o site da fotógrafa, permitindo que clientes visualizem datas disponíveis, agendem sessões e recebam confirmações via WhatsApp. O sistema inclui um painel privado para a fotógrafa gerenciar agendamentos.

## Funcionalidades Principais

### 1. Calendário Interativo ✅
- Visualização de datas disponíveis e ocupadas
- Seleção de horários por clientes
- Diferentes visualizações (mês, semana, dia)
- Código de cores para status dos agendamentos

### 2. Banco de Dados (Supabase) ✅
- Tabela de datas disponíveis
- Tabela de agendamentos
- Tabela de usuários (fotógrafa)
- Políticas de segurança implementadas
- Índices para otimização

### 3. Integração WhatsApp ✅
- Notificação via wa.me para fotógrafa sobre novos agendamentos
- Link direto para painel de confirmação
- Notificação para clientes sobre status do agendamento
- **Mensagens automáticas de cancelamento** 🆕
- **Mensagens automáticas de reagendamento** 🆕
- **Botões de contato direto no dashboard** 🆕
- **Fallback entre WhatsApp Business API e wa.me** 🆕
- Validação de números brasileiros com DDD
- Cópia rápida de números de telefone

### 4. Sistema de Autenticação 🆕
- Login da fotógrafa com telefone + senha
- Autenticação via Supabase Auth
- Proteção de rotas privadas
- Sessão persistente

### 5. Painel Administrativo 🆕
- Dashboard privado da fotógrafa
- Listagem de agendamentos pendentes
- Listagem de agendamentos confirmados
- Ações de confirmar/rejeitar agendamentos
- Logout seguro

### 6. Interface do Usuário
- Formulário de agendamento com validação ✅
- Calendário responsivo ✅
- Feedback visual de status ✅
- Validação de telefone brasileiro ✅
- Máscara de telefone ✅
- Modal de confirmação ⏳
- Página de login ⏳
- Dashboard administrativo ⏳

## Tecnologias Utilizadas
- React + TypeScript
- Supabase (Banco de Dados + Auth)
- React Big Calendar
- WhatsApp wa.me (integração simplificada)
- TailwindCSS
- React Router (proteção de rotas)
- Context API (gerenciamento de estado)

## Progresso da Implementação

### Fase 1: Estrutura Básica ✅ (100%)
- [x] Criação dos tipos TypeScript
- [x] Implementação do componente de calendário
- [x] Configuração do banco de dados Supabase
- [x] Configuração das variáveis de ambiente

### Fase 2: Funcionalidades Core ✅ (100%)
- [x] Serviços de integração com Supabase
- [x] Serviço de notificação WhatsApp (wa.me)
- [x] **Mensagens automáticas de cancelamento via WhatsApp** 🆕
- [x] **Mensagens automáticas de reagendamento via WhatsApp** 🆕
- [x] **Sistema híbrido WhatsApp Business API + wa.me** 🆕
- [x] Políticas de segurança e RLS
- [x] Validação de formulários
- [x] Validação de telefone brasileiro
- [x] Utilitários de formatação de telefone

### Fase 3: Sistema de Autenticação ⏳ (0%)
- [ ] Configuração Supabase Auth
- [ ] Página de login
- [ ] Proteção de rotas
- [ ] Context de autenticação
- [ ] Middleware de autenticação

### Fase 4: Painel Administrativo ✅ (100%)
- [x] Dashboard da fotógrafa
- [x] Listagem de agendamentos pendentes
- [x] Listagem de agendamentos confirmados
- [x] Ações de confirmar/rejeitar/cancelar/reagendar
- [x] **Botões de contato direto via WhatsApp** 🆕
- [x] **Botão para copiar número do cliente** 🆕
- [x] **Feedback automático de envio de mensagens** 🆕
- [x] Interface responsiva do painel

### Fase 5: Interface e UX ⏳ (75%)
- [x] Implementação do calendário responsivo
- [x] Feedback visual de status
- [x] Validação em tempo real
- [x] Máscara de telefone
- [ ] Modal de confirmação de agendamento
- [ ] Melhorias de UX no painel

### Fase 6: Testes e Refinamentos ⏳ (90%)
- [x] Implementar autenticação com Supabase
- [x] Criar página de login para fotógrafo
- [x] Desenvolver dashboard administrativo
- [x] Implementar gerenciamento de agendamentos
- [x] Adicionar funcionalidades de confirmação/cancelamento
- [x] Criar contexto de autenticação
- [x] Implementar proteção de rotas
- [x] Criar serviços do dashboard
- [ ] Configurar usuário administrador no Supabase
- [ ] Testar fluxo completo
- [ ] Testes de integração
- [ ] Testes de unidade
- [ ] Otimização de performance
- [ ] Documentação de uso

## Próximos Passos
1. **Configurar Supabase Auth**
   - Habilitar autenticação por telefone
   - Configurar políticas de usuário
   - Criar tabela de usuários

2. **Implementar Sistema de Login**
   - Página de login (/login)
   - Validação de credenciais
   - Redirecionamento pós-login

3. **Desenvolver Painel Administrativo**
   - Dashboard (/dashboard)
   - Proteção de rota
   - Listagem de agendamentos
   - Ações de confirmar/rejeitar

4. **Integração WhatsApp Avançada** ✅
   - [x] Links personalizados com dados do agendamento
   - [x] Mensagens automáticas de confirmação
   - [x] **Mensagens automáticas de cancelamento** 🆕
   - [x] **Mensagens automáticas de reagendamento** 🆕
   - [x] **Sistema híbrido API + wa.me com fallback** 🆕
   - [x] **Botões de contato direto no dashboard** 🆕
   - [x] Notificações para cliente

5. **Implementar Funcionalidades Avançadas**
   - Modal de confirmação de agendamento
   - Edição de agendamentos (futuro)
   - Relatórios e estatísticas

6. **Testes e Refinamentos**
   - Testes automatizados
   - Otimização de performance
   - Documentação completa

## Fluxo do Sistema

### Para o Cliente:
1. Acessa o site e visualiza o calendário
2. Seleciona data/horário disponível
3. Preenche formulário com dados pessoais
4. Sistema valida telefone brasileiro (DDD obrigatório)
5. Agendamento é criado com status "pending"
6. Cliente recebe link wa.me informando que aguarda confirmação

### Para a Fotógrafa:
1. Recebe notificação via WhatsApp com link para o painel
2. Acessa /login e faz autenticação
3. Visualiza dashboard com agendamentos pendentes e confirmados
4. Confirma, rejeita, cancela ou reagenda agendamentos
5. **Envia mensagens automáticas via WhatsApp para cancelamentos/reagendamentos** 🆕
6. **Usa botões de contato direto para comunicação rápida** 🆕
7. **Copia números de telefone com um clique** 🆕
8. Cliente recebe notificação automática do status

## Estrutura do Banco de Dados

### Tabelas Existentes:
- `available_dates` - Datas e horários disponíveis
- `schedulings` - Agendamentos dos clientes

### Novas Tabelas Necessárias:
- `auth.users` - Usuários do sistema (Supabase Auth)
- `user_profiles` - Perfis estendidos (dados da fotógrafa)

### Campos Adicionais:
- `schedulings.status` - pending, confirmed, rejected
- `schedulings.confirmed_at` - timestamp da confirmação
- `schedulings.confirmed_by` - ID do usuário que confirmou

## Configuração do Sistema

### Configuração do Usuário Administrador

Para configurar o acesso administrativo ao dashboard:

#### 1. Acesse o Supabase Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Selecione seu projeto

#### 2. Criar Usuário Administrador
- Navegue para `Authentication > Users`
- Clique em `Add user`
- Preencha os dados:
  - **Email**: `[TELEFONE]@gracefotografia.com` (ex: `11987654321@gracefotografia.com`)
  - **Password**: Sua senha escolhida
  - **Email Confirm**: ✅ Marque como confirmado
- Clique em `Create user`

#### 3. Formato do Login
- **Telefone**: Digite apenas os números (ex: `11987654321`)
- **Senha**: A senha configurada no Supabase

#### 4. Exemplo de Configuração
```
Telefone do fotógrafo: (11) 98765-4321
Email no Supabase: 11987654321@gracefotografia.com
Login no app: 11987654321
Senha: MinhaSenh@123
```

#### 5. Acessar o Dashboard
- Vá para `/login` no site
- Digite o telefone (apenas números)
- Digite a senha
- Será redirecionado para `/dashboard`

## Notas de Implementação
- A estrutura do banco de dados está otimizada para consultas frequentes
- Implementada proteção contra duplo agendamento
- Sistema preparado para múltiplos fusos horários
- Logs detalhados para rastreamento de problemas
- Validação de telefone brasileiro com DDD obrigatório
- **Sistema híbrido de WhatsApp**: tenta WhatsApp Business API primeiro, fallback para wa.me 🆕
- **Mensagens personalizadas** para cada tipo de ação (cancelamento, reagendamento) 🆕
- **Feedback visual** informando se mensagem foi enviada automaticamente ou requer ação manual 🆕
- **Botões de ação rápida** no dashboard para contato direto com clientes 🆕

## Considerações de Segurança
- Todas as credenciais estão em variáveis de ambiente
- Implementadas políticas de RLS no Supabase
- Validação de dados no frontend e backend
- Rate limiting para prevenção de spam
- Autenticação segura via Supabase Auth
- Proteção de rotas administrativas
- Sessões com timeout automático

## Documentação Adicional
- `docs/whatsapp-business-api-integration.md` - Integração WhatsApp Business API (alternativa)
- `src/utils/phoneUtils.ts` - Utilitários de validação de telefone
- `src/services/schedulingService.ts` - Serviços de agendamento

## Funcionalidades WhatsApp Implementadas 🆕

### 1. Mensagens Automáticas de Cancelamento
- Enviadas automaticamente quando um agendamento é cancelado
- Inclui dados do agendamento (data, horário, serviço)
- Motivo do cancelamento personalizado
- Fallback para WhatsApp Web se API não configurada

### 2. Mensagens Automáticas de Reagendamento
- Enviadas quando um agendamento precisa ser reagendado
- Inclui dados do agendamento original
- Motivo do reagendamento
- Instruções para novo agendamento

### 3. Sistema Híbrido de Envio
- **Primeira tentativa**: WhatsApp Business API (se configurada)
- **Fallback**: Abertura do WhatsApp Web com mensagem pré-preenchida
- **Feedback visual**: Informa ao usuário qual método foi usado

### 4. Botões de Contato Rápido
- **Botão WhatsApp**: Abre chat direto com cliente
- **Botão Copiar**: Copia número do cliente para área de transferência
- Disponível em todos os cards de agendamento
- Mensagens contextuais baseadas no status do agendamento

### 5. Configuração da API WhatsApp Business
```javascript
// Em src/services/schedulingService.ts
const WHATSAPP_API_URL = process.env.REACT_APP_WHATSAPP_API_URL;
const WHATSAPP_API_TOKEN = process.env.REACT_APP_WHATSAPP_API_TOKEN;
```

### 6. Exemplos de Mensagens

#### Cancelamento:
```
🚫 Agendamento Cancelado

Olá [Nome]! Infelizmente precisei cancelar seu agendamento:

📅 Data: [Data]
⏰ Horário: [Horário]
📸 Serviço: [Tipo]

❌ Motivo: [Motivo]

Por favor, entre em contato para reagendarmos.
```

#### Reagendamento:
```
📅 Reagendamento Necessário

Olá [Nome]! Preciso reagendar seu agendamento:

📅 Data original: [Data]
⏰ Horário original: [Horário]
📸 Serviço: [Tipo]

🔄 Motivo: [Motivo]

Por favor, acesse o site para escolher uma nova data.
```

---

*Última atualização: 23 de Fevereiro de 2025*
*Versão: 2.1.0 - Funcionalidades WhatsApp Avançadas*