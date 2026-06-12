create table public.portfolio_about_items (
  id uuid not null default uuid_generate_v4(),
  title varchar(120) not null,
  description text not null,
  icon varchar(80),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_about_items_pkey primary key (id)
);

create index portfolio_about_items_active_sort_idx
on public.portfolio_about_items (is_active, sort_order);

alter table public.portfolio_about_items enable row level security;

create policy "public_can_read_portfolio_about_items"
on public.portfolio_about_items
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_about_items"
on public.portfolio_about_items
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_about_items_updated_at
before update on public.portfolio_about_items
for each row
execute function public.set_updated_at();
