-- Wedding companion schema.
-- Run this in the Supabase SQL editor, then create the storage bucket below.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- photos ----
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null unique,
  uploader_name text,
  hidden        boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists photos_created_at_idx on public.photos (created_at desc);

alter table public.photos enable row level security;

-- Guests see only what has not been hidden.
drop policy if exists "photos are readable" on public.photos;
create policy "photos are readable"
  on public.photos for select
  to anon
  using (hidden = false);

-- Guests may add a photo, but never pre-hidden and never on someone else's row.
drop policy if exists "guests may add photos" on public.photos;
create policy "guests may add photos"
  on public.photos for insert
  to anon
  with check (hidden = false and length(coalesce(uploader_name, '')) <= 40);

-- No anon update or delete: moderation goes through the service-role key.

-- ---------------------------------------------------------------- wishes ----
create table if not exists public.wishes (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  message    text not null,
  hidden     boolean not null default false,
  created_at timestamptz not null default now(),
  constraint wishes_message_length check (char_length(message) between 1 and 600)
);

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

alter table public.wishes enable row level security;

drop policy if exists "wishes are readable" on public.wishes;
create policy "wishes are readable"
  on public.wishes for select
  to anon
  using (hidden = false);

drop policy if exists "guests may sign the guestbook" on public.wishes;
create policy "guests may sign the guestbook"
  on public.wishes for insert
  to anon
  with check (hidden = false and length(coalesce(name, '')) <= 40);

-- --------------------------------------------------------------- storage ----
-- Public bucket so the wall can render images directly.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'wedding-photos',
  'wedding-photos',
  true,
  12582912,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "wedding photos are public" on storage.objects;
create policy "wedding photos are public"
  on storage.objects for select
  to anon
  using (bucket_id = 'wedding-photos');

drop policy if exists "guests may upload photos" on storage.objects;
create policy "guests may upload photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'wedding-photos');
