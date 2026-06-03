import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Clean the URL if it ends with /rest/v1/ to prevent API routing conflicts
const cleanSupabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey);
