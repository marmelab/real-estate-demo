---
paths:
  - ".devcontainer/**"
---

# Devcontainer

- Never add docker-in-docker: a dev service runs as a sibling in `.devcontainer/compose.yml`, started and stopped with the devcontainer.
- `.devcontainer/supabase/` holds files from upstream `supabase/docker`: copy them verbatim, only `kong.yml` being trimmed to the routes of the services that run.
- Add a Supabase service (storage, realtime, functions) by copying its upstream compose block, its `kong.yml` routes and the init SQL it needs.
- Keep upstream's init SQL numbering, since `roles.sql` needs the role `webhooks.sql` creates.
- Keep the Supabase CLI's ports (54321 API, 54322 db, 54323 Studio): kong, studio and db share the workspace network, so `localhost` reaches them from the workspace, its browsers and the forwarded host ports.
- The apps run as `frontend-*` services on `node:26-trixie` (glibc, like the workspace, for the shared `node_modules` native binaries) with `npm run dev`, the image having no pnpm.
- They share the workspace network and restart until `make install` has filled `node_modules`.
- Other services reach Postgres at `db:54322`, `db` being an alias of the workspace network.
- Persist per-user CLI state in a `${devcontainerId}-<name>` volume under `mounts`, pre-creating its target in the `Dockerfile` so `node` owns it.
- The `~/.supabase` volume keeps the Supabase CLI login, while `supabase link` state lives in the repo's `supabase/.temp/`.
