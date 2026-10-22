# Real estate agency demo

The same real estate agency website built twice, to compare React with TanStack Start against Remix v3.

- Visitors browse listings and search them by location (a geographical zone or a city).
- Admins manage listings from an admin section.
- Both apps share one Supabase backend and one `domain` package.

## Stack

| Package                      | Role                                                             | Dev URL               |
| ---------------------------- | ---------------------------------------------------------------- | --------------------- |
| `packages/domain`            | Business logic, Zod models, validation and Supabase data access. | -                     |
| `packages/frontend-tanstack` | The site in React with TanStack Start, Router, Query and Form.   | http://localhost:3000 |
| `packages/frontend-remix`    | The site in Remix v3, rendered with `remix/component`.           | http://localhost:4000 |

- Supabase is the backend, and Postgres RLS policies are the trust boundary, never app code.
- Both apps are styled with Tailwind CSS 4.
- The apps never query Supabase directly: they call the `domain` data-access functions.
- `domain` is imported by subpath (`@remix-v3-demo/domain/listing/list-listings`), and `listing/` holds the model, validators, `list-listings`, `get-listing-by-id`, `get-listing-image` and the price and address formatters.

## Getting started

The project runs in a devcontainer, which starts Supabase and both apps beside it.

1. Open the repository in VS Code and run **Dev Containers: Reopen in Container**.
2. Install dependencies with `make install`: the apps restart until `node_modules` exists, then serve on http://localhost:3000 and http://localhost:4000.
3. Read app logs or restart an app from the host, e.g. `docker compose -p <devcontainer project> logs -f frontend-remix`.

The devcontainer has no Docker, so run Docker commands on the host.

### Supabase

Supabase runs from `.devcontainer/compose.yml` on the Supabase CLI ports, forwarded to the host:

- API: http://localhost:54321
- Studio: http://localhost:54323
- Postgres: `postgresql://postgres:postgres@localhost:54322/postgres`

The anon and service_role keys are in `.devcontainer/compose.yml`. They are public dev-only values, never to be reused elsewhere.

#### Schema

- `supabase/schemas/` is the source of truth for the tables and RLS policies, documented in [docs/database.md](docs/database.md).
- Supabase Storage runs in the devcontainer beside the other services.
- After a schema change, PostgREST may need a restart of the `rest` container to reload its schema cache.
- Generate a migration with `pnpm exec supabase db schema declarative sync -f <name>`, which needs Docker, so run it on the host.
- Apply migrations and the seed locally with `pnpm exec supabase db push --include-seed --db-url 'postgresql://postgres:postgres@localhost:54322/postgres?sslmode=disable'`, where `sslmode=disable` is required.
- Run the SQL tests with `pnpm exec supabase db query --db-url 'postgresql://postgres:postgres@localhost:54322/postgres?sslmode=disable' -f supabase/tests/listing.sql`; they roll back.
- Staff roles (`manager`, `agent`) live in the JWT `app_metadata.role`, see [ADR 0001](docs/adr/0001-staff-roles-in-jwt-app-metadata.md).
- The seed creates `manager@example.com` and `agent@example.com`, both with password `password`, for local use only.
- Promote a user by setting `agent.role`, for example `update public.agent set role = 'manager' where id = '...';`, which a trigger syncs into the JWT claim.
- The user must sign in again to get the new role.

## Commands

Run from the repository root.

| Command                                      | What it does                                     |
| -------------------------------------------- | ------------------------------------------------ |
| `make install`                               | Install dependencies and Playwright browsers.    |
| `pnpm test`                                  | Run the Vitest tests of every package but Remix. |
| `pnpm test:watch`                            | Same, in watch mode.                             |
| `pnpm test --project @remix-v3-demo/<name>`  | Run one Vitest project.                          |
| `pnpm -F @remix-v3-demo/frontend-remix test` | Run the Remix app tests with `remix test`.       |
| `pnpm lint:check` / `pnpm lint:apply`        | Lint with oxlint, without or with fixes.         |
| `pnpm fmt:check` / `pnpm fmt:apply`          | Format with oxfmt, without or with writing.      |
| `make generate`                              | Regenerate the TanStack route tree.              |

Append files or args to a `pnpm` script, e.g. `pnpm test path/to/file`.

## Apps

### frontend-tanstack

