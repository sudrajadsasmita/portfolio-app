create table public.portfolio_experiences (
  id uuid not null default uuid_generate_v4(),
  year_label varchar(80) not null,
  title varchar(160) not null,
  description text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_experiences_pkey primary key (id)
);

create index portfolio_experiences_active_sort_idx
on public.portfolio_experiences (is_active, sort_order);

alter table public.portfolio_experiences enable row level security;

create policy "public_can_read_portfolio_experiences"
on public.portfolio_experiences
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_experiences"
on public.portfolio_experiences
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_experiences_updated_at
before update on public.portfolio_experiences
for each row
execute function public.set_updated_at();
