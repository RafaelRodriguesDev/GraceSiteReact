import { supabase } from "../lib/supabase";
import { Schedule, ScheduleStatus } from "../types/scheduling";

export interface DashboardStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  awaiting_reschedule: number;
}

export interface ScheduleWithDate extends Schedule {
  available_date?: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

export const dashboardService = {
  // Testar conexão com banco de dados
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("schedules")
        .select("count(*)", { count: "exact", head: true });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Erro na conexão com banco de dados:", errorMessage);
      return {
        success: false,
        error: `Erro de conexão: ${errorMessage}`,
      };
    }
  },

  // Buscar estatísticas do dashboard
  async getStats(): Promise<DashboardStats> {
    try {
      const { data: schedules, error } = await supabase
        .from("schedules")
        .select("status");

      if (error) throw error;

      const stats = schedules.reduce(
        (acc, schedule) => {
          acc.total++;
          switch (schedule.status) {
            case "pending":
              acc.pending++;
              break;
            case "confirmed":
              acc.confirmed++;
              break;
            case "cancelled":
              acc.cancelled++;
              break;
            case "completed":
              acc.completed++;
              break;
            case "awaiting_reschedule":
              acc.awaiting_reschedule++;
              break;
          }
          return acc;
        },
        {
          total: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
          awaiting_reschedule: 0,
        },
      );

      return stats;
    } catch (error) {
      console.error(
        "Erro ao buscar estatísticas:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Erro ao buscar estatísticas: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  },

  // Buscar agendamentos com filtros
  async getSchedules(
    status?: ScheduleStatus,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ScheduleWithDate[]> {
    try {
      let query = supabase
        .from("schedules")
        .select(
          `
          *,
          available_date:available_dates(
            date,
            start_time,
            end_time
          )
        `,
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(
        "Erro ao buscar agendamentos:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Erro ao buscar agendamentos: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  },

  // Buscar agendamentos recentes (últimos 7 dias)
  async getRecentSchedules(): Promise<ScheduleWithDate[]> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          available_date:available_dates(
            date,
            start_time,
            end_time
          )
        `,
        )
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(
        "Erro ao buscar agendamentos recentes:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Erro ao buscar agendamentos recentes: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  },

  // Atualizar status do agendamento
  async updateScheduleStatus(
    scheduleId: string,
    status: ScheduleStatus,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("schedules")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", scheduleId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Erro ao atualizar status:", errorMessage);
      return {
        success: false,
        error: `Erro ao atualizar status: ${errorMessage}`,
      };
    }
  },

  // Buscar agendamento por ID
  async getScheduleById(scheduleId: string): Promise<ScheduleWithDate | null> {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          available_date:available_dates(
            date,
            start_time,
            end_time
          )
        `,
        )
        .eq("id", scheduleId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(
        "Erro ao buscar agendamento:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Erro ao buscar agendamento: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  },

  // Buscar agendamentos por data
  async getSchedulesByDate(date: string): Promise<ScheduleWithDate[]> {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          available_date:available_dates(
            date,
            start_time,
            end_time
          )
        `,
        )
        .eq("preferred_date", date)
        .order("preferred_time", { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error(
        "Erro ao buscar agendamentos por data:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `Erro ao buscar agendamentos por data: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
    }
  },

  // Buscar agendamentos pendentes
  async getPendingSchedules(): Promise<ScheduleWithDate[]> {
    return this.getSchedules("pending");
  },

  // Buscar agendamentos confirmados
  async getConfirmedSchedules(): Promise<ScheduleWithDate[]> {
    return this.getSchedules("confirmed");
  },

  // Deletar agendamento (apenas para casos extremos)
  async deleteSchedule(
    scheduleId: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Erro ao deletar agendamento:", errorMessage);
      return {
        success: false,
        error: `Erro ao deletar agendamento: ${errorMessage}`,
      };
    }
  },
};
