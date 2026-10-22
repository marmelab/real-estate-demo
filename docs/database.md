# Database

## Overview

- The backend is Supabase Postgres, with RLS as the trust boundary.
- `supabase/schemas/` holds the declarative source of truth: `roles.sql`, `agent.sql`, `listing.sql`, `listing-image.sql` and `storage.sql`.
- Files are not order-numbered, since pg-delta resolves the dependencies between them.
- `supabase/migrations/20261022084329_create_schema.sql` is the initial migration.
- It is the schema files at that point plus a migration-only tail: the two bucket inserts, and a guarded revoke of `execute` on the platform's `rls_auto_enable()`.
- `20261022120000_remove_listing_transaction_type.sql` drops `listing.transaction_type` and its enum, since the agency only sells.
- `20261022130000_restrict_listing_property_type.sql` restricts `listing_property_type` to `house` and `apartment`, deleting listings of the removed types.
- `supabase/seed.sql` adds two local users, `manager@example.com` and `agent@example.com`, both with password `password`, plus sample agents, listings and images.
- `supabase/tests/*.sql` are the SQL tests, see the README.
- Role changes reach the JWT at the next token refresh, so the user may need to sign in again.

## Enums

- `agent_role`: `manager`, `agent`.
- `listing_property_type`: `house`, `apartment`.
- `listing_energy_class`: `A`, `B`, `C`, `D`, `E`, `F`, `G`, the French DPE energy label.

## Tables

### `agent`

A staff member, one row per `auth.users` row.

| Column       | Type          | Null | Default | Meaning                                       |
| ------------ | ------------- | ---- | ------- | --------------------------------------------- |
| `id`         | `uuid`        | no   |         | Primary key, references `auth.users`, cascade |
| `first_name` | `text`        | no   |         | 1 to 100 characters                           |
| `last_name`  | `text`        | no   |         | 1 to 100 characters                           |
| `role`       | `agent_role`  | no   | `agent` | Source of truth of the staff role             |
| `created_at` | `timestamptz` | no   | `now()` |                                               |
| `photo_path` | `text`        | yes  |         | Up to 300 characters, path in `agent-photo`   |

Triggers:

- `agent_sync_role_claim`: after insert, update of `role` and delete, runs `sync_agent_role_claim()`.
- `agent_prevent_non_manager_role_change`: before update of `role`, runs `prevent_non_manager_role_change()`.

### `listing`

A property the agency offers.

| Column            | Type                    | Null | Default  | Meaning                                                  |
| ----------------- | ----------------------- | ---- | -------- | -------------------------------------------------------- |
| `id`              | `bigint`                | no   | identity | Primary key                                              |
| `title`           | `text`                  | no   |          | 1 to 200 characters                                      |
| `description`     | `text`                  | no   | `''`     | Up to 5000 characters                                    |
| `property_type`   | `listing_property_type` | no   |          |                                                          |
| `price`           | `integer`               | no   |          | Greater than 0, whole euros, sale price                  |
| `surface_area`    | `integer`               | yes  |          | Greater than 0, m2, loi Carrez surface                   |
| `land_area`       | `integer`               | yes  |          | Greater than 0, m2                                       |
| `rooms`           | `smallint`              | yes  |          | At least 0, pieces                                       |
| `bedrooms`        | `smallint`              | yes  |          | At least 0                                               |
| `energy_class`    | `listing_energy_class`  | yes  |          | DPE label                                                |
| `address`         | `text`                  | no   | `''`     | Street address                                           |
| `postal_code`     | `text`                  | no   |          | Five digits                                              |
| `city`            | `text`                  | no   |          |                                                          |
| `department_code` | `text`                  | no   |          | `01` to `95` without `20`, `2A`, `2B`, or `971` to `976` |
| `latitude`        | `double precision`      | no   |          | Between -90 and 90                                       |
| `longitude`       | `double precision`      | no   |          | Between -180 and 180                                     |
| `published`       | `boolean`               | no   | `false`  | Visible to the public when true                          |
| `created_at`      | `timestamptz`           | no   | `now()`  |                                                          |
| `agent_id`        | `uuid`                  | yes  |          | References `agent`, set null on delete                   |

