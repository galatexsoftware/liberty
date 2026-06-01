# LifeVest Quest

A production-ready, **mobile-first financial literacy game** for **Liberty Kenya**,
teaching players aged 10+ the value of saving, investing, financial planning and
protection — anchored to Liberty's **LifeVest Investment Plan**.

Each round is one year of life (starting at age 10). Players **Spend, Save,
Invest, or Protect**, navigate AI-generated life events, play mini-games, and
chat with an AI financial coach while growing four scores: **Wealth, Knowledge,
Protection, Happiness**.

## Tech stack

Next.js 15 · TypeScript · TailwindCSS v4 · Phaser.js · Supabase · OpenAI ·
PostHog · Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — app runs in demo mode without keys
npm run dev                  # http://localhost:3000
```

### Demo vs live mode

The app is **fully playable without any keys** (demo mode: deterministic
fallbacks + local/seeded state). Provide the variables in `.env.example` to
enable Supabase persistence, the OpenAI-powered coach/life-events, and PostHog
analytics.

## Scripts

`dev` · `build` · `start` · `lint` · `typecheck` · `format` · `test`

## Documentation

- [Architecture](docs/architecture.md)
- [Database schema](docs/database-schema.md)
- [Deployment guide](docs/deployment.md)
- [CI/CD](docs/ci-cd.md)

## Roadmap (staged PRs)

1. **Foundation** ← _this PR_ — scaffold, brand theme, Supabase/PostHog wiring, PWA, CI.
2. Core game engine + year loop + AI life events.
3. Mini-games (Phaser runner, quiz, portfolio & compound simulators).
4. Supabase schema + RLS + seed; points, achievements, leaderboards, rewards, referrals, family, schools.
5. AI financial coach + admin dashboard.
6. E2E tests, analytics, deployment hardening.
