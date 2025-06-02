import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { SchedulingCalendar } from '../components/SchedulingCalendar';
import { SchedulingConfirmationModal } from '../components/SchedulingConfirmationModal';
import { availableDatesService, schedulingService, whatsappService } from '../services/schedulingService';
import { CalendarEvent, CreateScheduleInput, Schedule, SchedulingFormData, ServiceType } from '../types/scheduling';

export function Scheduling() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date; available_date_id?: string } | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState<SchedulingFormData | null>(() => ({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: 'ensaio' as ServiceType,
    message: '',
    selected_date: new Date()
  }));
  
  // Estados para validação do telefone
  const [phoneError, setPhoneError] = useState<string>('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3); // Carregar 3 meses de eventos

      const [availableDates, schedules] = await Promise.all([
        availableDatesService.getAvailableDates(startDate, endDate),
        schedulingService.getSchedulesByDateRange(startDate, endDate)
      ]);

      const calendarEvents: CalendarEvent[] = [
        // Apenas datas disponíveis
        ...availableDates
          .filter(date => date.status === 'available')
          .map(date => ({
            id: date.id,
            title: 'Horário Disponível',
            start: new Date(`${date.date}T${date.start_time}`),
            end: new Date(`${date.date}T${date.end_time}`),
            status: date.status,
            available_date_id: date.id
          })),
        // Apenas agendamentos confirmados (indisponíveis para o cliente)
        ...schedules
          .filter(schedule => schedule.status === 'confirmed')
          .map(schedule => ({
            id: schedule.id,
            title: 'Indisponível',
            start: new Date(`${schedule.created_at}`),
            end: new Date(`${schedule.created_at}`),
            status: 'unavailable' as any // Marcando como indisponível para o cliente
          }))
      ];

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [availableTimesForDate, setAvailableTimesForDate] = useState<CalendarEvent[]>([]);

  const [customTime, setCustomTime] = useState('');
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);

  // Função para aplicar máscara e validar telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phone = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    
    // Aplica máscara
    if (phone.length <= 11) {
      if (phone.length <= 2) {
        phone = phone;
      } else if (phone.length <= 7) {
        phone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
      } else {
        phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
      }
    }
    
    e.target.value = phone;
    
    // Valida o número
    const cleanPhone = phone.replace(/\D/g, '');
    const validation = whatsappService.validateBrazilianPhone(cleanPhone);
    
    if (!validation.isValid && cleanPhone.length > 0) {
      setPhoneError(validation.error || 'Número inválido');
      setIsPhoneValid(false);
    } else {
      setPhoneError('');
      setIsPhoneValid(validation.isValid || cleanPhone.length === 0);
    }
  };

  // Lista de datas bloqueadas (feriados, folgas, etc)
  const blockedDates = [
    '2024-03-29', // Sexta-feira Santa
    '2024-03-31', // Páscoa
    '2024-04-21', // Tiradentes
    '2024-05-01', // Dia do Trabalho
  ];

  const handleDateSelect = (slotInfo: { start: Date; end: Date }) => {
    const selectedDate = slotInfo.start;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar se a data é passada
    if (selectedDate < today) {
      alert('Não é possível agendar em datas passadas.');
      return;
    }

    // Validar se é uma data bloqueada
    const dateStr = selectedDate.toISOString().split('T')[0];
    if (blockedDates.includes(dateStr)) {
      alert('Esta data não está disponível para agendamento.');
      return;
    }

    // Validar se é domingo
    if (selectedDate.getDay() === 0) {
      alert('Não realizamos agendamentos aos domingos.');
      return;
    }

    setSelectedDate(selectedDate);
    setShowCustomTimeInput(false);
    setCustomTime('');
    
    // Gerar todos os horários das 8:00 às 18:00
    const allTimes: CalendarEvent[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1);

      // Verificar se o horário já está ocupado
      const isTimeSlotTaken = events.some(event => {
        const eventStart = new Date(event.start);
        return eventStart.toDateString() === selectedDate.toDateString() &&
               eventStart.getHours() === hour &&
               (event.status === 'pending' || event.status === 'confirmed');
      });

      // Encontrar o evento existente para este horário
      const existingEvent = events.find(event => {
        const eventStart = new Date(event.start);
        return eventStart.toDateString() === selectedDate.toDateString() &&
               eventStart.getHours() === hour &&
               !isTimeSlotTaken;
      });

      allTimes.push({
        id: existingEvent?.id || `time-${hour}`,
        title: isTimeSlotTaken ? 'Horário Ocupado' : 'Horário Disponível',
        start: startTime,
        end: endTime,
        status: isTimeSlotTaken ? 'cancelled' : 'pending', // Usando 'cancelled' para ocupado e 'pending' para disponível
        available_date_id: existingEvent?.available_date_id
      });
    }
    
    setAvailableTimesForDate(allTimes);
    setIsTimeModalOpen(true);
  };

  const [customTimeError, setCustomTimeError] = useState<string>('');

  const validateCustomTime = (hours: number, minutes: number): boolean => {
    // Validar horário comercial (8:00 às 18:00)
    if (hours < 8 || hours > 18) {
      setCustomTimeError('O horário deve estar entre 8:00 e 18:00');
      return false;
    }

    // Validar intervalos de 30 minutos
    if (minutes !== 0 && minutes !== 30) {
      setCustomTimeError('Os minutos devem ser 00 ou 30');
      return false;
    }

    // Verificar se o horário já está ocupado
    const startTime = new Date(selectedDate!);
    startTime.setHours(hours, minutes, 0, 0);
    const isTimeSlotTaken = events.some(event => {
      const eventStart = new Date(event.start);
      return eventStart.toDateString() === selectedDate?.toDateString() &&
             eventStart.getHours() === hours &&
             eventStart.getMinutes() === minutes &&
             (event.status === 'pending' || event.status === 'confirmed');
    });

    if (isTimeSlotTaken) {
      setCustomTimeError('Este horário já está ocupado');
      return false;
    }

    setCustomTimeError('');
    return true;
  };

  const handleCustomTimeSubmit = () => {
    if (!selectedDate || !customTime) {
      setCustomTimeError('Selecione um horário válido');
      return;
    }

    const [hours, minutes] = customTime.split(':').map(Number);
    
    if (!validateCustomTime(hours, minutes)) return;

    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(hours + 1);

    // Buscar evento existente para o horário personalizado
    const existingEvent = events.find(event => {
      const eventStart = new Date(event.start);
      return eventStart.toDateString() === selectedDate.toDateString() &&
             eventStart.getHours() === hours &&
             event.status !== 'pending' && event.status !== 'confirmed';
    });

    if (!existingEvent?.available_date_id) {
      setCustomTimeError('Este horário não está disponível para agendamento');
      return;
    }

    const customEvent: CalendarEvent = {
      id: existingEvent.id,
      title: 'Horário Personalizado',
      start: startTime,
      end: endTime,
      status: 'pending', // Usando 'pending' para horários disponíveis
      available_date_id: existingEvent.available_date_id
    };

    handleTimeSelect(customEvent);
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const handleTimeSelect = (event: CalendarEvent) => {
    if (!event.available_date_id) {
      console.error('Erro: Horário selecionado não possui ID de data disponível');
      return;
    }

    setSelectedSlot({ 
      start: event.start, 
      end: event.end,
      available_date_id: event.available_date_id
    });
    setIsTimeModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot) {
      setSubmitStatus('error');
      return;
    }

    const formDataObj = new FormData(e.currentTarget);
    const phoneWithMask = formDataObj.get('phone') as string;
    const phone = phoneWithMask.replace(/\D/g, ''); // Remove máscara para validação
    
    // Validar telefone antes de prosseguir
    const phoneValidation = whatsappService.validateBrazilianPhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Número de telefone inválido');
      return;
    }

    const data: SchedulingFormData = {
      client_name: formDataObj.get('name') as string,
      client_email: formDataObj.get('email') as string,
      client_phone: phone, // Salva sem máscara
      service_type: formDataObj.get('service_type') as ServiceType,
      message: formDataObj.get('message') as string,
      selected_date: selectedSlot.start
    };

    setFormData(data);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmScheduling = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Criar agendamento
      if (!selectedSlot || !('available_date_id' in selectedSlot)) {
        throw new Error('ID da data disponível não encontrado');
      }

      const schedule = await schedulingService.create({
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        service_type: formData.service_type,
        message: formData.message,
        status: 'pending',
        available_date_id: selectedSlot.available_date_id as string,
        preferred_date: selectedSlot.start.toISOString().split('T')[0],
        preferred_time: selectedSlot.start.toTimeString().split(' ')[0]
      });

      // Gerar link WhatsApp para notificar fotógrafa
      const whatsappLink = whatsappService.notifyPhotographer(schedule);
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappLink, '_blank');
      
      setSubmitStatus('success');
      setSelectedSlot(null);
      setFormData(null);
      setIsConfirmationModalOpen(false);
      loadEvents(); // Recarregar eventos

      // Limpar formulário
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.reset();
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-light text-center mb-8">Agendamento</h1>
        
        <div className="grid grid-cols-1 gap-8">
          {/* Calendário */}
          <div>
            <SchedulingCalendar
              availableSlots={events}
              onSelectSlot={handleDateSelect}
              blockedDates={blockedDates}
            />

            {/* Modal de Horários Disponíveis */}
            {isTimeModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Horários Disponíveis para {selectedDate?.toLocaleDateString('pt-BR')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <select
                        className="w-full p-3 border rounded-md appearance-none bg-white"
                        onChange={(e) => {
                          const selectedTime = availableTimesForDate.find(time => 
                            time.id === e.target.value
                          );
                          if (selectedTime) handleTimeSelect(selectedTime);
                        }}
                      >
                        <option value="">Selecione um horário</option>
                        {availableTimesForDate.map((time) => {
                          const timeStr = time.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                          const isAvailable = time.status === 'pending'; // 'pending' agora representa horários disponíveis
                          
                          return (
                            <option
                              key={time.id}
                              value={time.id}
                              disabled={!isAvailable}
                              style={{
                                color: isAvailable ? '#059669' : '#DC2626',
                                backgroundColor: isAvailable ? 'white' : '#FEF2F2'
                              }}
                            >
                              {timeStr} {!isAvailable ? '(Ocupado)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      {!showCustomTimeInput ? (
                        <button
                          onClick={() => setShowCustomTimeInput(true)}
                          className="w-full p-3 text-center bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          Escolher horário personalizado
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <input
                              type="time"
                              value={customTime}
                              onChange={(e) => {
                                setCustomTime(e.target.value);
                                setCustomTimeError('');
                              }}
                              className={`w-full p-2 border rounded-md ${customTimeError ? 'border-red-500' : ''}`}
                              min="08:00"
                              max="18:00"
                              step="1800"
                            />
                            {customTimeError && (
                              <p className="mt-1 text-sm text-red-600">{customTimeError}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleCustomTimeSubmit}
                              className="flex-1 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!customTime}
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => {
                                setShowCustomTimeInput(false);
                                setCustomTime('');
                                setCustomTimeError('');
                              }}
                              className="flex-1 p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsTimeModalOpen(false)}
                    className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal do Formulário de Agendamento */}
          {isFormModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">Formulário de Agendamento</h2>
                  <button
                    onClick={() => {
                      setIsFormModalOpen(false);
                      setSelectedSlot(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                  Agendamento enviado com sucesso! Entraremos em contato em breve.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  Ocorreu um erro ao enviar o agendamento. Por favor, tente novamente.
                </div>
              )}

              {selectedSlot && (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-md">
                  Data selecionada: {selectedSlot.start.toLocaleDateString('pt-BR')}
                  <br />
                  Horário: {selectedSlot.start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone (com DDD)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(15) 99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    onChange={handlePhoneChange}
                    required
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Digite o número com DDD (ex: 15999999999)
                  </p>
                </div>

                <div>
                  <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Ensaio
                  </label>
                  <select
                    id="service_type"
                    name="service_type"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione um tipo de ensaio</option>
                    <option value="casamento">Casamento</option>
                    <option value="ensaio">Ensaio Fotográfico</option>
                    <option value="evento">Evento</option>
                    <option value="book">Book Profissional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedSlot || isSubmitting || phoneError !== ''}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Solicitar Agendamento'}
                  <Send className="h-5 w-5" />
                </button>
                
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                  <p className="font-medium mb-1">📱 Como funciona:</p>
                  <p>Após enviar o formulário, você será redirecionado para o WhatsApp onde poderá conversar diretamente conosco sobre seu agendamento.</p>
                </div>
              </div>
            </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmação */}
        {formData && selectedSlot && (
          <SchedulingConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setIsConfirmationModalOpen(false)}
            onConfirm={handleConfirmScheduling}
            selectedDate={selectedSlot.start}
            formData={{
              client_name: formData.client_name,
              service_type: formData.service_type,
              client_phone: formData.client_phone
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}