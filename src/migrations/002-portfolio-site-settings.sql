create table public.portfolio_site_settings (
  id uuid not null default uuid_generate_v4(),
  site_name varchar(120) not null,
  title varchar(180) not null,
  description text not null,
  og_image_url text,
  twitter_card varchar(80) not null default 'summary_large_image',
  favicon_url text,
  contact_cta_title varchar(160),
  contact_cta_description text,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_site_settings_pkey primary key (id)
);

create unique index portfolio_site_settings_singleton_active_idx
on public.portfolio_site_settings ((true))
where is_active = true;

alter table public.portfolio_site_settings enable row level security;

create policy "public_can_read_portfolio_site_settings"
on public.portfolio_site_settings
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_site_settings"
on public.portfolio_site_settings
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_site_settings_updated_at
before update on public.portfolio_site_settings
for each row
execute function public.set_updated_at();
