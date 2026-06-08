-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
  id uuid not null default uuid_generate_v4(),

  name varchar(255) not null,
  title varchar(255),
  headline varchar(500),
  bio text,

  avatar_url varchar(500),
  resume_url varchar(500),

  location varchar(255),
  email varchar(255),
  phone varchar(50),

  social_links jsonb,
  availability varchar(255),

  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  deleted_at timestamp without time zone,

  constraint profiles_pkey primary key (id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Public can read active profile
create policy "public_can_read_profiles"
on public.profiles
for select
using (deleted_at is null);

-- Authenticated admin can insert profile
create policy "authenticated_can_insert_profiles"
on public.profiles
for insert
to authenticated
with check (true);

-- Authenticated admin can update profile
create policy "authenticated_can_update_profiles"
on public.profiles
for update
to authenticated
using (true)
with check (true);

-- Authenticated admin can delete profile
create policy "authenticated_can_delete_profiles"
on public.profiles
for delete
to authenticated
using (true);

-- Ensure only one active profile exists
create unique index profiles_singleton_active_idx
on public.profiles ((true))
where deleted_at is null;

-- Auto update updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();