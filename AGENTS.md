# Agent guide — LifeVest Quest

A mobile-first financial literacy game for Liberty Kenya, built on Next.js 15
(App Router), TypeScript, TailwindCSS v4, Phaser.js, Supabase, OpenAI and
PostHog.

## Commands

| Task       | Command             |
| ---------- | ------------------- |
| Dev server | `npm run dev`       |
| Build      | `npm run build`     |
| Lint       | `npm run lint`      |
| Typecheck  | `npm run typecheck` |
| Format     | `npm run format`    |
| Unit tests | `npm run test`      |

Run `npm run lint && npm run typecheck && npm run test && npm run build` before
opening a PR.

## Conventions

- **Demo mode first.** The game must stay fully playable with no external keys.
  Read integration flags from `src/lib/env.ts` and provide deterministic
  fallbacks rather than throwing.
- **Secrets are server-only.** Never read `OPENAI_API_KEY` or
  `SUPABASE_SERVICE_ROLE_KEY` from client components. OpenAI is called only from
  Server Actions / Route Handlers.
- **Server is authoritative** for scores, points and leaderboards. The client
  proposes decisions; the server validates and computes deltas.
- **Mobile-first.** Design for a ~390px viewport; enhance upward.
- Brand tokens live in `src/app/globals.css` (`text-navy`, `bg-brand`, `gold`…).

## Structure

- `src/app` — routes: `/(game)` player UI, `/(admin)` staff dashboard (later).
- `src/components` — UI kit, brand, providers.
- `src/lib` — env, supabase clients, game engine (later), utils.
- `docs/` — architecture, schema, deployment, CI/CD.
