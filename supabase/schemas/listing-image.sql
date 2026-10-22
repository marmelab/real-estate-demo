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
