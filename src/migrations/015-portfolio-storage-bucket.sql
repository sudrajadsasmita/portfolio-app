insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'portfolio',
  'portfolio',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_can_read_portfolio_storage"
on storage.objects;

drop policy if exists "authenticated_can_upload_portfolio_storage"
on storage.objects;

drop policy if exists "authenticated_can_update_portfolio_storage"
on storage.objects;

drop policy if exists "authenticated_can_delete_portfolio_storage"
on storage.objects;

create policy "public_can_read_portfolio_storage"
on storage.objects
for select
using (bucket_id = 'portfolio');

create policy "authenticated_can_upload_portfolio_storage"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio');

create policy "authenticated_can_update_portfolio_storage"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio')
with check (bucket_id = 'portfolio');

create policy "authenticated_can_delete_portfolio_storage"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio');
