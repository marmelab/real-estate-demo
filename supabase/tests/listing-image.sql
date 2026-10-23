do $test$
declare
  published_id bigint;
  draft_id bigint;
  image_id bigint;
  affected integer;
  bad record;
begin
  begin
    insert into public.listing (title, property_type, price, postal_code, city, department_code, latitude, longitude, published)
    values ('Published with images', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522, true)
    returning id into published_id;
    insert into public.listing (title, property_type, price, postal_code, city, department_code, latitude, longitude)
    values ('Draft with images', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522)
    returning id into draft_id;
    insert into public.listing_image (listing_id, path, position)
    values (published_id, published_id || '/0.jpg', 0), (draft_id, draft_id || '/0.jpg', 0);

    set local role anon;
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);

    if not exists (select 1 from public.listing_image where listing_id = published_id) then
      raise exception 'anon must see images of a published listing';
    end if;
    if exists (select 1 from public.listing_image where listing_id = draft_id) then
      raise exception 'anon must not see images of an unpublished listing';
    end if;

    set local role authenticated;
    perform set_config('request.jwt.claims', '{"role":"authenticated"}', true);

    if exists (select 1 from public.listing_image where listing_id = draft_id) then
      raise exception 'non-staff must not see images of an unpublished listing';
    end if;
    begin
      insert into public.listing_image (listing_id, path, position) values (published_id, published_id || '/1.jpg', 1);
      raise exception 'non-staff image insert must be rejected';
    exception when insufficient_privilege then null;
    end;

    perform set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"agent"}}', true);

    if not exists (select 1 from public.listing_image where listing_id = draft_id) then
      raise exception 'staff must see images of an unpublished listing';
    end if;
    insert into public.listing_image (listing_id, path, position) values (draft_id, draft_id || '/1.jpg', 1)
    returning id into image_id;
    update public.listing_image set alt = 'Living room', position = 2 where id = image_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'agent image update must affect 1 row, got %', affected;
    end if;
    delete from public.listing_image where id = image_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'agent image delete must affect 1 row, got %', affected;
    end if;
    begin
      insert into public.listing_image (listing_id, path, position) values (draft_id, draft_id || '/dup.jpg', 0);
      raise exception 'a duplicate (listing_id, position) must be rejected';
    exception when unique_violation then null;
    end;
    insert into public.listing_image (listing_id, path, position) values (draft_id, draft_id || '/1.jpg', 1);
    insert into public.listing_image (id, listing_id, path, position)
    select id, listing_id, path, 1 - position from public.listing_image where listing_id = draft_id
    on conflict (id) do update set position = excluded.position;
    if (select array_agg(path order by position) from public.listing_image where listing_id = draft_id)
      is distinct from array[draft_id || '/1.jpg', draft_id || '/0.jpg'] then
      raise exception 'staff must swap two image positions in one upsert';
    end if;

    for bad in
      select * from (values
        ('position -1', 'a.jpg', -1::smallint, ''),
        ('empty path', '', 1::smallint, ''),
        ('301-char path', repeat('a', 301), 1::smallint, ''),
        ('301-char alt', 'a.jpg', 1::smallint, repeat('a', 301))
      ) as t(label, path, position, alt)
    loop
      begin
        insert into public.listing_image (listing_id, path, position, alt) values (draft_id, bad.path, bad.position, bad.alt);
        raise exception 'insert with % must fail its check constraint', bad.label;
      exception when check_violation then null;
      end;
    end loop;

    perform set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"manager"}}', true);

    delete from public.listing where id = published_id;
    if exists (select 1 from public.listing_image where listing_id = published_id) then
      raise exception 'deleting a listing must delete its images';
    end if;

    raise exception using errcode = 'T0000';
  exception when sqlstate 'T0000' then
    raise notice 'listing_image tests passed';
  end;
end $test$;
