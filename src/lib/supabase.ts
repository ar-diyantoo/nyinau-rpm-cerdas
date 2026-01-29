// Safe Supabase client with fallback configuration
// This handles the platform sync issue where env vars may temporarily be unavailable
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const getSupabaseUrl = (): string => {
  return import.meta.env.VITE_SUPABASE_URL || 
    "https://rrulxkrklolnxijcckwf.supabase.co";
};

const getSupabaseKey = (): string => {
  return import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJydWx4a3JrbG9sbnhpamNja3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzQyODMsImV4cCI6MjA3Njk1MDI4M30.xwgn-W_0mgjS0FKxjsD49Y0fzHdsRt0DLkXFMif-pbk";
};

// Create the client with fallback values
export const supabase: SupabaseClient<Database> = createClient<Database>(
  getSupabaseUrl(),
  getSupabaseKey(),
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
