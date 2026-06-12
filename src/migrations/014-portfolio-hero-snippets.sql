create table public.portfolio_hero_snippets (
  id uuid not null default uuid_generate_v4(),
  filename varchar(100) not null default 'developer.ts',
  code text not null,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_hero_snippets_pkey primary key (id)
);

create unique index portfolio_hero_snippets_singleton_active_idx
on public.portfolio_hero_snippets ((true))
where is_active = true;

alter table public.portfolio_hero_snippets enable row level security;

create policy "public_can_read_portfolio_hero_snippets"
on public.portfolio_hero_snippets
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_hero_snippets"
on public.portfolio_hero_snippets
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_hero_snippets_updated_at
before update on public.portfolio_hero_snippets
for each row
execute function public.set_updated_at();
