delete from public.listing where property_type in ('land', 'commercial');

alter type public.listing_property_type rename to listing_property_type_old;

create type public.listing_property_type as enum ('house', 'apartment');

alter table public.listing alter column property_type type public.listing_property_type using property_type::text::public.listing_property_type;

drop type public.listing_property_type_old;
