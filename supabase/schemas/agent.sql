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
