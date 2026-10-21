---
paths:
  - "packages/frontend-*/**/*.tsx"
  - "packages/frontend-*/**/*.ts"
  - "**/*.html"
---

# Frontend Security

For the apps served to the browser (`frontend-tanstack`, `frontend-remix`); response headers and CSP live in infra config.

- Never inject unsanitized HTML, and avoid `innerHTML` and `dangerouslySetInnerHTML`.
- Sanitize user-generated HTML with a vetted local sanitizer when it is unavoidable.
- Load third-party scripts asynchronously, with SRI when served from a CDN, and prefer self-hosting critical dependencies.
- Validate forms client-side for UX only, since RLS policies and Postgres constraints are the boundary.
- Gate an admin page app-side for UX only, never as the boundary: its RLS policies are.
- Never ship the service_role key to the browser, since it bypasses RLS.
- Protect every state-changing request that rides a cookie session against CSRF.
