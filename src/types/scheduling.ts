export type ScheduleStatus = 'available' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'awaiting_reschedule';

export interface AvailableDate {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
  created_at: string;
  updated_at: string;
}

export type CreateScheduleInput = Omit<Schedule, 'id'>;

export interface Schedule {
  id: string;
  available_date_id: string;
  client_name: string;
  client_email?: string;
  client_phone: string;
  service_type: ServiceType;
  message?: string;
  status: ScheduleStatus;
  preferred_date: string;
  preferred_time: string;
  whatsapp_notification_sent?: boolean;
  whatsapp_confirmation_sent?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SchedulingFormData {
  client_name: string;
  client_email?: string;
  client_phone: string;
  service_type: ServiceType;
  message?: string;
  selected_date: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: ScheduleStatus;
  available_date_id?: string;
  schedule_id?: string;
}

export type ServiceType = 'casamento' | 'ensaio' | 'evento' | 'book';

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  casamento: 'Casamento',
  ensaio: 'Ensaio Fotográfico',
  evento: 'Evento',
  book: 'Book Profissional',
};

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
        day_of_week?: number;
        day_of_month?: number;
        year?: number;
        month?: number;
        hour?: number;
        minute?: number;
      };
    }>;
  }>;
}