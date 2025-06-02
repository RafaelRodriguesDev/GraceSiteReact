import { supabase } from '../lib/supabase';
import { AvailableDate, CreateScheduleInput, Schedule, ScheduleStatus, WhatsAppMessage } from '../types/scheduling';

// Cache keys
const CACHE_KEYS = {
  AVAILABLE_DATES: 'availableDates',
  SCHEDULES: 'schedules',
};

// Cache duration in milliseconds (1 hora)
const CACHE_DURATION = 60 * 60 * 1000;

// Função para gerenciar o cache
const cacheManager = {
  set: (key: string, data: any) => {
    const cacheItem = {
      data,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  },

  get: (key: string) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = new Date().getTime();

    // Verifica se o cache expirou
    if (now - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  },

  clear: (key: string) => {
    localStorage.removeItem(key);
  },
};

// Configuração do WhatsApp Business API (COMENTADO - Ver documentação em docs/whatsapp-business-api-integration.md)
// const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL;
// const WHATSAPP_ACCESS_TOKEN = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
const PHOTOGRAPHER_PHONE = import.meta.env.VITE_PHOTOGRAPHER_PHONE;

// Serviços para datas disponíveis
export const availableDatesService = {
  async getAvailableDates(startDate: Date, endDate: Date): Promise<AvailableDate[]> {
    const cacheKey = `${CACHE_KEYS.AVAILABLE_DATES}_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cachedData = cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    const { data, error } = await supabase
      .from('available_dates')
      .select('*')
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;
    
    if (data) {
      cacheManager.set(cacheKey, data);
    }
    
    return data;
  },

  async createAvailableDate(date: AvailableDate): Promise<AvailableDate> {
    const { data, error } = await supabase
      .from('available_dates')
      .insert([date])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAvailableDateStatus(id: string, status: ScheduleStatus): Promise<void> {
    const { error } = await supabase
      .from('available_dates')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },
};

// Serviços para agendamentos
export const schedulingService = {
  create: async (schedule: CreateScheduleInput) => {
    try {
      // Criar o agendamento
      const { data, error } = await supabase
        .from('schedules')
        .insert([schedule])
        .select();

      if (error) throw error;

      // Atualizar o status da data disponível para 'pending'
      await availableDatesService.updateAvailableDateStatus(schedule.available_date_id, 'pending');

      return data[0];
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  async updateScheduleStatus(id: string, status: ScheduleStatus): Promise<void> {
    // Limpa o cache ao atualizar o status
    Object.values(CACHE_KEYS).forEach(key => cacheManager.clear(key));
    const { error } = await supabase
      .from('schedules')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  },

  async getSchedulesByDateRange(startDate: Date, endDate: Date): Promise<Schedule[]> {
    const cacheKey = `${CACHE_KEYS.SCHEDULES}_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cachedData = cacheManager.get(cacheKey);
    
    if (cachedData) {
      return cachedData;
    }
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        available_dates!inner(*)
      `)
      .gte('available_dates.date', startDate.toISOString().split('T')[0])
      .lte('available_dates.date', endDate.toISOString().split('T')[0]);

    if (error) throw error;
    
    if (data) {
      cacheManager.set(cacheKey, data);
    }
    
    return data;
  },
};

// Serviço para WhatsApp usando wa.me (solução simples)
export const whatsappService = {
  // WhatsApp Business API (COMENTADO - Ver documentação para ativar)
  /*
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
  */

  // Função para gerar link wa.me
  generateWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = this.formatPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  },

  // Função para formatar número de telefone brasileiro
  formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se já tem código do país, retorna
    if (cleanPhone.startsWith('55') && cleanPhone.length === 13) {
      return cleanPhone;
    }
    
    // Se tem 11 dígitos (DDD + número), adiciona código do país
    if (cleanPhone.length === 11) {
      return `55${cleanPhone}`;
    }
    
    // Se tem 10 dígitos (DDD + número sem 9), adiciona 9 e código do país
    if (cleanPhone.length === 10) {
      const ddd = cleanPhone.substring(0, 2);
      const number = cleanPhone.substring(2);
      return `55${ddd}9${number}`;
    }
    
    throw new Error('Número de telefone inválido');
  },

  // Função para validar número brasileiro
  validateBrazilianPhone(phone: string): { isValid: boolean; error?: string } {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem pelo menos 10 dígitos
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Número deve ter pelo menos 10 dígitos (DDD + telefone)' };
    }
    
    // Verifica se tem no máximo 13 dígitos (com código do país)
    if (cleanPhone.length > 13) {
      return { isValid: false, error: 'Número muito longo' };
    }
    
    // Se tem 11 dígitos, verifica se o DDD é válido
    if (cleanPhone.length === 11) {
      const ddd = cleanPhone.substring(0, 2);
      const validDDDs = [
        '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
        '21', '22', '24', // RJ
        '27', '28', // ES
        '31', '32', '33', '34', '35', '37', '38', // MG
        '41', '42', '43', '44', '45', '46', // PR
        '47', '48', '49', // SC
        '51', '53', '54', '55', // RS
        '61', // DF
        '62', '64', // GO
        '63', // TO
        '65', '66', // MT
        '67', // MS
        '68', // AC
        '69', // RO
        '71', '73', '74', '75', '77', // BA
        '79', // SE
        '81', '87', // PE
        '82', // AL
        '83', // PB
        '84', // RN
        '85', '88', // CE
        '86', '89', // PI
        '91', '93', '94', // PA
        '92', '97', // AM
        '95', // RR
        '96', // AP
        '98', '99' // MA
      ];
      
      if (!validDDDs.includes(ddd)) {
        return { isValid: false, error: 'DDD inválido' };
      }
    }
    
    return { isValid: true };
  },

  // Notificar fotógrafo via wa.me
  notifyPhotographer(schedule: Schedule): string {
    const message = `🎉 *Novo Agendamento!*\n\n` +
      `👤 *Cliente:* ${schedule.client_name}\n` +
      `📸 *Serviço:* ${schedule.service_type}\n` +
      `📱 *Telefone:* ${schedule.client_phone}\n` +
      `📅 *Data/Hora:* ${schedule.preferred_date} ${schedule.preferred_time}\n` +
      `💬 *Mensagem:* ${schedule.message || 'Nenhuma mensagem'}\n\n` +
      `Acesse o painel para confirmar ou recusar o agendamento.`;
    
    return this.generateWhatsAppLink(PHOTOGRAPHER_PHONE!, message);
  },

  // WhatsApp Business API (COMENTADO)
  /*
  async notifyPhotographer(schedule: Schedule): Promise<void> {
    const message: WhatsAppMessage = {
      to: PHOTOGRAPHER_PHONE!,
      template: 'novo_agendamento',
      language: {
        code: 'pt_BR',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: schedule.client_name },
            { type: 'text', text: schedule.service_type },
            { type: 'text', text: schedule.client_phone },
            {
              type: 'date_time',
              date_time: {
                fallback_value: `${schedule.preferred_date} ${schedule.preferred_time}`,
              },
            },
          ],
        },
      ],
    };

    await this.sendMessage(message);
  },
  */

  // Notificar cliente via wa.me
  notifyClient(schedule: Schedule, isConfirmed: boolean): string {
    const status = isConfirmed ? 'CONFIRMADO' : 'RECUSADO';
    const emoji = isConfirmed ? '🎉' : '😔';
    
    let message;
    
    if (isConfirmed) {
      message = `${emoji} *Agendamento ${status}!*\n\n` +
        `Olá ${schedule.client_name}!\n\n` +
        `Seu agendamento foi confirmado para:\n` +
        `📅 *Data/Hora:* ${schedule.preferred_date} ${schedule.preferred_time}\n` +
        `📸 *Serviço:* ${schedule.service_type}\n\n` +
        `Em breve entraremos em contato com mais detalhes.\n\n` +
        `Obrigado por escolher nossos serviços! 📸✨`;
    } else {
      message = `${emoji} *Agendamento ${status}*\n\n` +
        `Olá ${schedule.client_name},\n\n` +
        `Infelizmente não conseguimos confirmar seu agendamento para ${schedule.preferred_date} ${schedule.preferred_time}.\n\n` +
        `Por favor, escolha uma nova data em nosso site ou entre em contato conosco.\n\n` +
        `Obrigado pela compreensão!`;
    }
    
    return this.generateWhatsAppLink(schedule.client_phone, message);
  },

  // WhatsApp Business API (COMENTADO)
  /*
  async notifyClient(schedule: Schedule, isConfirmed: boolean): Promise<void> {
    const template = isConfirmed ? 'agendamento_confirmado' : 'agendamento_recusado';

    const message: WhatsAppMessage = {
      to: schedule.client_phone,
      template,
      language: {
        code: 'pt_BR',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: schedule.client_name },
            {
              type: 'date_time',
              date_time: {
                fallback_value: `${schedule.preferred_date} ${schedule.preferred_time}`,
              },
            },
          ],
        },
      ],
    };

    await this.sendMessage(message);
  },
  */
};