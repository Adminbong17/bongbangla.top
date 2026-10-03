/**
 * Lovable standard Supabase client integration
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = window.SUPABASE_URL || localStorage.getItem('bongbangla_supabase_url') || '';
const supabaseAnonKey = window.SUPABASE_ANON_KEY || localStorage.getItem('bongbangla_supabase_anon_key') || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
