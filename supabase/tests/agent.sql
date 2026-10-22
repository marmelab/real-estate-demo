do $test$
declare
  own_id uuid := gen_random_uuid();
  other_id uuid := gen_random_uuid();
  new_id uuid := gen_random_uuid();
  linked_listing_id bigint;
  affected integer;
  claims text;
  bad record;
begin
  begin
    insert into auth.users (id, email)
    values (own_id, 'own@test.local'), (other_id, 'other@test.local'), (new_id, 'new@test.local');
    insert into public.agent (id, first_name, last_name)
    values (own_id, 'Camille', 'Martin'), (other_id, 'Lucas', 'Bernard');

    insert into public.agent (id, first_name, last_name, role) values (new_id, 'Jeanne', 'Petit', 'manager');
    if (select raw_app_meta_data ->> 'role' from auth.users where id = new_id) is distinct from 'manager' then
      raise exception 'inserting a manager agent must set the manager claim';
    end if;
    update public.agent set role = 'agent' where id = new_id;
    if (select raw_app_meta_data ->> 'role' from auth.users where id = new_id) is distinct from 'agent' then
      raise exception 'updating the agent role must update the claim';
    end if;
    delete from public.agent where id = new_id;
    if (select raw_app_meta_data ? 'role' from auth.users where id = new_id) is distinct from false then
      raise exception 'deleting the agent must remove the role claim';
    end if;

    if has_function_privilege('authenticated', 'public.sync_agent_role_claim()', 'execute') then
      raise exception 'authenticated must not execute the role sync function';
    end if;

    set local role anon;
    perform set_config('request.jwt.claims', '{"role":"anon"}', true);

    if not exists (select 1 from public.agent where id = own_id and first_name = 'Camille' and last_name = 'Martin') then
      raise exception 'anon must read agent names';
    end if;

    set local role authenticated;

    for claims in select unnest(array['{"role":"authenticated"}', format('{"role":"authenticated","sub":"%s","app_metadata":{"role":"agent"}}', own_id)]) loop
      perform set_config('request.jwt.claims', claims, true);
      begin
        insert into public.agent (id, first_name, last_name) values (new_id, 'Jeanne', 'Petit');
        raise exception 'non-manager agent insert must be rejected for %', claims;
      exception when insufficient_privilege then null;
      end;
    end loop;

    update public.agent set first_name = 'Camila', last_name = 'Moreau', photo_path = own_id || '/photo.png' where id = own_id;
    get diagnostics affected = row_count;
    if affected <> 1 or not exists (select 1 from public.agent where id = own_id and first_name = 'Camila' and last_name = 'Moreau' and photo_path = own_id || '/photo.png') then
      raise exception 'agent must update their own names and photo, got % rows', affected;
    end if;
    begin
      update public.agent set photo_path = repeat('a', 301) where id = own_id;
      raise exception 'a 301-char photo_path must fail its check constraint';
    exception when check_violation then null;
    end;
    begin
      update public.agent set role = 'manager' where id = own_id;
      raise exception 'agent changing their own role must be rejected';
    exception when insufficient_privilege then null;
    end;
    update public.agent set first_name = 'Hacked' where id = other_id;
    get diagnostics affected = row_count;
    if affected <> 0 then
      raise exception 'agent update of another agent must affect no row, got %', affected;
    end if;
    delete from public.agent;
    get diagnostics affected = row_count;
    if affected <> 0 then
      raise exception 'agent delete must affect no row, got %', affected;
    end if;

    perform set_config('request.jwt.claims', '{"role":"authenticated","app_metadata":{"role":"manager"}}', true);

    insert into public.agent (id, first_name, last_name) values (new_id, 'Jeanne', 'Petit');
    update public.agent set last_name = 'Durand' where id = new_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'manager update must affect 1 row, got %', affected;
    end if;
    update public.agent set role = 'manager' where id = other_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'manager role change of another agent must affect 1 row, got %', affected;
    end if;
    delete from public.agent where id = new_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'manager delete must affect 1 row, got %', affected;
    end if;

    set local role service_role;
    perform set_config('request.jwt.claims', '{"role":"service_role"}', true);

    update public.agent set role = 'agent' where id = other_id;
    get diagnostics affected = row_count;
    if affected <> 1 then
      raise exception 'service_role role change must affect 1 row, got %', affected;
    end if;

    for bad in
      select * from (values
        ('empty first_name', '', 'Martin'),
        ('101-char last_name', 'Camille', repeat('a', 101))
      ) as t(label, first_name, last_name)
    loop
      begin
        insert into public.agent (id, first_name, last_name) values (new_id, bad.first_name, bad.last_name);
        raise exception 'insert with % must fail its check constraint', bad.label;
      exception when check_violation then null;
      end;
    end loop;

    update public.listing set agent_id = other_id where id = (select min(id) from public.listing)
    returning id into linked_listing_id;
    delete from public.agent where id = other_id;
    if (select agent_id from public.listing where id = linked_listing_id) is not null then
      raise exception 'deleting an agent must set listing.agent_id to null';
    end if;

    raise exception using errcode = 'T0000';
  exception when sqlstate 'T0000' then
    raise notice 'agent tests passed';
  end;
end $test$;
