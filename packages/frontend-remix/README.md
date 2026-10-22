# Frontend Remix

The real estate agency site in Remix v3.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/document.tsx` renders the document shell.
- `app/actions/public/` contains the browser runtime entry.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.ts` wires routes to handlers and installs the standard Remix component renderer used by actions.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root, including the generated `styles.css`.

## Pages

- `/` is the landing page, searching by city and max price, with links to the city pages.
- `/search` lists the listings matching the query string, with the facet sidebar.
- `/immobilier/:city` is the SEO page of a target city, `/listings/:listingId` a listing, and any other URL a French 404.
- Data comes from `domain` through `app/data/supabase.ts`, an anon client built from `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
- Shared UI lives in `app/ui/`, and nothing hydrates: facets are links and the mobile filter toggle is pure CSS.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
pnpm install
pnpm dev
pnpm hmr
pnpm build
pnpm start
pnpm test
pnpm typecheck
```
