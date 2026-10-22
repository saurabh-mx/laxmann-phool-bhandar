import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabase is optional in the starter. The booking form still works through WhatsApp without it.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
