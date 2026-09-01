import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim() || 'placeholder-anon-key';

// Format URL safely if user pasted only project reference ID (e.g. 'mfimkhkqnocgbtgnhklu')
const formatUrl = (url: string): string => {
  if (!url) return 'https://placeholder-project.supabase.co';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}.supabase.co`;
};

const supabaseUrl = formatUrl(rawUrl);

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
