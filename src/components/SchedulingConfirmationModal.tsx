import React from 'react';
import { X } from 'lucide-react';
import { ServiceType, SERVICE_TYPE_LABELS } from '../types/scheduling';

interface SchedulingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedDate: Date;
  formData: {
    client_name: string;
    service_type: ServiceType;
    client_phone: string;
  };
  isSubmitting: boolean;
}

export function SchedulingConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selectedDate,
  formData,
  isSubmitting
}: SchedulingConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold mb-6">Confirmar Agendamento</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Nome:</p>
            <p className="font-medium">{formData.client_name}</p>
          </div>

          <div>
            <p className="text-gray-600">Tipo de Ensaio:</p>
            <p className="font-medium">{SERVICE_TYPE_LABELS[formData.service_type]}</p>
          </div>

          <div>
            <p className="text-gray-600">Telefone:</p>
            <p className="font-medium">{formData.client_phone}</p>
          </div>

          <div>
            <p className="text-gray-600">Data e Horário:</p>
            <p className="font-medium">
              {selectedDate.toLocaleDateString('pt-BR')} às{' '}
              {selectedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
            
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}