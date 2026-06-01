# Architecture

LifeVest Quest is a Next.js 15 (App Router) application deployed on Vercel, with
Supabase as the backend and OpenAI + PostHog as supporting services.

```
Next.js 15 (Vercel)
├── (game)   Player PWA — mobile-first UI + Phaser mini-games
├── (admin)  Liberty staff dashboard (role-gated)            [PR5]
└── server   Route Handlers + Server Actions
     ├── /api/coach        → OpenAI (financial coach)        [PR5]
     ├── /api/life-event   → OpenAI (life-event generation)  [PR2]
     └── game mutations    → Supabase (scores, points)       [PR2+]

Supabase: Postgres + RLS, Auth, Storage, Edge Functions
OpenAI:   coach chat + structured life-event generation
PostHog:  product analytics, funnels, feature flags
```

## Principles

- **Server-authoritative game state.** Scores, points and leaderboards are
  computed and validated on the server to prevent cheating.
- **Secrets stay server-side.** OpenAI and the Supabase service-role key are
  never shipped to the browser.
- **Resilient AI.** Every AI call has a deterministic fallback so the game works
  without OpenAI.
- **Demo mode.** With no Supabase keys the app runs on local/seeded data.

## Layers

| Layer        | Location                                        | Notes                                    |
| ------------ | ----------------------------------------------- | ---------------------------------------- |
| Env / config | `src/lib/env.ts`                                | Integration flags + demo-mode detection  |
| Data clients | `src/lib/supabase/*`                            | Browser + server (cookie-bound) clients  |
| Analytics    | `src/components/providers/posthog-provider.tsx` | Client init, no-op without key           |
| Game engine  | `src/lib/game/*`                                | Pure, unit-tested scoring/compound (PR2) |
| UI kit       | `src/components/ui/*`                           | Brand-themed primitives                  |

_Expanded in later PRs as systems land._
