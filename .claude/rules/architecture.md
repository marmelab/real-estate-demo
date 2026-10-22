# Architecture

## Package layering

- Supabase is the backend: there is no `api` package.
- `domain`: shared business logic, Zod models and validation, and the Supabase data access, one function per operation.
- `frontend-tanstack` / `frontend-remix`: each consumes `domain` models and data-access functions, never querying Supabase itself.
- Logic shared by both apps MUST live in `domain`.
- `domain` holds no React or Remix code, since each app renders with a different one.
- `domain/auth/` holds the auth helpers both apps share; add one there, not a per-app copy.

## Trust boundary

- PostgREST answers anyone holding the public anon key, so Postgres RLS policies and constraints are the trust boundary, never app code.
- Every table in an exposed schema MUST enable RLS, with a policy per role that reads or writes it.
- Enforce manager and per-resource authz in RLS policies; an app-side check is UX only.

## Database schema

- Edit `supabase/schemas/`, the source of truth, never a migration alone.
- Never edit a migration already applied anywhere: add a new one, or the databases that ran the old version drift silently.
- Generate migrations with `pnpm exec supabase db schema declarative sync -f <name>`.
- Without Docker, hand-write the migration byte-identical to the schema change.
- Staff roles come from the JWT `app_metadata.role`, read through `public.is_manager()` and `public.is_staff()` in RLS policies.
- `agent.role` is the source of truth, synced into the claim by a trigger.
- Tables, access rules and storage are documented in `docs/database.md`.
- See `docs/adr/0001-staff-roles-in-jwt-app-metadata.md` and `docs/adr/0002-agent-invites-with-service-role.md`.

## Server-side sorting and filtering

- Lists are paginated server-side, so sorting and filtering MUST happen in the query (supabase-js `.order()`, filters, `.range()`), never in the client or on a fetched page.
- Declare the sort/filter params in the list query schema in `domain`, pass them through the data-access function, and keep them in the URL app-side.

## File layout

One folder per entity, one concern per file, kebab-case folder, no barrel/index.

`domain` (callers import the subpath, `@remix-v3-demo/domain/<entity>/model`):

- `<entity>/model.ts`: domain model (Zod schema + inferred type).
- `<entity>/<operation>.ts`: one data-access function, taking the caller's Supabase client (browser or per-request SSR) and parsing the response with the model schema, never trusting network data.
- `<entity>/<model>-validator.ts`: request validators shared by more than one package (e.g. `listing-validator.ts` holds `createListingSchema`).
- `<entity>/<function>.ts`: one shared function per file that is neither a model nor a data-access function (e.g. `listing/format-address.ts`).
- Relative imports inside `domain` MUST carry the explicit `.ts` extension.

Each app keeps entity code under `src/<entity>/`, one concern per file, with routes in `src/routes/` wiring data to components and holding no business logic:

- `frontend-tanstack` wraps each data-access function in `hook/<operation>.ts`: its `queryOptions` factory and react-query hook, so route loaders can prefetch.
- Presentational components stay at the entity root (`listing-list.tsx`, `listing-view.tsx`).

Data-access naming:

- The function is `getXxxByYyy` / `listXxx`, its react-query hook `useGetXxxByYyy` / `useListXxx`.
- Both files share the kebab-case function name (`domain/listing/get-listing-by-id.ts`, `frontend-tanstack/src/listing/hook/get-listing-by-id.ts`).
- One operation per file, never a combined `listing-query.ts`.
- Keep the `queryOptions` factory (`getXxxByYyyQueryOptions`) in the hook file so route loaders can prefetch.

## Decision records (ADR)

Record an ADR only for a decision costly to reverse that constrains future work: a new cross-package boundary, a persistence or auth model, a public contract, or a tradeoff where the rejected option was reasonable.

- Skip it for routine choices that follow existing patterns, are local to one file, or are cheap to change later.
- When in doubt, no ADR: a rule or code comment is enough.
- ADRs live in `docs/adr/`, are markdown, and are named `XXXX-kebab-title.md` with a zero-padded incrementing number.
- One decision per file.

## Zod naming

Name schemas `xxxSchema` (camelCase + `Schema`) and infer the type under the PascalCase domain name:

```ts
export const emailSchema = z.email(); /* ... */
export type Email = z.infer<typeof emailSchema>;
```
