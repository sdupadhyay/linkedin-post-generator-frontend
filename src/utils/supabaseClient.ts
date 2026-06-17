import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Fetches Supabase credentials from the Express server's /api/config endpoint
 * and initializes the Supabase client instance.
 */
export async function initSupabase(): Promise<SupabaseClient> {
  if (supabaseInstance) return supabaseInstance;

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api/config`);
    if (!response.ok) {
      throw new Error(`Config API returned status ${response.status}`);
    }
    
    const config = await response.json();
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error('Supabase URL or Anon Key is missing in the backend config response.');
    }
    
    supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseInstance;
  } catch (err: any) {
    console.error('Failed to initialize Supabase client:', err);
    throw err;
  }
}

/**
 * Returns the initialized Supabase client instance.
 * Throws an error if getSupabase() is called before initSupabase().
 */
export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error('Supabase client has not been initialized. Call initSupabase() first.');
  }
  return supabaseInstance;
}
