import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kaoiesjfpnvjhljycynt.supabase.co';
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'Fal87maRDt1SvsJwUHM2Sm36uJxfdfvs4GwC4ntn0pLW1E9xIUYyvKrDdwHcGaizEpnuxz9eWV+OfvxO9HCawQ==';

// export const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Configuração do Supabase:", {
    url: supabaseUrl ? "Definida" : "Ausente",
    key: supabaseKey ? "Definida" : "Ausente",
  });
  throw new Error(
    "Variáveis de ambiente do Supabase ausentes. Verifique o arquivo .env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
