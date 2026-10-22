create function public.is_manager()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'manager', false)
$$;

create function public.is_staff()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') in ('manager', 'agent'), false)
$$;

create type public.agent_role as enum ('manager', 'agent');

create table public.agent (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null check (char_length(first_name) between 1 and 100),
  last_name text not null check (char_length(last_name) between 1 and 100),
  role public.agent_role not null default 'agent',
  created_at timestamptz not null default now(),
  photo_path text check (char_length(photo_path) <= 300)
);

create function public.sync_agent_role_claim()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'DELETE' then
    update auth.users set raw_app_meta_data = raw_app_meta_data - 'role' where id = old.id;
    return old;
  end if;
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role)
  where id = new.id;
  return new;
end;
$$;

revoke execute on function public.sync_agent_role_claim() from public, anon, authenticated;

create trigger agent_sync_role_claim
after insert or update of role or delete on public.agent
for each row execute function public.sync_agent_role_claim();

create function public.prevent_non_manager_role_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and current_user = 'authenticated' and not public.is_manager() then
    raise exception 'Only managers can change an agent role' using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

create trigger agent_prevent_non_manager_role_change
before update of role on public.agent
for each row execute function public.prevent_non_manager_role_change();

alter table public.agent enable row level security;

create policy "Agents are readable by everyone"
on public.agent for select
to anon, authenticated
using (true);

create policy "Managers can insert agents"
on public.agent for insert
to authenticated
with check ((select public.is_manager()));

create policy "Managers and the agent can update an agent"
on public.agent for update
to authenticated
using ((select public.is_manager()) or id = (select auth.uid()))
with check ((select public.is_manager()) or id = (select auth.uid()));

create policy "Managers can delete agents"
on public.agent for delete
to authenticated
using ((select public.is_manager()));

create type public.listing_transaction_type as enum ('sale', 'rent');

create type public.listing_property_type as enum ('house', 'apartment', 'land', 'commercial');

create type public.listing_energy_class as enum ('A', 'B', 'C', 'D', 'E', 'F', 'G');

create table public.listing (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 5000),
  transaction_type public.listing_transaction_type not null,
  property_type public.listing_property_type not null,
  price integer not null check (price > 0),
  surface_area integer check (surface_area > 0),
  land_area integer check (land_area > 0),
  rooms smallint check (rooms >= 0),
  bedrooms smallint check (bedrooms >= 0),
  energy_class public.listing_energy_class,
  address text not null default '',
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  city text not null,
  department_code text not null check (department_code ~ '^(0[1-9]|1[0-9]|2[1-9]|[3-8][0-9]|9[0-5]|2A|2B|97[1-6])$'),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  agent_id uuid references public.agent (id) on delete set null
);

create index listing_city_idx on public.listing (city);

create index listing_department_code_idx on public.listing (department_code);

create index listing_published_created_at_idx on public.listing (created_at desc) where published;

create index listing_agent_id_idx on public.listing (agent_id);

create function public.prevent_non_manager_publish_change()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.published is distinct from old.published and current_user = 'authenticated' and not public.is_manager() then
    raise exception 'Only managers can publish or unpublish a listing' using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

create trigger listing_prevent_non_manager_publish_change
before update of published on public.listing
for each row execute function public.prevent_non_manager_publish_change();

alter table public.listing enable row level security;

create policy "Published listings are readable by everyone, all by staff"
on public.listing for select
to anon, authenticated
using (published or (select public.is_staff()));

create policy "Staff can insert drafts, managers published listings"
on public.listing for insert
to authenticated
with check ((select public.is_staff()) and ((select public.is_manager()) or not published));

create policy "Staff can update listings"
on public.listing for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "Managers can delete listings"
on public.listing for delete
to authenticated
using ((select public.is_manager()));

create table public.listing_image (
  id bigint generated always as identity primary key,
  listing_id bigint not null references public.listing (id) on delete cascade,
  path text not null check (char_length(path) between 1 and 300),
  position smallint not null check (position >= 0),
  alt text not null default '' check (char_length(alt) <= 300),
  unique (listing_id, position)
);

alter table public.listing_image enable row level security;

create policy "Images of published listings are readable by everyone, all by staff"
on public.listing_image for select
to anon, authenticated
using (
  (select public.is_staff())
  or exists (select 1 from public.listing where listing.id = listing_image.listing_id and listing.published)
);

create policy "Staff can insert listing images"
on public.listing_image for insert
to authenticated
with check ((select public.is_staff()));

create policy "Staff can update listing images"
on public.listing_image for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "Staff can delete listing images"
on public.listing_image for delete
to authenticated
using ((select public.is_staff()));

create policy "Staff can read listing images"
on storage.objects for select
to authenticated
using (bucket_id = 'listing-image' and (select public.is_staff()));

create policy "Staff can upload listing images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'listing-image' and (select public.is_staff()));

create policy "Staff can update listing images"
on storage.objects for update
to authenticated
using (bucket_id = 'listing-image' and (select public.is_staff()))
with check (bucket_id = 'listing-image' and (select public.is_staff()));

create policy "Staff can delete listing images"
on storage.objects for delete
to authenticated
using (bucket_id = 'listing-image' and (select public.is_staff()));

create policy "Managers and the agent can read an agent photo"
on storage.objects for select
to authenticated
using (bucket_id = 'agent-photo' and ((select public.is_manager()) or ((select public.is_staff()) and (storage.foldername(name))[1] = (select auth.uid())::text)));

create policy "Managers and the agent can upload an agent photo"
on storage.objects for insert
to authenticated
with check (bucket_id = 'agent-photo' and ((select public.is_manager()) or ((select public.is_staff()) and (storage.foldername(name))[1] = (select auth.uid())::text)));

create policy "Managers and the agent can update an agent photo"
on storage.objects for update
to authenticated
using (bucket_id = 'agent-photo' and ((select public.is_manager()) or ((select public.is_staff()) and (storage.foldername(name))[1] = (select auth.uid())::text)))
with check (bucket_id = 'agent-photo' and ((select public.is_manager()) or ((select public.is_staff()) and (storage.foldername(name))[1] = (select auth.uid())::text)));

create policy "Managers and the agent can delete an agent photo"
on storage.objects for delete
to authenticated
using (bucket_id = 'agent-photo' and ((select public.is_manager()) or ((select public.is_staff()) and (storage.foldername(name))[1] = (select auth.uid())::text)));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('agent-photo', 'agent-photo', true, 5242880, '{image/jpeg,image/png,image/webp}'),
  ('listing-image', 'listing-image', true, 5242880, '{image/jpeg,image/png,image/webp}')
on conflict (id) do nothing;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end
$$;
