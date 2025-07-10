import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Send,
  CheckCircle,
  Phone,
  Mail,
  User,
  MessageSquare,
  Camera,
} from "lucide-react";
import { SchedulingCalendar } from "../components/SchedulingCalendar";
import { SchedulingConfirmationModal } from "../components/SchedulingConfirmationModal";
import {
  availableDatesService,
  schedulingService,
  whatsappService,
} from "../services/schedulingService";
import {
  CalendarEvent,
  CreateScheduleInput,
  Schedule,
  SchedulingFormData,
  ServiceType,
} from "../types/scheduling";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
// import { useNotifications } from "../components/ui/Toast";

export function NewScheduling() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
    available_date_id?: string;
  } | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [formData, setFormData] = useState<SchedulingFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<
    "calendar" | "time" | "form" | "confirmation"
  >("calendar");

  // Estados para validação
  const [phoneError, setPhoneError] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimesForDate, setAvailableTimesForDate] = useState<
    CalendarEvent[]
  >([]);
  // const notifications = useNotifications();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const [availableDates, schedules] = await Promise.all([
        availableDatesService.getAvailableDates(startDate, endDate),
        schedulingService.getSchedulesByDateRange(startDate, endDate),
      ]);

      const calendarEvents: CalendarEvent[] = [
        ...availableDates
          .filter((date) => date.status === "available")
          .map((date) => ({
            id: date.id,
            title: "Horário Disponível",
            start: new Date(`${date.date}T${date.start_time}`),
            end: new Date(`${date.date}T${date.end_time}`),
            status: date.status,
            available_date_id: date.id,
          })),
        ...schedules
          .filter((schedule) => schedule.status === "confirmed")
          .map((schedule) => ({
            id: schedule.id,
            title: "Indisponível",
            start: new Date(`${schedule.created_at}`),
            end: new Date(`${schedule.created_at}`),
            status: "unavailable" as any,
          })),
      ];

      setEvents(calendarEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      alert("Erro ao carregar calendário. Tente recarregar a página.");
    } finally {
      setLoading(false);
    }
  };

  const blockedDates = ["2024-03-29", "2024-03-31", "2024-04-21", "2024-05-01"];

  const handleDateSelect = (slotInfo: { start: Date; end: Date }) => {
    console.log("handleDateSelect chamado com:", slotInfo);
    const selectedDate = slotInfo.start;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Não é possível agendar em datas passadas.");
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];
    if (blockedDates.includes(dateStr)) {
      alert("Esta data não está disponível para agendamento.");
      return;
    }

    if (selectedDate.getDay() === 0) {
      alert("Não realizamos agendamentos aos domingos.");
      return;
    }

    setSelectedDate(selectedDate);
    console.log("setSelectedDate chamado com:", selectedDate);

    // Gerar horários disponíveis
    const allTimes: CalendarEvent[] = [];
    for (let hour = 8; hour <= 18; hour++) {
      const startTime = new Date(selectedDate);
      startTime.setHours(hour, 0, 0, 0);
      const endTime = new Date(startTime);
      endTime.setHours(hour + 1);

      const isTimeSlotTaken = events.some((event) => {
        const eventStart = new Date(event.start);
        return (
          eventStart.toDateString() === selectedDate.toDateString() &&
          eventStart.getHours() === hour &&
          (event.status === "pending" || event.status === "confirmed")
        );
      });

      const existingEvent = events.find((event) => {
        const eventStart = new Date(event.start);
        return (
          eventStart.toDateString() === selectedDate.toDateString() &&
          eventStart.getHours() === hour &&
          !isTimeSlotTaken
        );
      });

      allTimes.push({
        id: existingEvent?.id || `time-${hour}`,
        title: isTimeSlotTaken ? "Horário Ocupado" : "Horário Disponível",
        start: startTime,
        end: endTime,
        status: isTimeSlotTaken ? "cancelled" : "pending",
        available_date_id: existingEvent?.available_date_id,
      });
    }

    setAvailableTimesForDate(allTimes);
    console.log("Mudando step para time");
    setStep("time");
  };

  const handleTimeSelect = (event: CalendarEvent) => {
    if (!event.available_date_id) {
      alert("Horário selecionado inválido.");
      return;
    }

    setSelectedSlot({
      start: event.start,
      end: event.end,
      available_date_id: event.available_date_id,
    });
    setStep("form");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phone = e.target.value.replace(/\D/g, "");

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

    const cleanPhone = phone.replace(/\D/g, "");
    const validation = whatsappService.validateBrazilianPhone(cleanPhone);

    if (!validation.isValid && cleanPhone.length > 0) {
      setPhoneError(validation.error || "Número inválido");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const formDataObj = new FormData(e.currentTarget);
    const phoneWithMask = formDataObj.get("phone") as string;
    const phone = phoneWithMask.replace(/\D/g, "");

    const phoneValidation = whatsappService.validateBrazilianPhone(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Número de telefone inválido");
      return;
    }

    const data: SchedulingFormData = {
      client_name: formDataObj.get("name") as string,
      client_email: formDataObj.get("email") as string,
      client_phone: phone,
      service_type: formDataObj.get("service_type") as ServiceType,
      message: formDataObj.get("message") as string,
      selected_date: selectedSlot.start,
    };

    setFormData(data);
    setStep("confirmation");
  };

  const handleConfirmScheduling = async () => {
    if (!formData || !selectedSlot) return;

    setIsSubmitting(true);

    try {
      const schedule = await schedulingService.create({
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        service_type: formData.service_type,
        message: formData.message,
        status: "pending",
        available_date_id: selectedSlot.available_date_id as string,
        preferred_date: selectedSlot.start.toISOString().split("T")[0],
        preferred_time: selectedSlot.start.toTimeString().split(" ")[0],
      });

      const whatsappLink = whatsappService.notifyPhotographer(schedule);
      window.open(whatsappLink, "_blank");

      setSubmitStatus("success");
      alert("Agendamento enviado! Entraremos em contato em breve.");

      // Reset form
      setSelectedSlot(null);
      setFormData(null);
      setStep("calendar");
      loadEvents();
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      alert(
        "Erro ao agendar. Tente novamente ou entre em contato via WhatsApp.",
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedSlot(null);
    setFormData(null);
    setAvailableTimesForDate([]);
  };

  const serviceTypeOptions = [
    { value: "casamento", label: "Casamento", icon: "💒" },
    { value: "ensaio", label: "Ensaio Fotográfico", icon: "📸" },
    { value: "evento", label: "Evento", icon: "🎉" },
    { value: "book", label: "Book Profissional", icon: "📷" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="py-16 px-4 text-center bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <Logo size="lg" className="mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-[HappyBirthday4] text-gray-900 mb-6">
            Agendamento
          </h1>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Vamos planejar juntas o seu ensaio fotográfico? Escolha a data e
            horário que melhor se adequa à sua agenda.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            <div
              className={`flex items-center space-x-2 ${step === "calendar" ? "text-gray-900" : step === "time" || step === "form" || step === "confirmation" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "calendar" ? "bg-gray-900 text-white" : step === "time" || step === "form" || step === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {step === "time" ||
                step === "form" ||
                step === "confirmation" ? (
                  <CheckCircle size={16} />
                ) : (
                  "1"
                )}
              </div>
              <span className="font-medium">Data</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${step === "time" ? "text-gray-900" : step === "form" || step === "confirmation" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "time" ? "bg-gray-900 text-white" : step === "form" || step === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {step === "form" || step === "confirmation" ? (
                  <CheckCircle size={16} />
                ) : (
                  "2"
                )}
              </div>
              <span className="font-medium">Horário</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${step === "form" ? "text-gray-900" : step === "confirmation" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "form" ? "bg-gray-900 text-white" : step === "confirmation" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                {step === "confirmation" ? <CheckCircle size={16} /> : "3"}
              </div>
              <span className="font-medium">Dados</span>
            </div>

            <div
              className={`flex items-center space-x-2 ${step === "confirmation" ? "text-gray-900" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "confirmation" ? "bg-gray-900 text-white" : "bg-gray-200"}`}
              >
                4
              </div>
              <span className="font-medium">Confirmar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Step 1: Calendar */}
        {step === "calendar" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Escolha uma data
              </h2>
              <p className="text-gray-600">
                Clique na data desejada para ver os horários disponíveis
              </p>
            </div>

            <SchedulingCalendar
              availableSlots={events}
              onSelectSlot={handleDateSelect}
              blockedDates={blockedDates}
            />
          </div>
        )}

        {/* Step 2: Time Selection */}
        {step === "time" && selectedDate && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Escolha um horário
              </h2>
              <p className="text-gray-600">
                Data selecionada:{" "}
                <strong>{selectedDate.toLocaleDateString("pt-BR")}</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTimesForDate.map((time) => {
                  const timeStr = time.start.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isAvailable = time.status === "pending";

                  return (
                    <button
                      key={time.id}
                      onClick={() => isAvailable && handleTimeSelect(time)}
                      disabled={!isAvailable}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isAvailable
                          ? "border-gray-200 hover:border-gray-900 hover:bg-gray-50"
                          : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Clock size={16} />
                        <span className="font-medium">{timeStr}</span>
                      </div>
                      {!isAvailable && (
                        <div className="text-xs mt-1">Ocupado</div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={resetForm}>
                  Voltar ao calendário
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Form */}
        {step === "form" && selectedSlot && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Seus dados
              </h2>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-blue-800">
                  <strong>Data:</strong>{" "}
                  {selectedSlot.start.toLocaleDateString("pt-BR")} às{" "}
                  {selectedSlot.start.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <User size={16} className="inline mr-2" />
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Phone size={16} className="inline mr-2" />
                    Telefone (com DDD)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(15) 99999-9999"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors ${
                      phoneError ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={handlePhoneChange}
                    required
                  />
                  {phoneError && (
                    <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="service_type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <Camera size={16} className="inline mr-2" />
                    Tipo de Ensaio
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceTypeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="service_type"
                          value={option.value}
                          className="text-gray-900 focus:ring-gray-400"
                          required
                        />
                        <span className="text-2xl">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    <MessageSquare size={16} className="inline mr-2" />
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Conte-me mais sobre o que você tem em mente para o ensaio..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("time")}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={!!phoneError}
                    className="flex-1"
                    rightIcon={<Send size={16} />}
                  >
                    Continuar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === "confirmation" && formData && selectedSlot && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Confirmar agendamento
              </h2>
              <p className="text-gray-600">
                Revise seus dados antes de finalizar
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Resumo do agendamento
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data:</span>
                      <span className="font-medium">
                        {selectedSlot.start.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horário:</span>
                      <span className="font-medium">
                        {selectedSlot.start.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">
                        {
                          serviceTypeOptions.find(
                            (s) => s.value === formData.service_type,
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">
                        {formData.client_name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">
                        {formData.client_email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Telefone:</span>
                      <span className="font-medium">
                        {formData.client_phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📱 Próximos passos
                  </h4>
                  <p className="text-blue-800 text-sm">
                    Após confirmar, você será redirecionado para o WhatsApp onde
                    poderemos conversar sobre os detalhes do seu ensaio.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("form")}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleConfirmScheduling}
                    loading={isSubmitting}
                    className="flex-1"
                    rightIcon={<Send size={16} />}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
