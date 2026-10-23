# remix-v3-demo

## Domain

- A real estate agency website with basic features, built twice: once in React with TanStack Start, once in Remix v3.
- **Keyhaven**: a high-end agency selling premium residences in Paris, Lyon, Nice and Cannes only.
- **Listing**: an apartment or a house the agency sells; there is no rental, land or commercial property.
- **Search**: visitors find listings by city, then refine with facets (budget, property type, bedrooms, rooms, surface, DPE).
- `/` is the landing page, searching by city and max price; `/search` shows the results with facets.
- `/immobilier/$city` is an SEO page per target city (Paris, Lyon, Nice, Cannes), listed in `domain` as `TARGET_CITIES`.
- It is a demo: `robots.txt` disallows every crawler, while pages stay SSR with head meta.

## Packages

- Supabase is the backend, with RLS as the trust boundary.
- `domain`: shared business logic, models, validation and the Supabase data access, shared by both apps.
- `frontend-tanstack`: the site in React with TanStack Start, Router, Query and Form, plus TanStack Devtools in dev.
- `frontend-remix`: the site in Remix v3, which renders with `remix/component`, not React.
- `frontend-remix` compiles Tailwind with `@tailwindcss/cli`, from `app/styles.css` to the gitignored `public/styles.css`.
- Each app holds both the public site, where visitors browse and search listings, and the admin section.
- Style both apps with Tailwind CSS, without shadcn/ui.

## Practices

- Use the `ponytail` skill: the laziest solution that works (YAGNI, stdlib and native before dependencies, shortest correct diff).
- Read a package's docs with Context7 before using or configuring it, never from memory.
- Use the `remix` skill for Remix code: the installed `node_modules/remix/INDEX.md` docs are canonical.
- User-facing copy is French, written directly in the code, no i18n: the site targets France only.
- Code, comments, docs and rules stay in English.
- Format prices with `fr-FR` (`890 000 €`).
- No E2E tests: this is a toy project, Vitest only.
- Add a form field with the `add-domain-entity` then `add-admin-component` skills.

## Commands

- pnpm monorepo, packages in `packages/`, wrapped by the `makefile` (`make install`, `make lint`, `make test`).
- Prefer `pnpm <script>`, so you can append files or args (`pnpm test path/to/file`, `pnpm lint:check --quiet`).
- `make generate`: regenerate the TanStack route tree, also run by the pre-commit hook.
- `pnpm test`: Vitest tests headless (`test:watch` watch), for every package but `frontend-remix`.
- `pnpm test --project @remix-v3-demo/<project>`: one Vitest project's tests.
- `pnpm -F @remix-v3-demo/frontend-remix test`: the Remix app's tests, run by `remix test`: `*.test.ts(x)` on the server from the package, then `*.test.browser.tsx` in Playwright chromium from the repo root, since the browser runner serves only files under its cwd.
- `pnpm -F @remix-v3-demo/frontend-remix typecheck`: typecheck the Remix app, which Vitest never compiles.
- `pnpm lint:apply` / `lint:check`: lint with/without writing fixes.
- `pnpm fmt:apply` / `fmt:check`: format with/without writing fixes.

## Services (dev)

- Supabase runs beside the devcontainer from `.devcontainer/compose.yml`, started and stopped with it; the devcontainer has no Docker.
- Apps: `frontend-tanstack` on http://localhost:3000, `frontend-remix` on http://localhost:4000, each a `.devcontainer/compose.yml` service running its `dev` script, forwarded to the host.
- The apps already hold 3000 and 4000, so never start a second `dev` server in the workspace; a file change reloads them.
- Supabase uses the CLI's ports, forwarded to the host: API http://localhost:54321, Studio http://localhost:54323, Postgres `postgresql://postgres:postgres@localhost:54322/postgres`.
- Each app's `Dockerfile` builds from the repo root on `node:26-alpine`, matching `.nvmrc`; the `prod` target listens on 8080.
- The anon and service_role keys are in `.devcontainer/compose.yml`.
