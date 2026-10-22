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
