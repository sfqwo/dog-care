do $$
begin
  if to_regclass('storage.buckets') is null or to_regclass('storage.objects') is null then
    raise notice 'Supabase Storage tables are not available. Create the medical-documents bucket in Dashboard after enabling Storage.';
    return;
  end if;

  execute $function$
    create or replace function public.can_access_medical_document_object(object_name text)
    returns boolean
    language plpgsql
    stable
    security definer
    set search_path = ''
    as $body$
    declare
      path_parts text[];
      target_pet_id uuid;
      target_document_id uuid;
    begin
      path_parts := storage.foldername(object_name);
      if coalesce(array_length(path_parts, 1), 0) <> 3 then
        return false;
      end if;

      if path_parts[1] <> (select auth.uid())::text then
        return false;
      end if;

      target_pet_id := path_parts[2]::uuid;
      target_document_id := path_parts[3]::uuid;

      return exists (
        select 1
        from public.medical_documents as document
        join public.pets as pet on pet.id = document.pet_id
        where document.id = target_document_id
          and document.pet_id = target_pet_id
          and pet.owner_id = (select auth.uid())
      );
    exception
      when invalid_text_representation then
        return false;
    end;
    $body$
  $function$;

  revoke all on function public.can_access_medical_document_object(text) from public;
  grant execute on function public.can_access_medical_document_object(text) to authenticated;

  insert into storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
  )
  values (
    'medical-documents',
    'medical-documents',
    false,
    10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  )
  on conflict (id) do update
  set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload their own medical documents'
  ) then
    execute $policy$
      create policy "Users can upload their own medical documents"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'medical-documents'
        and public.can_access_medical_document_object(name)
      )
    $policy$;
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can read their own medical documents'
  ) then
    execute $policy$
      create policy "Users can read their own medical documents"
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'medical-documents'
        and public.can_access_medical_document_object(name)
      )
    $policy$;
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can update their own medical documents'
  ) then
    execute $policy$
      create policy "Users can update their own medical documents"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'medical-documents'
        and public.can_access_medical_document_object(name)
      )
      with check (
        bucket_id = 'medical-documents'
        and public.can_access_medical_document_object(name)
      )
    $policy$;
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete their own medical documents'
  ) then
    execute $policy$
      create policy "Users can delete their own medical documents"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'medical-documents'
        and public.can_access_medical_document_object(name)
      )
    $policy$;
  end if;
end $$;
