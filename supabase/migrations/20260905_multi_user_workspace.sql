create table if not exists public.participant_workspace (
  participant_id uuid primary key references public.profiles(id) on delete cascade,
  elrp_state jsonb not null default '{}'::jsonb,
  daily_habits jsonb not null default '{}'::jsonb,
  priority_focus jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.participant_workspace enable row level security;

drop policy if exists participant_workspace_read_own_or_admin on public.participant_workspace;
create policy participant_workspace_read_own_or_admin
on public.participant_workspace
for select
to authenticated
using (
  participant_id = private.current_profile_id()
  or private.current_profile_is_admin()
);

revoke insert, update, delete on public.participant_workspace from anon, authenticated;
grant select on public.participant_workspace to authenticated;
grant select, insert, update, delete on public.participant_workspace to service_role;

create index if not exists participant_workspace_updated_idx
  on public.participant_workspace(updated_at desc);
