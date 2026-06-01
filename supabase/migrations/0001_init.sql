-- LifeVest Quest — core schema
-- Postgres / Supabase. Server is authoritative for scores, points and rewards.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------
create table if not exists portfolios (
  id text primary key,
  name text not null,
  blurb text not null,
  expected_return numeric(5, 4) not null,
  volatility numeric(5, 4) not null,
  downside_exposure numeric(4, 3) not null,
  sort_order int not null default 0
);

create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  county text,
  created_at timestamptz not null default now()
);

create table if not exists families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
create type age_band as enum ('under_18', 'adult');
create type user_role as enum ('player', 'staff', 'admin');

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  age_band age_band not null default 'under_18',
  role user_role not null default 'player',
  family_id uuid references families (id) on delete set null,
  school_id uuid references schools (id) on delete set null,
  referral_code text unique default encode(gen_random_bytes(4), 'hex'),
  referred_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Gameplay
-- ---------------------------------------------------------------------------
create type run_status as enum ('active', 'completed', 'abandoned');

create table if not exists game_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  seed bigint not null,
  start_age int not null default 10,
  end_age int not null default 65,
  status run_status not null default 'active',
  final_age int,
  net_worth bigint not null default 0,
  scores jsonb not null default '{}'::jsonb,
  overall_score int not null default 0,
  points_earned int not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists game_runs_user_idx on game_runs (user_id);
create index if not exists game_runs_score_idx on game_runs (overall_score desc);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references game_runs (id) on delete cascade,
  age int not null,
  allocation jsonb not null,
  portfolio text not null references portfolios (id),
  event_id text,
  choice_id text,
  investment_return_pct numeric(6, 4),
  created_at timestamptz not null default now()
);

create index if not exists decisions_run_idx on decisions (run_id);

create table if not exists life_events (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references game_runs (id) on delete cascade,
  age int not null,
  category text not null,
  title text not null,
  source text not null default 'fallback',
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Quiz
-- ---------------------------------------------------------------------------
create table if not exists quiz_questions (
  id text primary key,
  topic text not null,
  question text not null,
  options jsonb not null,
  answer int not null,
  explanation text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null references quiz_questions (id) on delete cascade,
  correct boolean not null,
  time_ms int,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Points — append-only ledger (server/service-role writes only)
-- ---------------------------------------------------------------------------
create type points_type as enum ('virtual', 'redeemable');

create table if not exists points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  delta int not null,
  type points_type not null,
  reason text not null,
  ref_table text,
  ref_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists points_ledger_user_idx on points_ledger (user_id);

-- ---------------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------------
create table if not exists achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon text,
  points int not null default 0,
  criteria jsonb not null default '{}'::jsonb,
  sort_order int not null default 0
);

create table if not exists user_achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null references achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- Daily rewards, referrals, rewards store
-- ---------------------------------------------------------------------------
create table if not exists daily_claims (
  user_id uuid not null references auth.users (id) on delete cascade,
  claim_date date not null default current_date,
  streak int not null default 1,
  points int not null default 0,
  primary key (user_id, claim_date)
);

create type referral_status as enum ('pending', 'completed');

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referred_id uuid references auth.users (id) on delete set null,
  status referral_status not null default 'pending',
  reward_points int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  cost_points int not null,
  stock int,
  active boolean not null default true,
  requires_approval boolean not null default true,
  created_at timestamptz not null default now()
);

create type redemption_status as enum ('pending', 'approved', 'rejected', 'fulfilled');

create table if not exists reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  reward_id uuid not null references rewards (id) on delete restrict,
  status redemption_status not null default 'pending',
  points_spent int not null,
  created_at timestamptz not null default now(),
  decided_by uuid references auth.users (id) on delete set null,
  decided_at timestamptz
);

-- ---------------------------------------------------------------------------
-- AI coach
-- ---------------------------------------------------------------------------
create table if not exists coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references coach_conversations (id) on delete cascade,
  role text not null check (role in ('system', 'user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admin: campaigns + audit
-- ---------------------------------------------------------------------------
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leaderboard view: each user's best completed run, with school/family.
-- ---------------------------------------------------------------------------
create or replace view leaderboard as
select
  r.user_id,
  p.display_name,
  p.username,
  p.school_id,
  s.name as school_name,
  p.family_id,
  max(r.overall_score) as best_score,
  max(r.net_worth) as best_net_worth,
  count(r.id) as runs
from game_runs r
join profiles p on p.id = r.user_id
left join schools s on s.id = p.school_id
where r.status = 'completed'
group by r.user_id, p.display_name, p.username, p.school_id, s.name, p.family_id;
