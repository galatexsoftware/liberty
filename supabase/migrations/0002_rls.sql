-- Row Level Security. The service-role key (server-only) bypasses RLS and is
-- the only writer for points, achievements, redemptions decisions and audit.

-- Helper: is the current user staff or admin?
create or replace function is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

-- Enable RLS everywhere that holds user data.
alter table profiles enable row level security;
alter table game_runs enable row level security;
alter table decisions enable row level security;
alter table life_events enable row level security;
alter table quiz_attempts enable row level security;
alter table points_ledger enable row level security;
alter table user_achievements enable row level security;
alter table daily_claims enable row level security;
alter table referrals enable row level security;
alter table reward_redemptions enable row level security;
alter table coach_conversations enable row level security;
alter table coach_messages enable row level security;
alter table families enable row level security;

-- Reference data is world-readable.
alter table portfolios enable row level security;
alter table quiz_questions enable row level security;
alter table achievements enable row level security;
alter table rewards enable row level security;
alter table schools enable row level security;
create policy "ref portfolios readable" on portfolios for select using (true);
create policy "ref quiz readable" on quiz_questions for select using (active or is_staff());
create policy "ref achievements readable" on achievements for select using (true);
create policy "ref rewards readable" on rewards for select using (active or is_staff());
create policy "ref schools readable" on schools for select using (true);

-- Profiles: read your own + staff read all; update only your own.
create policy "profiles select own" on profiles
  for select using (id = auth.uid() or is_staff());
create policy "profiles insert own" on profiles
  for insert with check (id = auth.uid());
create policy "profiles update own" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Game runs / decisions / events: owner read+write, staff read.
create policy "runs rw own" on game_runs
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "runs staff read" on game_runs
  for select using (is_staff());

create policy "decisions rw own" on decisions
  for all using (
    exists (select 1 from game_runs r where r.id = run_id and r.user_id = auth.uid())
  )
  with check (
    exists (select 1 from game_runs r where r.id = run_id and r.user_id = auth.uid())
  );

create policy "events rw own" on life_events
  for all using (
    exists (select 1 from game_runs r where r.id = run_id and r.user_id = auth.uid())
  )
  with check (
    exists (select 1 from game_runs r where r.id = run_id and r.user_id = auth.uid())
  );

-- Quiz attempts: insert + read your own.
create policy "quiz attempts own" on quiz_attempts
  for select using (user_id = auth.uid() or is_staff());
create policy "quiz attempts insert own" on quiz_attempts
  for insert with check (user_id = auth.uid());

-- Points ledger: read your own (and staff). Writes happen via service role only.
create policy "points read own" on points_ledger
  for select using (user_id = auth.uid() or is_staff());

-- Achievements unlocked: read your own + staff.
create policy "user achievements read" on user_achievements
  for select using (user_id = auth.uid() or is_staff());

-- Daily claims: read+insert your own.
create policy "daily claims own" on daily_claims
  for select using (user_id = auth.uid());
create policy "daily claims insert own" on daily_claims
  for insert with check (user_id = auth.uid());

-- Referrals: referrer reads their own; staff read all.
create policy "referrals read" on referrals
  for select using (referrer_id = auth.uid() or referred_id = auth.uid() or is_staff());

-- Reward redemptions: user reads+creates own; staff read all (decisions via service role).
create policy "redemptions read" on reward_redemptions
  for select using (user_id = auth.uid() or is_staff());
create policy "redemptions insert own" on reward_redemptions
  for insert with check (user_id = auth.uid());

-- Coach: owner read+write their conversations/messages.
create policy "coach convo own" on coach_conversations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "coach msg own" on coach_messages
  for all using (
    exists (
      select 1 from coach_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from coach_conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- Families: members read; owner updates.
create policy "families read" on families
  for select using (
    owner_id = auth.uid()
    or exists (select 1 from profiles p where p.family_id = families.id and p.id = auth.uid())
    or is_staff()
  );
create policy "families owner write" on families
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
