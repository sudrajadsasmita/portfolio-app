create table public.portfolio_repositories (
  id uuid not null default uuid_generate_v4(),
  name varchar(160) not null,
  description text not null,
  url text not null,
  stars integer not null default 0,
  forks integer not null default 0,
  language varchar(80),
  is_pinned boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_repositories_pkey primary key (id)
);

create index portfolio_repositories_active_pinned_sort_idx
on public.portfolio_repositories (is_active, is_pinned, sort_order);

alter table public.portfolio_repositories enable row level security;

create policy "public_can_read_portfolio_repositories"
on public.portfolio_repositories
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_repositories"
on public.portfolio_repositories
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_repositories_updated_at
before update on public.portfolio_repositories
for each row
execute function public.set_updated_at();
