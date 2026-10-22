# 0001: Staff roles in JWT app_metadata

## Context

- RLS is the trust boundary, so policies must tell managers and agents from other users.
- Policies run on every query, so the role lookup must be cheap.

## Decision

- The role lives in the JWT `app_metadata.role`: `manager` or `agent`.
- `agent.role` is the source of truth, synced into `app_metadata.role` by a trigger.
- `manager` can do everything, including publish, unpublish and delete.
- `agent` reads all listings, creates drafts and edits any listing, but cannot change `published` or delete.
- `public.is_manager()` and `public.is_staff()` read the claim and back the policies.
- A `before update of published` trigger enforces publishing for the `authenticated` role, leaving service_role and postgres free.
- See [ADR 0002](0002-agent-invites-with-service-role.md) for how agents are invited.

## Rejected option

- A `user_role` table with a security definer lookup function.
- It adds a table, a query per policy check and a privileged function, for no gain at this scale.

## Consequences

- A role change needs a new token: the user must sign in again.
- `app_metadata` is writable only server-side, so users cannot grant themselves a role.
- RLS cannot compare old and new rows, so the publish rule is a trigger, not a policy.
