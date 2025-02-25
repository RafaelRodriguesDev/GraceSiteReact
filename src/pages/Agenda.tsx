import React, { useState } from 'react';
import { Calendar, Clock, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AgendaForm {
  name: string;
  email: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
}

export function Agenda() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data: AgendaForm = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      service_type: formData.get('service_type') as string,
      preferred_date: formData.get('preferred_date') as string,
      preferred_time: formData.get('preferred_time') as string,
      message: formData.get('message') as string,
    };

    try {
      const { error } = await supabase
        .from('schedules')
        .insert([data]);

      if (error) throw error;
      
      setSubmitStatus('success');
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-light text-center mb-8">Agendamento</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
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
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
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
              <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-1">
                Data Preferida
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="preferred_date"
                  name="preferred_date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-1">
                Horário Preferido
              </label>
              <div className="relative">
                <input
                  type="time"
                  id="preferred_time"
                  name="preferred_time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  required
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
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
                placeholder="Conte-nos mais sobre o que você está planejando..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}