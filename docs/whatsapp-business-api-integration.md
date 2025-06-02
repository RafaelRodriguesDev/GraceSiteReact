# Integração WhatsApp Business API

## Visão Geral

Este documento descreve como implementar a integração com a WhatsApp Business API para envio automático de notificações de agendamento no sistema de fotografia Grace Site.

## Pré-requisitos

### 1. Configuração da Meta Business

1. **Criar uma conta Meta Business**:
   - Acesse [business.facebook.com](https://business.facebook.com)
   - Crie ou configure sua conta business

2. **Configurar WhatsApp Business API**:
   - Acesse [developers.facebook.com](https://developers.facebook.com)
   - Crie um novo app
   - Adicione o produto "WhatsApp Business API"

3. **Registrar número de telefone**:
   - No painel do WhatsApp Business API
   - Adicione e verifique seu número de telefone
   - Anote o `Phone Number ID` gerado

### 2. Obter Credenciais

- **Access Token**: Token de acesso temporário ou permanente
- **Phone Number ID**: ID do número registrado na API
- **Webhook URL**: Para receber callbacks (opcional)

## Configuração no Projeto

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env`:

```env
# WhatsApp Business API Configuration
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v17.0/SEU_PHONE_NUMBER_ID/messages
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token_aqui
VITE_PHOTOGRAPHER_PHONE=5515998139444
```

### 2. Estrutura de Tipos

Os tipos TypeScript já estão definidos em `src/types/scheduling.ts`:

```typescript
export interface WhatsAppMessage {
  to: string;
  template: string;
  language: {
    code: string;
  };
  components: Array<{
    type: string;
    parameters: Array<{
      type: string;
      text?: string;
      date_time?: {
        fallback_value: string;
      };
    }>;
  }>;
}
```

### 3. Serviço de WhatsApp

O serviço está implementado em `src/services/schedulingService.ts`:

```typescript
export const whatsappService = {
  async sendMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const response = await fetch(WHATSAPP_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  },

  async notifyPhotographer(schedule: Schedule): Promise<void> {
    // Implementação da notificação para o fotógrafo
  },

  async notifyClient(schedule: Schedule, isConfirmed: boolean): Promise<void> {
    // Implementação da notificação para o cliente
  }
};
```

## Templates de Mensagem

### 1. Criar Templates no Meta Business

No painel do WhatsApp Business API, crie os seguintes templates:

#### Template: `novo_agendamento`
```
Olá! Você tem um novo agendamento:

👤 Cliente: {{1}}
📸 Serviço: {{2}}
📱 Telefone: {{3}}
📅 Data/Hora: {{4}}

Acesse o painel para confirmar ou recusar.
```

#### Template: `agendamento_confirmado`
```
Olá {{1}}! 🎉

Seu agendamento foi CONFIRMADO para {{2}}.

Em breve entraremos em contato com mais detalhes.

Obrigado por escolher nossos serviços!
```

#### Template: `agendamento_recusado`
```
Olá {{1}},

Infelizmente não conseguimos confirmar seu agendamento para {{2}}.

Por favor, escolha uma nova data em nosso site ou entre em contato conosco.

Obrigado pela compreensão!
```

### 2. Aprovação dos Templates

- Todos os templates precisam ser aprovados pelo Meta
- O processo pode levar até 24 horas
- Templates devem seguir as políticas do WhatsApp

## Implementação

### 1. Ativar Notificações

Para ativar as notificações WhatsApp, descomente o código em `schedulingService.ts`:

```typescript
// No método create do schedulingService
try {
  // Criar o agendamento
  const { data, error } = await supabase
    .from('schedules')
    .insert([schedule])
    .select();

  if (error) throw error;

  // Atualizar o status da data disponível
  await availableDatesService.updateAvailableDateStatus(schedule.available_date_id, 'pending');

  // DESCOMENTAR ESTA LINHA PARA ATIVAR WHATSAPP
  // await whatsappService.notifyPhotographer(data[0]);

  return data[0];
} catch (error) {
  console.error('Error creating schedule:', error);
  throw error;
}
```

### 2. Tratamento de Erros

Implementar tratamento adequado para:

- **401 Unauthorized**: Token inválido ou expirado
- **400 Bad Request**: Formato de mensagem inválido
- **403 Forbidden**: Número não verificado ou template não aprovado
- **429 Too Many Requests**: Limite de rate exceeded

### 3. Logs e Monitoramento

Adicionar logs para monitorar:

- Mensagens enviadas com sucesso
- Falhas no envio
- Status de entrega (via webhooks)

## Testes

### 1. Teste Manual

Use o seguinte comando cURL para testar a API:

```bash
curl -X POST \
  https://graph.facebook.com/v17.0/SEU_PHONE_NUMBER_ID/messages \
  -H 'Authorization: Bearer SEU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "5515998139444",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  }'
```

### 2. Verificar Status do Número

```bash
curl -X GET \
  "https://graph.facebook.com/v17.0/SEU_PHONE_NUMBER_ID?fields=verified_name,display_phone_number,quality_rating" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

## Limitações e Considerações

### 1. Limitações da API

- **Rate Limits**: 1000 mensagens por segundo
- **Templates**: Apenas templates aprovados podem ser usados
- **Janela de 24h**: Mensagens fora de templates só podem ser enviadas dentro de 24h após última mensagem do usuário

### 2. Custos

- **Mensagens de template**: Cobradas por envio
- **Mensagens de sessão**: Gratuitas dentro da janela de 24h
- **Verificação de número**: Taxa única

### 3. Compliance

- Seguir políticas do WhatsApp Business
- Implementar opt-out para usuários
- Manter logs de consentimento

## Alternativas

Caso a WhatsApp Business API não seja viável, considere:

1. **Z-API**: Solução brasileira paga
2. **Evolution API**: Solução open-source
3. **Chatwoot + Evolution API**: Plataforma completa
4. **wa.me links**: Solução simples sem automação

## Suporte

Para dúvidas sobre a implementação:

- [Documentação oficial WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://business.facebook.com/help)
- [WhatsApp Business API Postman Collection](https://www.postman.com/meta/workspace/whatsapp-business-platform)

---

**Nota**: Esta integração requer aprovação e configuração adequada no Meta Business Manager. Certifique-se de seguir todas as políticas e diretrizes do WhatsApp Business antes de implementar em produção.