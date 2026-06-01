"use client";

import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Browser-side Supabase client.
 *
 * Returns `null` in demo mode (no Supabase env vars) so UI can fall back to
 * local/seeded state instead of throwing.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
