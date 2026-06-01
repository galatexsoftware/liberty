/**
 * Centralized environment access with graceful demo-mode fallback.
 *
 * The game must remain fully playable even when external services are not
 * configured (no Supabase / OpenAI / PostHog keys). Each integration exposes
 * an `isConfigured` flag so callers can branch to deterministic fallbacks
 * instead of crashing.
 *
 * NEXT_PUBLIC_* values are inlined by Next at build time and safe for the
 * browser. Server-only secrets (service role, OpenAI) must never be read from
 * client components.
 */

const optional = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const supabaseUrl = optional(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = optional(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const posthogKey = optional(process.env.NEXT_PUBLIC_POSTHOG_KEY);
export const posthogHost =
  optional(process.env.NEXT_PUBLIC_POSTHOG_HOST) ?? "https://us.i.posthog.com";

/** True when the public Supabase client can be constructed. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** True when product analytics should be enabled. */
export const isPostHogConfigured = Boolean(posthogKey);

/**
 * Server-only secrets. Importing this object from a client component is a
 * mistake; the values will be `undefined` in the browser.
 */
export const serverEnv = {
  openAiApiKey: optional(process.env.OPENAI_API_KEY),
  openAiModel: optional(process.env.OPENAI_MODEL) ?? "gpt-4o-mini",
  supabaseServiceRoleKey: optional(process.env.SUPABASE_SERVICE_ROLE_KEY),
};

export const isOpenAiConfigured = Boolean(serverEnv.openAiApiKey);
export const isSupabaseServiceConfigured = Boolean(serverEnv.supabaseServiceRoleKey);

/** Single source of truth for whether the app runs in demo mode. */
export const isDemoMode = !isSupabaseConfigured;
