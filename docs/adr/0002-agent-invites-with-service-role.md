# 0002: Agent invites with the service role

## Context

- Only managers add agents, and an agent needs an `auth.users` row to sign in.
- Creating an auth user requires the Supabase admin API, which the anon key cannot call.

## Decision

- A manager invites an agent with `auth.admin.inviteUserByEmail`, called from server code holding the service_role key.
- The server code checks that the caller is a manager, then inserts the `agent` row.
- The invite flow is not built yet.

## Rejected option

- An RLS-protected `invitation` table plus a trigger on `auth.users`, so no app holds the service_role key.
- It adds a table, a trigger on a platform-owned table and a custom acceptance flow, for no gain at this scale.

## Consequences

- The manager check for invites is app code, an exception to "RLS is the trust boundary".
- The service_role key bypasses RLS, so it must never reach the browser.
- Only server-side code in each app may read it.
- See also [ADR 0001](0001-staff-roles-in-jwt-app-metadata.md).
