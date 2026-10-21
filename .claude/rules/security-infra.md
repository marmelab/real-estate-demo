---
paths:
  - "docker-compose*.yml"
  - ".devcontainer/compose.yml"
  - "**/Dockerfile"
  - "**/*.conf"
  - "**/wrangler.json*"
  - "**/security-headers.ts"
  - "**/content-security-policy.ts"
---

# Infra Security

- Response headers apply at the edge across all responses.
- On Cloudflare Workers the app is the edge, so each app sets them itself (Remix middleware, TanStack Nitro `routeRules` and Start middleware) and in the static assets' `_headers`.

## Service exposure

- Expose only user-facing services (the two apps and the Supabase gateway) to the public network.
- Keep internal services (database, caches, queues) on a private network and never publish their ports.
- The secrets in `.devcontainer/compose.yml` are public, dev-only values: never reuse one outside the devcontainer.

## Required HTTP headers

Every production response serving an app must include:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Content Security Policy

- Configure a production CSP with a per-request nonce for scripts instead of `unsafe-inline`.
- Adjust origins to the actual project rather than copying this verbatim.

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self';
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
```
