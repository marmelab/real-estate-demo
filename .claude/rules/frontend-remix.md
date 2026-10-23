---
paths:
  - "packages/frontend-remix/**"
---

# Remix app

`frontend-remix` was scaffolded with `remix new`; use the `remix` skill for the mental model and the installed docs.

## Layout

- `app/routes.ts` is the route contract shared by server and browser modules, giving type-safe hrefs.
- `app/router.ts` wires routes to controllers and installs the middleware and the component renderer.
- Put top-level route actions in `app/actions/controller.tsx`, and a nested route map's in `app/actions/<route-key>/controller.tsx`.
- `app/actions/document.tsx` renders the document shell, with one `<main>` wrapping each page.
- `app/**/public/` is the browser-reachable source boundary: keep secrets and trusted server logic out of it.
- `app/actions/public/entry.ts` is the browser runtime entry.
- Root `public/` holds static files served unchanged from the app root.
- `app/middleware/security-headers.ts` sets the security headers and, in production, a CSP with a per-request script nonce.
- Add `app/data/`, `app/ui/` and the like only once a second route needs them.

## Assets

- Import the asset server through `#assets`, never `./assets.ts` directly.
- Pages work without JavaScript: facet chips are links, the mobile filter toggle is a CSS checkbox (`peer`), and the photo placeholder sits under the `<img>`.
- The admin hydrates a few client entries (live filters, upload on file pick, alt text saved on blur, city from postal code).
- `app/assets.ts` mounts `domain/src` and allows only the `domain` files a client entry imports.
- A new script tag in the document carries the request nonce, or the production CSP blocks it.

## Navigation runtime

- After `run()`, form submits and links become client navigations that morph the DOM.
- The morph keeps live `checked`, `value`, `selected` and dialog `open` state: put a fresh `data-rmx-key` on an element the server must reset on every render (tab radios, dialogs).
- JSX `key` is not rendered, so a reorderable list needs `data-rmx-key` on each item.
- The Navigation API moves focus to `<body>` after a navigation: refocus on `navigatesuccess` where focus must stay (live filters).
- Give every POST-only URL a GET that redirects to its page, since a 400 re-render leaves the browser on that URL.
