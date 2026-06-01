# Deployment guide

LifeVest Quest deploys to **Vercel**, backed by **Supabase**.

## 1. Supabase

1. Create a Supabase project.
2. Apply migrations from `supabase/migrations` (added in PR4) via the Supabase
   CLI or dashboard.
3. Collect: Project URL, `anon` key, `service_role` key.

## 2. Environment variables

Set these in Vercel (Project → Settings → Environment Variables) — see
`.env.example`:

| Variable                        | Scope  | Notes                     |
| ------------------------------- | ------ | ------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Public | Supabase project URL      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Browser client            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server | Privileged writes only    |
| `OPENAI_API_KEY`                | Server | AI coach + life events    |
| `OPENAI_MODEL`                  | Server | Defaults to `gpt-4o-mini` |
| `NEXT_PUBLIC_POSTHOG_KEY`       | Public | Analytics                 |
| `NEXT_PUBLIC_POSTHOG_HOST`      | Public | Defaults to US cloud      |

> The app runs in **demo mode** if Supabase vars are omitted.

## 3. Vercel

1. Import the GitHub repo into Vercel.
2. Framework preset: **Next.js** (auto-detected).
3. Add the environment variables above.
4. Every PR gets a **preview deployment**; `main` deploys to production.

## 4. Build

```bash
npm run build && npm run start
```
