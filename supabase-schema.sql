-- ==============================================================
-- Laxman Phool Bhandar - Complete Idempotent Supabase Schema
-- Safe to run multiple times in Supabase -> SQL Editor -> Run
-- ==============================================================

-- 1. Services Table
create table if not exists public.services (
  id text primary key,
  title text not null,
  category text not null default 'weddings',
  short text not null default '',
  description text not null default '',
  price text not null default '',
  starting_numeric_price numeric not null default 0,
  image text not null default '',
  tag text not null default '',
  features jsonb not null default '[]'::jsonb,
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

drop policy if exists "Allow public read access to services" on public.services;
create policy "Allow public read access to services"
  on public.services for select using (true);

drop policy if exists "Allow all write access to services" on public.services;
create policy "Allow all write access to services"
  on public.services for all using (true) with check (true);


-- 2. Photo Showcase / Gallery Table
create table if not exists public.gallery (
  id text primary key,
  title text not null,
  category text not null default 'weddings',
  category_label text not null default '',
  image text not null,
  aspect text not null default 'square',
  highlight text not null default '',
  display_order int not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gallery enable row level security;

drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow public read gallery" on public.gallery;
create policy "Allow public read access to gallery"
  on public.gallery for select using (true);

drop policy if exists "Allow all write access to gallery" on public.gallery;
drop policy if exists "Allow write gallery" on public.gallery;
create policy "Allow all write access to gallery"
  on public.gallery for all using (true) with check (true);


-- 3. Storage Bucket for Photos (Supabase Storage)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  true,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update set public = true;

-- Storage Policies for 'photos' bucket
drop policy if exists "Public Access to Photos" on storage.objects;
create policy "Public Access to Photos"
  on storage.objects for select
  using ( bucket_id = 'photos' );

drop policy if exists "Allow Upload to Photos" on storage.objects;
create policy "Allow Upload to Photos"
  on storage.objects for insert
  with check ( bucket_id = 'photos' );

drop policy if exists "Allow Update/Delete to Photos" on storage.objects;
drop policy if exists "Allow Manage Photos" on storage.objects;
create policy "Allow Update/Delete to Photos"
  on storage.objects for all
  using ( bucket_id = 'photos' );


-- 4. Pricing Estimator Configuration Table
create table if not exists public.pricing_config (
  id text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.pricing_config enable row level security;

drop policy if exists "Allow public read pricing_config" on public.pricing_config;
create policy "Allow public read pricing_config"
  on public.pricing_config for select using (true);

drop policy if exists "Allow all write pricing_config" on public.pricing_config;
create policy "Allow all write pricing_config"
  on public.pricing_config for all using (true) with check (true);
