"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { isPostHogConfigured, posthogHost, posthogKey } from "@/lib/env";

/**
 * Initializes PostHog on the client when configured. No-op in demo mode so the
 * app never breaks without analytics keys.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isPostHogConfigured) return;
    if (posthog.__loaded) return;

    posthog.init(posthogKey!, {
      api_host: posthogHost,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
  }, []);

  return <>{children}</>;
}
