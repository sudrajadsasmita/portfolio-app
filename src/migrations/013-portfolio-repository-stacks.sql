create table public.portfolio_repository_stacks (
  id uuid not null default uuid_generate_v4(),
  repository_id uuid not null,
  name varchar(100) not null,
  sort_order integer not null default 0,
  created_at timestamp without time zone not null default now(),
  constraint portfolio_repository_stacks_pkey primary key (id),
  constraint portfolio_repository_stacks_repository_id_fkey
    foreign key (repository_id)
    references public.portfolio_repositories (id)
    on delete cascade
);

create index portfolio_repository_stacks_repository_sort_idx
on public.portfolio_repository_stacks (repository_id, sort_order);

alter table public.portfolio_repository_stacks enable row level security;

create policy "public_can_read_portfolio_repository_stacks"
on public.portfolio_repository_stacks
for select
using (
  exists (
    select 1
    from public.portfolio_repositories
    where portfolio_repositories.id = portfolio_repository_stacks.repository_id
      and portfolio_repositories.is_active = true
  )
);

create policy "authenticated_can_manage_portfolio_repository_stacks"
on public.portfolio_repository_stacks
for all
to authenticated
using (true)
with check (true);
