# Frontend Remix Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

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

Use `pnpm hmr` for live server and browser updates; `pnpm dev` only watches and restarts the server. `pnpm build` compiles Tailwind (`app/styles.css` to `public/styles.css`), which `dev` and `hmr` also watch; `pnpm start` then runs in production mode.

## Building Features

Use the `remix` skill for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.ts` wires routes to controllers and installs the standard Remix component renderer used by actions
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router smoke test
- `app/actions/document.tsx` renders the document shell, with one `<main>` wrapping each page
- `app/actions/public/` contains the browser runtime entry
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `app/ui/`, and `test/` only when you need them.
