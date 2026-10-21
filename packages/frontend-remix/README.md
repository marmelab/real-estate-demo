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
