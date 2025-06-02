-- Atualizar o enum schedule_status para incluir os novos status
ALTER TYPE schedule_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE schedule_status ADD VALUE IF NOT EXISTS 'completed';
ALTER TYPE schedule_status ADD VALUE IF NOT EXISTS 'awaiting_reschedule';

-- Comentário: Esta migração adiciona os novos valores ao enum schedule_status:
-- - 'cancelled': Para agendamentos cancelados
-- - 'completed': Para agendamentos concluídos
-- - 'awaiting_reschedule': Para agendamentos aguardando reagendamento