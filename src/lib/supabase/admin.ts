import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseServiceConfigured, serverEnv, supabaseUrl } from "@/lib/env";

/**
 * Service-role Supabase client (server-only). Bypasses RLS, so it is the only
 * writer for points, achievements, redemption decisions and audit logs.
 *
 * Returns `null` in demo mode (no service-role key) so callers branch to
 * deterministic/local fallbacks instead of throwing.
 */
export function createAdminClient() {
  if (!isSupabaseServiceConfigured || !supabaseUrl) return null;
  return createSupabaseClient(supabaseUrl, serverEnv.supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
