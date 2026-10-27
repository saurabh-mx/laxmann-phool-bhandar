-- ==============================================================
-- Laxman Phool Bhandar - Complete Supabase Database Schema
-- Run this in your Supabase Project -> SQL Editor -> Run
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

create policy "Allow public read access to services"
  on public.services for select using (true);

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

create policy "Allow public read access to gallery"
  on public.gallery for select using (true);

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
create policy "Public Access to Photos"
  on storage.objects for select
  using ( bucket_id = 'photos' );

create policy "Allow Upload to Photos"
  on storage.objects for insert
  with check ( bucket_id = 'photos' );

create policy "Allow Update/Delete to Photos"
  on storage.objects for all
  using ( bucket_id = 'photos' );
