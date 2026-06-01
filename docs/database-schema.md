# Database schema

The full Supabase/Postgres schema (DDL migrations, RLS policies, ER diagram and
seed data) lands in **PR4**. This document tracks the planned tables.

## Planned tables

| Table                                                     | Purpose                                                              |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| `profiles`                                                | User, age band (under_18/adult), role, referral, family/school links |
| `game_runs`                                               | One playthrough: age, four scores, cash, status, seed                |
| `game_decisions`                                          | Per-year decisions + applied deltas (audit trail)                    |
| `portfolios` / `portfolio_allocations`                    | 4 LifeVest funds + a run's allocation                                |
| `life_events`                                             | Generated/curated events (source: ai \| fallback)                    |
| `quiz_categories` / `quiz_questions` / `quiz_attempts`    | Quiz bank + results                                                  |
| `point_ledger`                                            | Append-only points (virtual vs redeemable)                           |
| `achievements` / `user_achievements`                      | Definitions + unlocks                                                |
| `leaderboards`                                            | Materialized view (global/school/family)                             |
| `daily_rewards`                                           | Streaks + claims                                                     |
| `referrals`                                               | Referral graph + reward state                                        |
| `families` / `family_members`                             | Family accounts                                                      |
| `schools` / `school_competitions` / `competition_entries` | School competitions                                                  |
| `rewards` / `reward_redemptions`                          | Catalog + admin-approved redemptions                                 |
| `coach_conversations` / `coach_messages`                  | AI coach history                                                     |
| `campaigns`                                               | Admin campaign analytics                                             |
| `audit_log`                                               | Staff actions                                                        |

All player-owned tables enforce **Row Level Security** so users access only
their own rows; staff/admin roles get scoped management access.
