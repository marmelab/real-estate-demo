do $test$
declare
  published_count bigint := (select count(*) from public.listing where published);
  new_id bigint;
  affected integer;
  bad record;
  target record;
  claims text;
begin
  begin
    set local role anon;
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);

    if public.is_manager() is distinct from false then
      raise exception 'is_manager() must be false without the manager claim';
    end if;
    if public.is_staff() is distinct from false then
      raise exception 'is_staff() must be false for anon';
    end if;
    if (select count(*) from public.listing) <> published_count or exists (select 1 from public.listing where not published) then
      raise exception 'anon must see exactly the published listings';
    end if;
    begin
      insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, latitude, longitude)
      values ('Anon insert', 'sale', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522);
      raise exception 'anon insert must be rejected';
    exception when insufficient_privilege then null;
    end;

    set local role authenticated;
    perform set_config('request.jwt.claims', '{"role":"authenticated"}', true);

    if public.is_staff() is distinct from false then
      raise exception 'is_staff() must be false without a staff claim';
    end if;
    if exists (select 1 from public.listing where not published) then
      raise exception 'non-manager must not see unpublished listings';
    end if;
    begin
      insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, latitude, longitude)
      values ('User insert', 'sale', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522);
      raise exception 'non-manager insert must be rejected';
    exception when insufficient_privilege then null;
    end;
    update public.listing set price = price + 1;
    get diagnostics affected = row_count;
    if affected <> 0 then
      raise exception 'non-manager update must affect no row, got %', affected;
    end if;
    delete from public.listing;
    get diagnostics affected = row_count;
    if affected <> 0 then
      raise exception 'non-manager delete must affect no row, got %', affected;
    end if;

    for claims in select unnest(array['agent', 'manager']) loop
      perform set_config('request.jwt.claims', format('{"role":"authenticated","app_metadata":{"role":"%s"}}', claims), true);
      if public.is_staff() is distinct from true then
        raise exception 'is_staff() must be true for %', claims;
      end if;
    end loop;

    perform set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"agent"}}', true);

    if not exists (select 1 from public.listing where not published) then
      raise exception 'agent must see the unpublished listing';
    end if;
    insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, latitude, longitude)
    values ('Agent draft', 'sale', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522);
    begin
      insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, published, latitude, longitude)
      values ('Agent published', 'sale', 'house', 100000, '75001', 'Paris', '75', true, 48.8566, 2.3522);
      raise exception 'agent insert of a published listing must be rejected';
    exception when insufficient_privilege then null;
    end;
    for target in
      select distinct on (published) id, published from public.listing order by published, id
    loop
      update public.listing set price = price + 1 where id = target.id;
      get diagnostics affected = row_count;
      if affected <> 1 then
        raise exception 'agent price update on published=% must affect 1 row, got %', target.published, affected;
      end if;
      begin
        update public.listing set published = not target.published where id = target.id;
        raise exception 'agent setting published from % must be rejected', target.published;
      exception when insufficient_privilege then null;
      end;
    end loop;
    delete from public.listing;
    get diagnostics affected = row_count;
    if affected <> 0 then
      raise exception 'agent delete must affect no row, got %', affected;
    end if;

    perform set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"manager"}}', true);

    if not exists (select 1 from public.listing where not published) then
      raise exception 'manager must see the unpublished listing';
    end if;
    insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, latitude, longitude)
    values ('Manager insert', 'sale', 'house', 100000, '75001', 'Paris', '75', 48.8566, 2.3522)
    returning id into new_id;
    update public.listing set price = 200000 where id = new_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'manager update must affect 1 row, got %', affected;
    end if;
    update public.listing set published = true where id = new_id;
    if not (select published from public.listing where id = new_id) then
      raise exception 'manager must be able to publish';
    end if;
    update public.listing set published = false where id = new_id;
    if (select published from public.listing where id = new_id) then
      raise exception 'manager must be able to unpublish';
    end if;
    delete from public.listing where id = new_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'manager delete must affect 1 row, got %', affected;
    end if;

    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);

    update public.listing set published = not published where id = (select min(id) from public.listing);
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'service_role publish change must affect 1 row, got %', affected;
    end if;

    for bad in
      select * from (values
        ('postal code 7500', 'Title', 100000, '7500', '75', 48.8566, 2.3522),
        ('department code 20', 'Title', 100000, '20000', '20', 48.8566, 2.3522),
        ('price 0', 'Title', 0, '75001', '75', 48.8566, 2.3522),
        ('empty title', '', 100000, '75001', '75', 48.8566, 2.3522),
        ('latitude 91', 'Title', 100000, '75001', '75', 91, 2.3522),
        ('longitude -181', 'Title', 100000, '75001', '75', 48.8566, -181)
      ) as t(label, title, price, postal_code, department_code, latitude, longitude)
    loop
      begin
        insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, latitude, longitude)
        values (bad.title, 'sale', 'house', bad.price, bad.postal_code, 'Paris', bad.department_code, bad.latitude, bad.longitude);
        raise exception 'insert with % must fail its check constraint', bad.label;
      exception when check_violation then null;
      end;
    end loop;
    begin
      insert into public.listing (title, transaction_type, property_type, price, postal_code, city, department_code, longitude)
      values ('Title', 'sale', 'house', 100000, '75001', 'Paris', '75', 2.3522);
      raise exception 'insert without latitude must fail not null';
    exception when not_null_violation then null;
    end;

    raise exception using errcode = 'T0000';
  exception when sqlstate 'T0000' then
    raise notice 'listing tests passed';
  end;
end $test$;
