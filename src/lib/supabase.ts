import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kaoiesjfpnvjhljycynt.supabase.co';
const supabaseKey = 'Fal87maRDt1SvsJwUHM2Sm36uJxfdfvs4GwC4ntn0pLW1E9xIUYyvKrDdwHcGaizEpnuxz9eWV+OfvxO9HCawQ==';

export const supabase = createClient(supabaseUrl, supabaseKey);