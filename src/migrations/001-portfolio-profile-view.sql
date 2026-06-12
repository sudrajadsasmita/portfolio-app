create or replace view public.portfolio_profile
with (security_invoker = true)
as
select
  id,
  name,
  title as role,
  headline,
  bio as description,
  availability,
  email,
  phone,
  location,
  resume_url as cv_url,
  avatar_url,
  social_links ->> 'website' as site_url,
  created_at,
  updated_at
from public.profiles
where deleted_at is null;
