import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { InstagramMosaic } from './InstagramMosaicv'; // Importa o componente InstagramMosaic
import { supabase } from '../lib/supabase';
import './css/calendar.css'; // Importa o CSS personalizado

export function Agenda() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    preferred_time: '',
    message: '',
  });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false);

  // Referência para o calendário
  const calendarRef = useRef<FullCalendar | null>(null);

  // Carregar eventos do Supabase ao iniciar
  React.useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('schedules').select('*');
      if (error) console.error('Error fetching events:', error);
      if (data) {
        const formattedEvents = data.map((event) => ({
          title: event.service_type || 'Agendamento',
          start: event.preferred_date,
          end: event.preferred_date,
          color: getEventColor(event.status),
        }));
        setEvents(formattedEvents);
      }
    };
    fetchEvents();
  }, []);

  // Função para determinar a cor do evento com base no status
  const getEventColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'green'; // Confirmado
      case 'pending':
        return 'yellow'; // Pendente
      default:
        return 'gray'; // Livre
    }
  };

  // Manipular clique em uma data
  const handleDateClick = async (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsModalOpen(true);

    // Simular horários disponíveis (das 09:00 às 18:00)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    ];

    // Filtrar horários já agendados
    const bookedSlots = events
      .filter((event) => event.start === arg.dateStr)
      .map((event) => event.title.split(' ')[0]); // Extrair horário do título

    const freeSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
    setAvailableSlots(freeSlots);
  };

  // Manipular envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEvent = {
      ...formData,
      preferred_date: selectedDate,
      status: 'pending', // Novos agendamentos começam como "pendentes"
    };

    try {
      const { error } = await supabase.from('schedules').insert([newEvent]);
      if (error) throw error;

      // Adicionar novo evento ao calendário
      setEvents([
        ...events,
        {
          title: `${formData.preferred_time} - ${formData.service_type || 'Agendamento'}`,
          start: selectedDate,
          end: selectedDate,
          color: 'yellow', // Novo agendamento é amarelo (pendente)
        },
      ]);

      // Limpar formulário e fechar modais
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: '',
        preferred_time: '',
        message: '',
      });
      setIsBookingModalOpen(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fundo com InstagramMosaic */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <InstagramMosaic />
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-12 w-full">
          <h1 className="text-3xl sm:text-4xl font-light text-center mb-8">Agendamento</h1>

          {/* Calendário */}
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6 relative">
            <FullCalendar
              ref={calendarRef} // Referência para acessar a API do calendário
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              eventBackgroundColor="transparent" // Cor padrão transparente
              headerToolbar={{
                left: '', // Removemos os botões da parte superior
                center: 'title', // Mantemos o título no centro
                right: '', // Removemos os botões da parte superior
              }}
              height="auto" // Altura automática para ajustar em telas menores
              aspectRatio={1.5} // Proporção para telas maiores
              contentHeight="auto" // Altura do conteúdo ajustável
              views={{
                dayGridMonth: {
                  titleFormat: { year: 'numeric', month: 'long' }, // Formato do título
                },
              }}
              themeSystem="standard" // Usar tema padrão do FullCalendar
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
              }}
              locale="pt-br" // Idioma em português
              dayMaxEvents={true} // Limitar eventos por dia
              eventTimeFormat={{
                hour: 'numeric',
                minute: '2-digit',
                meridiem: false,
              }}
              slotLabelFormat={{
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short',
              }}
              navLinks={false} // Desativar links de navegação
              fixedWeekCount={false} // Mostrar apenas semanas completas
              firstDay={1} // Começar a semana na segunda-feira
              eventContent={(arg) => (
                <div style={{ backgroundColor: arg.event.backgroundColor }}>
                  {arg.event.title}
                </div>
              )}
              eventClassNames="text-xs sm:text-sm" // Tamanho menor para eventos
            />

            {/* Botões Inferiores */}
            <div className="flex justify-between items-center mt-4">
              {/* Botões de Navegação Centralizados */}
              <div className="flex space-x-2">
                <button
                  className="fc-button fc-button-primary"
                  onClick={() => {
                    const calendarApi = calendarRef.current?.getApi();
                    calendarApi?.prev(); // Move para o mês anterior
                  }}
                >
                  Anterior
                </button>
                <button
                  className="fc-button fc-button-primary"
                  onClick={() => {
                    const calendarApi = calendarRef.current?.getApi();
                    calendarApi?.next(); // Move para o próximo mês
                  }}
                >
                  Próximo
                </button>
              </div>

              {/* Botão "Hoje" Alinhado à Direita */}
              <button
                className="fc-button fc-button-primary"
                onClick={() => {
                  const calendarApi = calendarRef.current?.getApi();
                  calendarApi?.today(); // Retorna para o dia atual
                }}
              >
                Hoje
              </button>
            </div>
          </div>

          {/* Modal de Horários Disponíveis */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                {/* Botão de Fechar */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Horários Disponíveis para {selectedDate}</h2>
                <div className="space-y-2">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => {
                          setFormData({ ...formData, preferred_time: slot });
                          setIsBookingModalOpen(true);
                        }}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-700">Não há horários disponíveis para esta data.</p>
                  )}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}

          {/* Modal de Agendamento */}
          {isBookingModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                {/* Botão de Fechar */}
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Agendar para {selectedDate} às {formData.preferred_time}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Ensaio
                    </label>
                    <select
                      id="service_type"
                      name="service_type"
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
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
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Confirmar Agendamento
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}