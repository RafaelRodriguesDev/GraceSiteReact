import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: 'available' | 'unavailable' | 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'awaiting_reschedule';
}

interface SchedulingCalendarProps {
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  availableSlots: Event[];
  blockedDates?: string[];
}

export function SchedulingCalendar({ onSelectSlot, availableSlots, blockedDates = [] }: SchedulingCalendarProps) {
  const [view, setView] = useState<string>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const eventStyleGetter = (event: Event) => {
    let backgroundColor = '';
    let textColor = 'white';
    
    switch (event.status) {
      case 'available':
        backgroundColor = '#10B981'; // Verde para disponível
        break;
      case 'unavailable':
        backgroundColor = '#6B7280'; // Cinza para indisponível
        break;
      default:
        backgroundColor = '#6B7280'; // Cinza padrão
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: textColor,
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // Ajusta o horário final para 1 hora após o início
    const endTime = new Date(slotInfo.start.getTime() + 60 * 60 * 1000);
    onSelectSlot({ start: slotInfo.start, end: endTime });
  };

  const dayPropGetter = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isBlocked = blockedDates?.includes(dateStr) || date.getDay() === 0;
    const isBeforeToday = date < new Date(new Date().setHours(0, 0, 0, 0));

    if (isBlocked || isBeforeToday) {
      return {
        style: {
          backgroundColor: '#F3F4F6', // Cinza claro
          cursor: 'not-allowed',
          color: '#9CA3AF', // Texto cinza
          textDecoration: 'line-through'
        },
        className: 'blocked-date'
      };
    }
    return {};
  };

  return (
    <div className="h-[600px] bg-white rounded-lg shadow-lg p-4">
      <Calendar
        localizer={localizer}
        events={availableSlots}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        views={['month', 'week', 'day']}
        view={view as any}
        date={date}
        onView={(newView) => setView(newView)}
        onNavigate={(newDate) => setDate(newDate)}
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        step={60} // Define intervalo de 1 hora
        timeslots={1} // Mostra apenas um slot por hora
        messages={{
          next: 'Próximo',
          previous: 'Anterior',
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          noEventsInRange: 'Não há horários disponíveis neste período.',
        }}
      />
    </div>
  );
}