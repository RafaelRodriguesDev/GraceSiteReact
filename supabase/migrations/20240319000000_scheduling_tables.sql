-- Criar enum para status do agendamento
DO $$ BEGIN
    CREATE TYPE schedule_status as enum ('available', 'pending', 'confirmed', 'unavailable');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar tabela de datas disponíveis
create table if not exists available_dates (
    id uuid default gen_random_uuid() primary key,
    date date not null,
    start_time time not null,
    end_time time not null,
    status schedule_status default 'available',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint unique_date_time unique (date, start_time, end_time)
);

-- Criar tabela de agendamentos
create table if not exists schedules (
    id uuid default gen_random_uuid() primary key,
    available_date_id uuid references available_dates(id),
    client_name text not null,
    client_email text,
    client_phone text not null,
    service_type text not null,
    message text,
    status schedule_status default 'pending',
    whatsapp_notification_sent boolean default false,
    whatsapp_confirmation_sent boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices para melhor performance
create index if not exists idx_available_dates_date on available_dates(date);
create index if not exists idx_available_dates_status on available_dates(status);
create index if not exists idx_schedules_status on schedules(status);
create index if not exists idx_schedules_client_phone on schedules(client_phone);

-- Criar função para atualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Criar triggers para atualizar updated_at
drop trigger if exists update_available_dates_updated_at on available_dates;
create trigger update_available_dates_updated_at
    before update on available_dates
    for each row
    execute function update_updated_at_column();

drop trigger if exists update_schedules_updated_at on schedules;
create trigger update_schedules_updated_at
    before update on schedules
    for each row
    execute function update_updated_at_column();

-- Criar políticas de segurança (RLS)
alter table available_dates enable row level security;
alter table schedules enable row level security;

-- Políticas para available_dates
drop policy if exists "Datas disponíveis são visíveis para todos" on available_dates;
create policy "Datas disponíveis são visíveis para todos"
    on available_dates for select
    using (true);

drop policy if exists "Apenas administradores podem modificar datas disponíveis" on available_dates;
create policy "Apenas administradores podem modificar datas disponíveis"
    on available_dates for all
    using (auth.role() = 'authenticated');

-- Políticas para schedules
drop policy if exists "Agendamentos são visíveis para administradores" on schedules;
create policy "Agendamentos são visíveis para administradores"
    on schedules for select
    using (auth.role() = 'authenticated');

drop policy if exists "Clientes podem criar agendamentos" on schedules;
create policy "Clientes podem criar agendamentos"
    on schedules for insert
    with check (true);

drop policy if exists "Apenas administradores podem modificar agendamentos" on schedules;
create policy "Apenas administradores podem modificar agendamentos"
    on schedules for update
    using (auth.role() = 'authenticated');