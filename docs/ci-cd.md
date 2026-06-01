# CI/CD

## Continuous Integration (GitHub Actions)

`.github/workflows/ci.yml` runs on every push and pull request:

1. **Install** — `npm ci` (Node 22).
2. **Lint** — `npm run lint`.
3. **Typecheck** — `npm run typecheck`.
4. **Test** — `npm run test` (Vitest).
5. **Build** — `npm run build`.

The build step uses placeholder-free defaults so it succeeds without secrets
(the app builds in demo mode). Playwright e2e is added in PR6.

## Pre-commit hooks (Husky + lint-staged)

`.husky/pre-commit` runs `lint-staged`, which lints and formats only the staged
files. Install hooks locally with `npm install` (triggers `npm run prepare`).

## Continuous Deployment (Vercel)

- **Preview**: every pull request gets an isolated preview URL.
- **Production**: merges to `main` deploy automatically.

See [deployment.md](deployment.md) for environment configuration.
