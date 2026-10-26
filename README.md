# Real estate agency demo

The same real estate agency website built twice, to compare React with TanStack Start against Remix v3.

Keyhaven is a fictional high-end agency selling apartments and houses in Paris, Lyon, Nice and Cannes, with a French-language site.

## Where is the code

- [packages/frontend-tanstack](packages/frontend-tanstack): the React app, with TanStack Start.
- [packages/frontend-remix](packages/frontend-remix): the Remix v3 app.
- [packages/domain](packages/domain): the models, validation and Supabase data access both apps share.

## Run it

1. Open the repository in VS Code and run **Dev Containers: Reopen in Container**.
2. Wait for the container to install the dependencies and start Supabase and both apps.
3. Open both apps side by side:
   - TanStack Start: http://localhost:3000
   - Remix v3: http://localhost:4000

The apps run in production mode: they build once on start, so a code change does not refresh them.

- To see a change, restart the app's container from the host, e.g. `docker compose -p <project> restart frontend-remix`.
- To get the reloading dev server, set `NODE_ENV: development` in `.devcontainer/compose.yml` and rebuild the container.

## Try the public site

- Search by city and max price from the landing page.
- Refine the results with the facets: budget, property type, bedrooms, rooms, surface and DPE.
- Open a listing to browse its photos.
- Add listings to your favorites, then find them on `/favoris`.
- Visit a city page, e.g. `/immobilier/paris`.

## Try the admin

Sign in on `/admin/login` with a seeded account:

| Email                 | Password   | Role    |
| --------------------- | ---------- | ------- |
| `manager@example.com` | `password` | manager |
| `agent@example.com`   | `password` | agent   |

- Both roles create and edit listings, upload photos and edit their profile.
- Only a manager publishes a listing, changes a role and invites agents.
- Invite emails land in MailDev.

## Supabase

| Service  | URL                                                       |
| -------- | --------------------------------------------------------- |
| Studio   | http://localhost:54323                                    |
| API      | http://localhost:54321                                    |
| Postgres | `postgresql://postgres:postgres@localhost:54322/postgres` |
| MailDev  | http://localhost:1080                                     |

- Browse and edit the data in Studio.
- The API keys are in `.devcontainer/compose.yml`, public dev-only values.

## License

[MIT](LICENSE) © Marmelab
