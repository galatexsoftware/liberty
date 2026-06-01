-- Seed reference data for LifeVest Quest. Safe to run repeatedly (upserts).

-- Portfolios (mirror src/lib/game/constants.ts).
insert into portfolios (id, name, blurb, expected_return, volatility, downside_exposure, sort_order)
values
  ('cash', 'Cash Save', 'Steady and safe — low growth, low risk.', 0.0400, 0.0100, 0.100, 1),
  ('conservative', 'Conservative', 'Mostly bonds — gentle, dependable growth.', 0.0700, 0.0500, 0.300, 2),
  ('balanced', 'Balanced', 'A mix of growth and stability.', 0.1000, 0.1000, 0.550, 3),
  ('aggressive', 'Aggressive', 'Equity-heavy — highest growth, bumpiest ride.', 0.1400, 0.1800, 0.850, 4)
on conflict (id) do update set
  name = excluded.name,
  blurb = excluded.blurb,
  expected_return = excluded.expected_return,
  volatility = excluded.volatility,
  downside_exposure = excluded.downside_exposure,
  sort_order = excluded.sort_order;

-- Quiz questions (mirror src/lib/games/quiz-bank.ts).
insert into quiz_questions (id, topic, question, options, answer, explanation)
values
  ('q-compound', 'investing', 'What is ''compound growth''?',
   '["Earning returns only on the money you put in","Earning returns on both your money and past returns","A fee charged every year","Spending your savings slowly"]'::jsonb,
   1, 'Compounding means your returns earn returns too — the earlier you start, the more it snowballs.'),
  ('q-emergency-fund', 'saving', 'Why keep an emergency fund?',
   '["To buy luxury items","To cover surprise costs without selling investments","Because banks require it","To avoid paying taxes"]'::jsonb,
   1, 'An emergency fund lets you handle surprises without derailing your long-term investments.'),
  ('q-diversify', 'investing', 'What does ''diversifying'' your investments mean?',
   '["Putting everything into one hot stock","Spreading money across different assets to reduce risk","Only keeping cash","Investing only when markets are high"]'::jsonb,
   1, 'Spreading money around means one bad bet won''t sink your whole plan.'),
  ('q-insurance', 'protection', 'What is the main purpose of insurance?',
   '["To grow your wealth fastest","To protect you financially when something goes wrong","To avoid saving money","To guarantee high returns"]'::jsonb,
   1, 'Insurance transfers big, rare risks away from you — protecting the wealth you''ve built.'),
  ('q-inflation', 'planning', 'Why can keeping all your money as cash be risky long-term?',
   '["Cash can be stolen only","Inflation slowly reduces what cash can buy","Cash earns the highest returns","It isn''t risky at all"]'::jsonb,
   1, 'Inflation erodes cash''s buying power over time, so some growth investing helps you keep up.'),
  ('q-start-early', 'investing', 'Two people invest the same amount. Who usually ends with more?',
   '["The one who starts 10 years earlier","The one who starts later","They always end equal","The one who checks prices daily"]'::jsonb,
   0, 'Time in the market beats timing the market — starting early gives compounding more years to work.'),
  ('q-budget', 'planning', 'A simple budgeting rule is to...',
   '["Spend first, save whatever is left","Pay yourself first by saving before spending","Never track your money","Borrow to invest everything"]'::jsonb,
   1, '''Pay yourself first'' means setting aside savings before spending — it makes saving automatic.'),
  ('q-risk-return', 'investing', 'Generally, higher potential returns come with...',
   '["Lower risk","Higher risk","No risk","Guaranteed profit"]'::jsonb,
   1, 'Risk and return go together — choose a portfolio that matches your goals and comfort.')
on conflict (id) do update set
  topic = excluded.topic,
  question = excluded.question,
  options = excluded.options,
  answer = excluded.answer,
  explanation = excluded.explanation;

-- Achievements (mirror src/lib/achievements.ts).
insert into achievements (id, name, description, icon, points, criteria, sort_order)
values
  ('first-year', 'First Steps', 'Complete your first year of life.', 'sparkles', 50, '{"type":"yearsPlayed","gte":1}'::jsonb, 1),
  ('decade', 'Decade Done', 'Play through 10 years.', 'calendar', 100, '{"type":"yearsPlayed","gte":10}'::jsonb, 2),
  ('finisher', 'Lifetime Achiever', 'Reach age 65 and finish a full life.', 'flag', 300, '{"type":"completed"}'::jsonb, 3),
  ('first-invest', 'Investor', 'Put money into a LifeVest portfolio.', 'trending-up', 75, '{"type":"invested"}'::jsonb, 4),
  ('protected', 'Well Protected', 'Reach a Protection score of 60+.', 'shield', 100, '{"type":"score","key":"protection","gte":60}'::jsonb, 5),
  ('scholar', 'Money Scholar', 'Reach a Knowledge score of 70+.', 'graduation-cap', 100, '{"type":"score","key":"knowledge","gte":70}'::jsonb, 6),
  ('millionaire', 'Millionaire', 'Grow your net worth past KShs 1,000,000.', 'gem', 200, '{"type":"netWorth","gte":1000000}'::jsonb, 7),
  ('balanced-life', 'Balanced Life', 'Finish with every score above 50.', 'scale', 250, '{"type":"allScores","gte":50}'::jsonb, 8)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  points = excluded.points,
  criteria = excluded.criteria,
  sort_order = excluded.sort_order;

-- Sample rewards (adult redeemable catalogue).
insert into rewards (name, description, cost_points, stock, requires_approval)
values
  ('KShs 500 airtime', 'Redeem points for mobile airtime.', 2000, 100, true),
  ('LifeVest starter top-up', 'KShs 1,000 added to a new LifeVest plan.', 5000, 50, true),
  ('Liberty branded water bottle', 'Eco flask with the Liberty flame.', 1500, 200, true),
  ('Financial planning session', '30-min call with a Liberty advisor.', 3000, 30, true)
on conflict do nothing;

-- A demo school for school competitions.
insert into schools (name, county)
values ('Demo High School', 'Nairobi')
on conflict do nothing;
