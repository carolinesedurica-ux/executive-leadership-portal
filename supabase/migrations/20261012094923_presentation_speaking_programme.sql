-- Independent four-week speaking programme; no changes to ELP enrolments or data.
create table public.speaking_enrolments (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  workspace jsonb not null default '{}'::jsonb,
  enrolled_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint speaking_workspace_object check (jsonb_typeof(workspace) = 'object')
);
alter table public.speaking_enrolments enable row level security;
revoke all on public.speaking_enrolments from anon, authenticated;
grant select on public.speaking_enrolments to authenticated;
grant select, insert, update, delete on public.speaking_enrolments to service_role;
create policy speaking_read_own on public.speaking_enrolments for select to authenticated
  using ((select auth.uid()) = user_id);
-- Writes are validated by the session-authenticated server API; admin review is read-only.
