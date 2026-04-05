import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Blindaje contra errores de Prerendering
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ PAI: Supabase URL o Anon Key ausentes. El cliente no se inicializará.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);