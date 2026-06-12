create table public.portfolio_skills (
  id uuid not null default uuid_generate_v4(),
  category varchar(80) not null,
  name varchar(100) not null,
  description text,
  icon varchar(80),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_skills_pkey primary key (id)
);

create index portfolio_skills_category_sort_idx
on public.portfolio_skills (category, is_active, sort_order);

alter table public.portfolio_skills enable row level security;

create policy "public_can_read_portfolio_skills"
on public.portfolio_skills
for select
using (is_active = true);

create policy "authenticated_can_manage_portfolio_skills"
on public.portfolio_skills
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_skills_updated_at
before update on public.portfolio_skills
for each row
execute function public.set_updated_at();
