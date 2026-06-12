create table public.portfolio_experience_highlights (
  id uuid not null default uuid_generate_v4(),
  experience_id uuid not null,
  highlight text not null,
  sort_order integer not null default 0,
  created_at timestamp without time zone not null default now(),
  constraint portfolio_experience_highlights_pkey primary key (id),
  constraint portfolio_experience_highlights_experience_id_fkey
    foreign key (experience_id)
    references public.portfolio_experiences (id)
    on delete cascade
);

create index portfolio_experience_highlights_experience_sort_idx
on public.portfolio_experience_highlights (experience_id, sort_order);

alter table public.portfolio_experience_highlights enable row level security;

create policy "public_can_read_portfolio_experience_highlights"
on public.portfolio_experience_highlights
for select
using (
  exists (
    select 1
    from public.portfolio_experiences
    where portfolio_experiences.id = portfolio_experience_highlights.experience_id
      and portfolio_experiences.is_active = true
  )
);

create policy "authenticated_can_manage_portfolio_experience_highlights"
on public.portfolio_experience_highlights
for all
to authenticated
using (true)
with check (true);