Indexes:

- `listing_city_idx` on `city`.
- `listing_department_code_idx` on `department_code`.
- `listing_published_created_at_idx` on `created_at desc`, partial on `published`.
- `listing_agent_id_idx` on `agent_id`.

Triggers:

- `listing_prevent_non_manager_publish_change`: before update of `published`, runs `prevent_non_manager_publish_change()`.

### `listing_image`

A photo of a listing, stored in the `listing-image` bucket.

| Column       | Type       | Null | Default  | Meaning                                 |
| ------------ | ---------- | ---- | -------- | --------------------------------------- |
| `id`         | `bigint`   | no   | identity | Primary key                             |
| `listing_id` | `bigint`   | no   |          | References `listing`, cascade on delete |
| `path`       | `text`     | no   |          | 1 to 300 characters, path in the bucket |
| `position`   | `smallint` | no   |          | At least 0, unique per listing          |
| `alt`        | `text`     | no   | `''`     | Up to 300 characters                    |

Constraints:

- `unique (listing_id, position)`.

## Functions

- `is_manager()`: true when the JWT `app_metadata.role` is `manager`.
- `is_staff()`: true when the JWT `app_metadata.role` is `manager` or `agent`.
- `sync_agent_role_claim()`: security definer, with `execute` revoked from public, anon and authenticated.
- It copies `agent.role` into `auth.users.raw_app_meta_data`, and removes the `role` key when the agent is deleted.
- `prevent_non_manager_publish_change()`: rejects a `published` change unless the caller is a manager.
- `prevent_non_manager_role_change()`: rejects a `role` change unless the caller is a manager.
- Both guards only apply when `current_user = 'authenticated'`, so `service_role` and `postgres` are free.
- RLS cannot compare old and new rows, which is why these two rules are triggers, not policies.

## Access matrix

Rules per role, enforced by RLS and the guards.

| Role                | `agent`                                     | `listing`                                                  | `listing_image`                   | `listing-image` bucket | `agent-photo` bucket               |
| ------------------- | ------------------------------------------- | ---------------------------------------------------------- | --------------------------------- | ---------------------- | ---------------------------------- |
| anon                | read                                        | read published                                             | read images of published listings | read by public URL     | read by public URL                 |
| signed-in non-staff | read                                        | read published                                             | read images of published listings | read by public URL     | read by public URL                 |
| agent               | read, update own row but not `role`         | read all, insert drafts, update any, no publish, no delete | read all, insert, update, delete  | read, write            | read, write in own `<uid>/` folder |
| manager             | read, insert, update, delete, change `role` | read all, insert, update, publish, delete                  | read all, insert, update, delete  | read, write            | read, write anywhere               |

## Storage

- Buckets `agent-photo` and `listing-image` are public, limited to 5 MB, and accept `image/jpeg`, `image/png` and `image/webp`.
- Paths are stored without the bucket name.
- `agent-photo` paths are `<agent uid>/...`, and `listing-image` paths are `<listing id>/...`.
- `listing-image` writes need staff.
- `agent-photo` writes need a manager anywhere, or staff in their own uid folder.
- Accepted tradeoff: a public bucket serves files by URL, so a draft listing's images are reachable if the path is known.
- Storage runs as a service in `.devcontainer/compose.yml`, behind Kong at `/storage/v1/`.

## Invites

- Managers invite agents through `auth.admin.inviteUserByEmail`, called from server code holding the service_role key.
- The server code checks that the caller is a manager first, then inserts the `agent` row.
- Not built yet.
- See [ADR 0002](adr/0002-agent-invites-with-service-role.md).

## Decisions

- [ADR 0001](adr/0001-staff-roles-in-jwt-app-metadata.md): staff roles in the JWT `app_metadata`.
- [ADR 0002](adr/0002-agent-invites-with-service-role.md): agent invites with the service_role key.
