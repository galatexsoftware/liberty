# Database schema

The Supabase/Postgres schema lives in `supabase/`:

- `supabase/migrations/0001_init.sql` — tables, enums, indexes and the
  `leaderboard` view.
- `supabase/migrations/0002_rls.sql` — Row Level Security policies + the
  `is_staff()` helper.
- `supabase/seed.sql` — reference data (portfolios, quiz bank, achievements,
  rewards) — safe to re-run (upserts).

Apply locally with the Supabase CLI:

```bash
supabase db reset          # runs migrations + seed against the local stack
# or, against a remote project:
supabase db push
psql "$DATABASE_URL" -f supabase/seed.sql
```

## Tables

| Table                                    | Purpose                                                            |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `profiles`                               | User, age band (`under_18`/`adult`), role, referral, family/school |
| `portfolios`                             | The 4 LifeVest funds (reference data)                              |
| `game_runs`                              | One playthrough: seed, four scores (jsonb), net worth, status      |
| `decisions`                              | Per-year allocation, portfolio, event/choice, return % (audit)     |
| `life_events`                            | Logged events per run (`source`: ai \| fallback)                   |
| `quiz_questions` / `quiz_attempts`       | Quiz bank + per-user attempts                                      |
| `points_ledger`                          | Append-only points (virtual vs redeemable), service-role writes    |
| `achievements` / `user_achievements`     | Definitions + per-user unlocks                                     |
| `daily_claims`                           | Daily reward streaks + claims (one row per user per day)           |
| `referrals`                              | Referral graph + reward state                                      |
| `families` / `schools`                   | Family accounts + school competition grouping                      |
| `rewards` / `reward_redemptions`         | Catalogue + admin-approved redemptions                             |
| `coach_conversations` / `coach_messages` | AI coach history (PR5)                                             |
| `campaigns`                              | Admin campaign config/analytics (PR5)                              |
| `audit_log`                              | Staff actions                                                      |
| `leaderboard` (view)                     | Each user's best completed run + school/family                     |

## Security model

- **RLS on** for every player-owned table. Users read/write only their own
  rows; `is_staff()` grants staff/admin read access for the dashboard.
- **Reference data** (`portfolios`, `quiz_questions`, `achievements`,
  `rewards`, `schools`) is world-readable.
- **Server is authoritative.** Points (`points_ledger`), achievement unlocks,
  redemption decisions and `audit_log` are written only via the service-role
  key (which bypasses RLS) from server routes — never from the client.

## TypeScript

`src/lib/db/types.ts` hand-mirrors these rows for the data layer. Once a live
project exists, `supabase gen types typescript` can regenerate it. In demo mode
(no keys) the app persists progress to `localStorage` via
`src/lib/data/local-progress.ts`, whose shapes match `points_ledger`,
`user_achievements` and `daily_claims`.
