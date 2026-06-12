create table public.portfolio_social_links (
  id uuid not null default uuid_generate_v4(),
  label varchar(80) not null,
  platform varchar(80) not null,
  url text not null,
  icon varchar(80),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_social_links_pkey primary key (id)
);

create index portfolio_social_links_active_sort_idx
on public.portfolio_social_links (is_active, sort_order);

alter table public.portfolio_social_links enable row level security;

create policy "public_can_read_portfolio_social_links"
on public.portfolio_social_links
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_social_links"
on public.portfolio_social_links
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_social_links_updated_at
before update on public.portfolio_social_links
for each row
execute function public.set_updated_at();
