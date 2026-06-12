create table public.portfolio_projects (
  id uuid not null default uuid_generate_v4(),
  title varchar(160) not null,
  slug varchar(180) not null,
  description text not null,
  image_url text,
  image_alt varchar(180),
  mockup_label varchar(120),
  demo_url text,
  source_url text,
  case_study_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint portfolio_projects_pkey primary key (id),
  constraint portfolio_projects_slug_unique unique (slug)
);

create index portfolio_projects_published_featured_sort_idx
on public.portfolio_projects (is_published, is_featured, sort_order);

alter table public.portfolio_projects enable row level security;

create policy "public_can_read_portfolio_projects"
on public.portfolio_projects
for select
using (is_published = true);

create policy "authenticated_can_manage_portfolio_projects"
on public.portfolio_projects
for all
to authenticated
using (true)
with check (true);

create trigger set_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row
execute function public.set_updated_at();
