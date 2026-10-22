create type public.listing_property_type as enum ('house', 'apartment');

create type public.listing_energy_class as enum ('A', 'B', 'C', 'D', 'E', 'F', 'G');

create table public.listing (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 5000),
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
