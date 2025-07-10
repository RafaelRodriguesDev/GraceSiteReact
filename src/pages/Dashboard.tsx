import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  dashboardService,
  DashboardStats,
  ScheduleWithDate,
} from "../services/dashboardService";
import { whatsappService } from "../services/schedulingService";
import { ScheduleStatus } from "../types/scheduling";
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Filter,
  RefreshCw,
  Edit,
  MessageSquare,
  Camera,
} from "lucide-react";
import { formatPhoneNumber } from "../utils/phoneUtils";

const statusConfig = {
  available: {
    label: "Disponível",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    bgColor: "bg-green-50",
  },
  pending: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
  },
  confirmed: {
    label: "Confirmado",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    bgColor: "bg-green-50",
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    bgColor: "bg-red-50",
  },
  completed: {
    label: "Concluído",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    bgColor: "bg-blue-50",
  },
  awaiting_reschedule: {
    label: "Aguardando Reagendamento",
    color: "bg-orange-100 text-orange-800",
    icon: Edit,
    bgColor: "bg-orange-50",
  },
};

export function Dashboard() {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    awaiting_reschedule: 0,
  });
  const [schedules, setSchedules] = useState<ScheduleWithDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ScheduleStatus | "all">(
    "all",
  );
  const [refreshing, setRefreshing] = useState(false);

  // Estados para modais
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleWithDate | null>(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const [rescheduleMessage, setRescheduleMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, schedulesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getSchedules(
          filterStatus === "all" ? undefined : filterStatus,
        ),
      ]);

      setStats(statsData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Função para enviar mensagem via WhatsApp
  const sendWhatsAppMessage = async (phone: string, message: string) => {
    try {
      // Verifica se as variáveis de ambiente estão configuradas
      const apiUrl = import.meta.env.VITE_WHATSAPP_API_URL;
      const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

      if (!apiUrl || !accessToken) {
        // Se não estiver configurado, abre o WhatsApp Web
        const whatsappLink = whatsappService.generateWhatsAppLink(
          phone,
          message,
        );
        window.open(whatsappLink, "_blank");
        return { success: true, method: "web" };
      }

      // Tenta enviar via API do WhatsApp Business
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone.replace(/\D/g, ""),
          type: "text",
          text: {
            body: message,
          },
        }),
      });

      if (!response.ok) {
        // Se falhar, abre o WhatsApp Web como fallback
        const whatsappLink = whatsappService.generateWhatsAppLink(
          phone,
          message,
        );
        window.open(whatsappLink, "_blank");
        return { success: true, method: "web" };
      }

      return { success: true, method: "api" };
    } catch (error) {
      console.error("Erro ao enviar WhatsApp:", error);
      // Como fallback, abre o WhatsApp Web
      try {
        const whatsappLink = whatsappService.generateWhatsAppLink(
          phone,
          message,
        );
        window.open(whatsappLink, "_blank");
        return { success: true, method: "web" };
      } catch (fallbackError) {
        console.error("Erro no fallback do WhatsApp:", fallbackError);
        return {
          success: false,
          error: "Erro ao enviar mensagem via WhatsApp",
        };
      }
    }
  };

  // Função para cancelar agendamento
  const handleCancelSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      // Atualizar status no banco
      const result = await dashboardService.updateScheduleStatus(
        selectedSchedule.id,
        "cancelled",
      );

      if (result.success) {
        // Preparar mensagem de cancelamento personalizada
        const message =
          `😔 *Cancelamento de Agendamento*\n\n` +
          `Olá ${selectedSchedule.client_name}!\n\n` +
          `Infelizmente precisamos cancelar seu agendamento:\n\n` +
          `📸 *Serviço:* ${selectedSchedule.service_type}\n` +
          `📅 *Data/Hora:* ${formatDate(selectedSchedule.preferred_date)} às ${formatTime(selectedSchedule.preferred_time)}\n\n` +
          `*Motivo:* ${cancelMessage}\n\n` +
          `Para reagendar, acesse nosso site ou entre em contato conosco.\n\n` +
          `Obrigada pela compreensão! 💕`;

        // Enviar mensagem via WhatsApp
        const whatsappResult = await sendWhatsAppMessage(
          selectedSchedule.client_phone,
          message,
        );

        // Atualizar lista local
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === selectedSchedule.id
              ? { ...schedule, status: "cancelled" as ScheduleStatus }
              : schedule,
          ),
        );

        // Recarregar estatísticas
        const newStats = await dashboardService.getStats();
        setStats(newStats);

        // Fechar modal
        setShowCancelModal(false);
        setSelectedSchedule(null);
        setCancelMessage("");

        // Mostrar mensagem de sucesso baseada no método usado
        if (whatsappResult.success) {
          const method =
            whatsappResult.method === "api"
              ? "automaticamente"
              : "via WhatsApp Web";
          alert(
            `✅ Agendamento cancelado com sucesso!\n\n📱 Cliente notificado ${method}.\n\n💡 Dica: Salve o número do cliente (${formatPhoneNumber(selectedSchedule.client_phone)}) para futuro contato.`,
          );
        } else {
          alert(
            `⚠️ Agendamento cancelado, mas houve problema ao enviar WhatsApp.\n\n📱 Entre em contato manualmente: ${formatPhoneNumber(selectedSchedule.client_phone)}`,
          );
        }
      } else {
        alert(result.error || "Erro ao cancelar agendamento");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      alert("Erro ao cancelar agendamento");
    }
  };

  // Função para solicitar reagendamento
  const handleRescheduleRequest = async () => {
    if (!selectedSchedule) return;

    try {
      // Atualizar status para aguardando reagendamento
      const result = await dashboardService.updateScheduleStatus(
        selectedSchedule.id,
        "awaiting_reschedule",
      );

      if (result.success) {
        // Preparar mensagem de reagendamento personalizada
        const message =
          `🔄 *Solicitação de Reagendamento*\n\n` +
          `Olá ${selectedSchedule.client_name}!\n\n` +
          `Precisamos reagendar seu agendamento:\n\n` +
          `📸 *Serviço:* ${selectedSchedule.service_type}\n` +
          `📅 *Data/Hora Original:* ${formatDate(selectedSchedule.preferred_date)} às ${formatTime(selectedSchedule.preferred_time)}\n\n` +
          `*Motivo:* ${rescheduleMessage}\n\n` +
          `Por favor, acesse nosso site para escolher uma nova data ou entre em contato conosco.\n\n` +
          `Obrigada pela compreensão! 💕`;

        // Enviar mensagem via WhatsApp
        const whatsappResult = await sendWhatsAppMessage(
          selectedSchedule.client_phone,
          message,
        );

        // Atualizar lista local
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === selectedSchedule.id
              ? { ...schedule, status: "awaiting_reschedule" as ScheduleStatus }
              : schedule,
          ),
        );

        // Recarregar estatísticas
        const newStats = await dashboardService.getStats();
        setStats(newStats);

        // Fechar modal
        setShowRescheduleModal(false);
        setSelectedSchedule(null);
        setRescheduleMessage("");

        // Mostrar mensagem de sucesso baseada no método usado
        if (whatsappResult.success) {
          const method =
            whatsappResult.method === "api"
              ? "automaticamente"
              : "via WhatsApp Web";
          alert(
            `✅ Solicitação de reagendamento enviada!\n\n📱 Cliente notificado ${method}.\n\n💡 Dica: Salve o número do cliente (${formatPhoneNumber(selectedSchedule.client_phone)}) para futuro contato.`,
          );
        } else {
          alert(
            `⚠️ Reagendamento solicitado, mas houve problema ao enviar WhatsApp.\n\n📱 Entre em contato manualmente: ${formatPhoneNumber(selectedSchedule.client_phone)}`,
          );
        }
      } else {
        alert(result.error || "Erro ao solicitar reagendamento");
      }
    } catch (error) {
      console.error("Erro ao solicitar reagendamento:", error);
      alert("Erro ao solicitar reagendamento");
    }
  };

  // Função para abrir modal de cancelamento
  const openCancelModal = (schedule: ScheduleWithDate) => {
    setSelectedSchedule(schedule);
    setCancelMessage(
      "Devido a imprevistos, precisamos cancelar este agendamento.",
    );
    setShowCancelModal(true);
  };

  // Função para copiar número do cliente
  const copyClientPhone = (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    navigator.clipboard
      .writeText(formattedPhone)
      .then(() => {
        alert(`📋 Número copiado: ${formattedPhone}`);
      })
      .catch(() => {
        alert(`📱 Número do cliente: ${formattedPhone}`);
      });
  };

  // Função para abrir WhatsApp diretamente
  const openWhatsAppChat = (phone: string, name: string) => {
    const message = `Olá ${name}! 👋\n\nEspero que esteja bem! Entre em contato quando precisar de nossos serviços de fotografia.\n\nObrigada! 📸✨`;
    const whatsappLink = whatsappService.generateWhatsAppLink(phone, message);
    window.open(whatsappLink, "_blank");
  };

  // Função para abrir modal de reagendamento
  const openRescheduleModal = (schedule: ScheduleWithDate) => {
    setSelectedSchedule(schedule);
    setRescheduleMessage(
      "Devido a imprevistos, precisamos reagendar este agendamento. Tenho as seguintes datas disponíveis:",
    );
    setShowRescheduleModal(true);
  };

  const handleStatusChange = async (
    scheduleId: string,
    newStatus: ScheduleStatus,
  ) => {
    try {
      const result = await dashboardService.updateScheduleStatus(
        scheduleId,
        newStatus,
      );

      if (result.success) {
        // Atualizar a lista local
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === scheduleId
              ? { ...schedule, status: newStatus }
              : schedule,
          ),
        );

        // Recarregar estatísticas
        const newStats = await dashboardService.getStats();
        setStats(newStats);
      } else {
        alert(result.error || "Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                Gerencie seus agendamentos
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 min-w-[2.5rem]"
                title="Atualizar dados"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""} ${"lg:mr-2"}`}
                />
                <span className="hidden lg:inline ml-2">Atualizar</span>
              </button>

              <a
                href="/admin/propostas"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[2.5rem]"
                title="Gerenciar propostas"
              >
                <Edit className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline ml-2">Propostas</span>
              </a>

              <a
                href="/admin/albums"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[2.5rem]"
                title="Gerenciar álbuns"
              >
                <Camera className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline ml-2">Álbuns</span>
              </a>

              <a
                href="/admin/mosaico"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 min-w-[2.5rem]"
                title="Gerenciar mosaico"
              >
                <div className="h-4 w-4 lg:mr-2 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
                <span className="hidden lg:inline ml-2">Mosaico</span>
              </a>

              <button
                onClick={signOut}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 min-w-[2.5rem]"
                title="Sair do sistema"
              >
                <LogOut className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline ml-2">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Edit className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Aguardando Reagendamento
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.awaiting_reschedule}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Agendamentos
              </h2>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value as ScheduleStatus | "all")
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendentes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="awaiting_reschedule">
                    Aguardando Reagendamento
                  </option>
                  <option value="cancelled">Cancelados</option>
                  <option value="completed">Concluídos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedules List */}
          <div className="divide-y divide-gray-200">
            {schedules.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum agendamento encontrado
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filterStatus === "all"
                    ? "Não há agendamentos cadastrados ainda."
                    : `Não há agendamentos com status "${statusConfig[filterStatus as ScheduleStatus]?.label}".`}
                </p>
              </div>
            ) : (
              schedules.map((schedule) => {
                const config = statusConfig[schedule.status];
                const StatusIcon = config.icon;

                return (
                  <div key={schedule.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Conteúdo principal do card */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex-shrink-0 w-2 h-2 rounded-full ${config.color.split(" ")[0]}`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-2 sm:gap-0">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {schedule.client_name}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} self-start sm:self-auto`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </span>
                            </div>

                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {formatDate(schedule.preferred_date)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {formatTime(schedule.preferred_time)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">
                                  {formatPhoneNumber(schedule.client_phone)}
                                </span>
                              </div>
                              {schedule.client_email && (
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">
                                    {schedule.client_email}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Serviço:</span>{" "}
                              <span className="break-words">
                                {schedule.service_type}
                              </span>
                            </div>

                            {schedule.message && (
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-medium">Mensagem:</span>{" "}
                                <span className="break-words">
                                  {schedule.message}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Botões de ação - responsivos */}
                      <div className="flex flex-wrap gap-2 justify-start lg:justify-end lg:flex-nowrap lg:items-center">
                        {/* Botões de contato - sempre visíveis */}
                        <button
                          onClick={() =>
                            openWhatsAppChat(
                              schedule.client_phone,
                              schedule.client_name,
                            )
                          }
                          className="inline-flex items-center px-2 py-1 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100 min-h-[2rem] whitespace-nowrap"
                          title="Abrir WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => copyClientPhone(schedule.client_phone)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-gray-50 hover:bg-gray-100 min-h-[2rem] whitespace-nowrap"
                          title="Copiar número"
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Copiar
                        </button>

                        {/* Botões de ação específicos por status */}
                        {schedule.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(schedule.id, "confirmed")
                              }
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmar
                            </button>
                            <button
                              onClick={() => openRescheduleModal(schedule)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Alterar
                            </button>
                            <button
                              onClick={() => openCancelModal(schedule)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelar
                            </button>
                          </>
                        )}

                        {schedule.status === "confirmed" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(schedule.id, "completed")
                              }
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Concluir
                            </button>
                            <button
                              onClick={() => openRescheduleModal(schedule)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Alterar
                            </button>
                            <button
                              onClick={() => openCancelModal(schedule)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelar
                            </button>
                          </>
                        )}

                        {schedule.status === "awaiting_reschedule" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(schedule.id, "confirmed")
                              }
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">
                                Confirmar Nova Data
                              </span>
                              <span className="sm:hidden">Confirmar</span>
                            </button>
                            <button
                              onClick={() => openCancelModal(schedule)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 min-h-[2rem] whitespace-nowrap"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Cancelar Agendamento
                </h3>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {selectedSchedule && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Cliente:</strong> {selectedSchedule.client_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Data:</strong>{" "}
                    {formatDate(selectedSchedule.preferred_date)} às{" "}
                    {formatTime(selectedSchedule.preferred_time)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Serviço:</strong> {selectedSchedule.service_type}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem para o cliente:
                </label>
                <textarea
                  value={cancelMessage}
                  onChange={(e) => setCancelMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Digite a mensagem que será enviada ao cliente..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reagendamento */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Solicitar Reagendamento
                </h3>
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {selectedSchedule && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Cliente:</strong> {selectedSchedule.client_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Data Atual:</strong>{" "}
                    {formatDate(selectedSchedule.preferred_date)} às{" "}
                    {formatTime(selectedSchedule.preferred_time)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Serviço:</strong> {selectedSchedule.service_type}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem para o cliente:
                </label>
                <textarea
                  value={rescheduleMessage}
                  onChange={(e) => setRescheduleMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Digite a mensagem com as novas opções de data..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRescheduleRequest}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                >
                  Enviar Solicitação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