- File-based routes live in `src/routes/`; `src/routeTree.gen.ts` is generated, never edited.
- `src/router.tsx` creates one QueryClient per router, so SSR requests never share cached data.
- Route loaders prefetch with `context.queryClient`, and the SSR query integration hydrates the browser cache.
- TanStack Devtools (Query and Router panels) show in dev and are stripped from the production build.
- `/` is the public search page: Buy/Rent, city prefix and price range, then min rooms, bedrooms and surface after a first search, 12 per page.
- `/listings/$listingId` is the server-rendered listing detail page, with head meta.
- Server functions call `domain` with an anon Supabase client built from `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, set in `.devcontainer/compose.yml` for dev.
- `public/robots.txt` disallows all crawlers, since this is a demo site.
- `pnpm build` then `pnpm start` runs the production server.

### frontend-remix

- `app/routes.ts` declares the routes, `app/router.ts` wires them to the controllers in `app/actions/`.
- `app/actions/document.tsx` renders the document shell.
- Tailwind compiles `app/styles.css` to `public/styles.css`, rebuilt by `dev`/`hmr` and by `pnpm build`.
- `pnpm build` then `pnpm start` runs the production server; TypeScript runs as is, with no bundling step.

## Conventions

- One folder per entity, one concern per file, kebab-case names, no barrel files.
- Logic shared by both apps lives in `domain`, which holds no React or Remix code.
- Lists are sorted, filtered and paginated server-side, in the query.
- Dependencies are pinned through the pnpm catalog in `pnpm-workspace.yaml`, and a version must be 3 days old before install.
- A pre-commit hook regenerates the route tree, then lints and formats staged files.

The full rules live in `CLAUDE.md` and `.claude/rules/`.

## Docker

Each app has a `Dockerfile` on Node 26, built from the repository root:

```sh
docker build -f packages/frontend-tanstack/Dockerfile --target prod .
docker build -f packages/frontend-remix/Dockerfile --target prod .
```

Both production images listen on port 8080.

## Deployment

Both apps run on Cloudflare Workers, and the database is Supabase Cloud.

- TanStack: `https://real-estate-tanstack.<handle>.workers.dev`
- Remix: `https://real-estate-remix.<handle>.workers.dev`
- `<handle>` is the account's workers.dev subdomain (dashboard, Workers & Pages).
- Worker names come from `packages/frontend-tanstack/wrangler.json` and `packages/frontend-remix/wrangler.jsonc`.

### Workflows

- `.github/workflows/ci.yml` runs on pull requests: lint, fmt, Remix typecheck, Vitest (with Playwright Chromium), Remix tests, and `supabase db push --dry-run` (skipped for fork PRs).
- `.github/workflows/deploy.yml` runs on push to `main` and on manual `workflow_dispatch`.
- Its `supabase` job runs `supabase db push --db-url "$SUPABASE_DB_URL"`.
- Its `deploy` job then deploys both apps (matrix) with `pnpm -F @remix-v3-demo/<app> run deploy --var SUPABASE_URL:... --var SUPABASE_PUBLISHABLE_KEY:...`.

### GitHub setup

Set these as repository secrets and variables (Settings, Secrets and variables, Actions).

- Secrets: `CLOUDFLARE_API_TOKEN` (from the "Edit Cloudflare Workers" template), `CLOUDFLARE_ACCOUNT_ID`, `SUPABASE_DB_URL`.
- Variables (public values): `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (the `sb_publishable_` key, not the legacy anon key).
- `SUPABASE_DB_URL` is the Session pooler string (dashboard Connect, port 5432, user `postgres.<project-ref>`) with the password percent-encoded.
- Use the pooler because GitHub runners are IPv4-only and the direct db host is IPv6-only.
- The PR dry-run reads the production `SUPABASE_DB_URL`, so anyone who can push a branch can reach it.
- A staging database URL would avoid that.

### Local deploy

- Run `pnpm exec wrangler login`, then `pnpm -F @remix-v3-demo/<app> run deploy`.
- It must be `run deploy`, since `pnpm deploy` is a pnpm built-in.
- Append extra wrangler args without `--`, because pnpm 12 forwards a literal `--`.

### How each app targets Workers

- TanStack: `build:cloudflare` uses the Nitro `cloudflare_module` preset through `NITRO_PRESET`; the Node build and Docker image are unchanged.
- Remix: `build:cloudflare` pre-builds the browser modules into `dist/assets.js`, mapped by `#assets` under the `workerd` condition, and `worker.ts` calls `router.fetch`.
- Remix serves those modules from the Worker, since Cloudflare static assets redirect Remix's percent-encoded URLs; `public/` goes to static assets.
- Limitation: a `clientEntry(import.meta.url, ...)` component does not hydrate on Workers yet, as bundling loses `import.meta.url`.

### Security headers

- Both apps send HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy and Permissions-Policy on every response.
- In production they also send a CSP with a per-request script nonce, whose `connect-src` adds the `SUPABASE_URL` origin.
- Remix: `app/middleware/security-headers.ts`.
- TanStack: `vite.config.ts` `routeRules`, the `src/start.ts` middleware and the router `ssr.nonce`.

## License

[MIT](LICENSE) © Marmelab
