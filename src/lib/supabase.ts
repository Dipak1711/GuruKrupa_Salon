import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Format URL safely if user pasted only project reference ID (e.g. 'mfimkhkqnocgbtgnhklu')
const formatUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}.supabase.co`;
};

const supabaseUrl = formatUrl(rawUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[SUPABASE CONFIG ERROR] Missing required Supabase environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel Environment Variables settings and trigger a redeploy.'
  );
}

// Initialize Supabase Client
export const supabase = createClient(
  supabaseUrl || 'https://missing-supabase-url.invalid',
  supabaseAnonKey || 'missing-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
