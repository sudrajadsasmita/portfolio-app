create table public.portfolio_project_highlights (
  id uuid not null default uuid_generate_v4(),
  project_id uuid not null,
  highlight text not null,
  sort_order integer not null default 0,
  created_at timestamp without time zone not null default now(),
  constraint portfolio_project_highlights_pkey primary key (id),
  constraint portfolio_project_highlights_project_id_fkey
    foreign key (project_id)
    references public.portfolio_projects (id)
    on delete cascade
);

create index portfolio_project_highlights_project_sort_idx
on public.portfolio_project_highlights (project_id, sort_order);

alter table public.portfolio_project_highlights enable row level security;

create policy "public_can_read_portfolio_project_highlights"
on public.portfolio_project_highlights
for select
using (
  exists (
    select 1
    from public.portfolio_projects
    where portfolio_projects.id = portfolio_project_highlights.project_id
      and portfolio_projects.is_published = true
  )
);

create policy "authenticated_can_manage_portfolio_project_highlights"
on public.portfolio_project_highlights
for all
to authenticated
using (true)
with check (true);
