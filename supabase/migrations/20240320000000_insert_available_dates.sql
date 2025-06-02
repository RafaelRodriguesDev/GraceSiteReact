-- Inserir datas disponíveis de hoje até 2027
DO $$ 
BEGIN
    -- Verificar se a tabela existe
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'available_dates') THEN
        DECLARE
            current_date_var date := CURRENT_DATE;
            end_date date := '2027-12-31';
            current_hour integer;
        BEGIN
            WHILE current_date_var <= end_date LOOP
                -- Pular finais de semana
                IF EXTRACT(DOW FROM current_date_var) NOT IN (0, 6) THEN
                    -- Inserir horários das 8h às 18h
                    FOR current_hour IN 8..17 LOOP
                        INSERT INTO available_dates (date, start_time, end_time, status)
                        VALUES (
                            current_date_var,
                            make_time(current_hour, 0, 0),
                            make_time(current_hour + 1, 0, 0),
                            'available'
                        )
                        ON CONFLICT (date, start_time, end_time) DO NOTHING;
                    END LOOP;
                END IF;
                
                -- Avançar para o próximo dia
                current_date_var := current_date_var + INTERVAL '1 day';
            END LOOP;
        END;
    END IF;
END;
$$;