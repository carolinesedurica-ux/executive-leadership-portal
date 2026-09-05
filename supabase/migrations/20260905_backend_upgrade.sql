-- Executive Leadership Coaching Portal
-- Additive Supabase backend upgrade. No frontend redesign is required.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  role text not null default 'client' check (role in ('client','admin')),
  email_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists profiles_email_lower_uidx on public.profiles (lower(email));

create table if not exists public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('draft','active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes(id) on delete cascade,
  milestone_key text not null,
  milestone_number integer not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(programme_id,milestone_key),
  unique(programme_id,milestone_number)
);

create table if not exists public.participant_programmes (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  programme_id uuid not null references public.programmes(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','paused','withdrawn')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(participant_id,programme_id)
);

create table if not exists public.milestone_progress (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  status text not null default 'unlocked' check (status in ('locked','unlocked','in_progress','completed')),
  score numeric,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(participant_id,milestone_id)
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  scores jsonb not null,
  reflections jsonb not null default '{}'::jsonb,
  average_score numeric,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(participant_id,milestone_id)
);

create table if not exists public.milestone_access_tokens (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  token_hash text not null,
  credential_reference text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  status text not null default 'active' check (status in ('active','used','revoked','expired')),
  email_sent_at timestamptz,
  email_last_error text,
  created_at timestamptz not null default now()
);
create unique index if not exists milestone_access_tokens_hash_uidx on public.milestone_access_tokens(token_hash);
create unique index if not exists milestone_access_tokens_active_uidx
  on public.milestone_access_tokens(participant_id,milestone_id)
  where status='active' and revoked_at is null;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid references public.profiles(id) on delete set null,
  event text not null,
  milestone_id uuid references public.milestones(id) on delete set null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists milestone_progress_participant_idx on public.milestone_progress(participant_id);
create index if not exists audit_logs_participant_created_idx on public.audit_logs(participant_id,created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists programmes_updated_at on public.programmes;
create trigger programmes_updated_at before update on public.programmes for each row execute function public.set_updated_at();
drop trigger if exists milestones_updated_at on public.milestones;
create trigger milestones_updated_at before update on public.milestones for each row execute function public.set_updated_at();
drop trigger if exists milestone_progress_updated_at on public.milestone_progress;
create trigger milestone_progress_updated_at before update on public.milestone_progress for each row execute function public.set_updated_at();
drop trigger if exists assessment_results_updated_at on public.assessment_results;
create trigger assessment_results_updated_at before update on public.assessment_results for each row execute function public.set_updated_at();

insert into public.programmes(slug,name,description,status)
values(
  'executive-leadership-readiness',
  'Executive Leadership Readiness Programme',
  'Six-week executive leadership coaching programme delivered by Foundations Counselling Academy.',
  'active'
)
on conflict(slug) do update set name=excluded.name,description=excluded.description,status=excluded.status;

with p as (select id from public.programmes where slug='executive-leadership-readiness')
insert into public.milestones(programme_id,milestone_key,milestone_number,title,description)
select p.id,v.milestone_key,v.milestone_number,v.title,v.description
from p
cross join (
  values
    ('week1',1,'Leadership Identity & Confidence','Think Like a Leader Before You Have the Title'),
    ('week2',2,'Executive Presence & Personal Authority','Your Presence Speaks Before You Do'),
    ('week3',3,'Assertiveness & Difficult Conversations','Speak Clearly When the Conversation Is Difficult'),
    ('assessment',4,'Mid-Course Leadership Assessment','Mandatory progress review after Week 3'),
    ('week4',5,'Leading People with Confidence','From personal leadership to people leadership'),
    ('week5',6,'Workplace Dynamics, Influence & Executive Communication','Navigate workplace dynamics and influence ethically'),
    ('week6',7,'Leadership Integration & Personal Action Plan','Integrate the programme into a forward leadership plan')
) as v(milestone_key,milestone_number,title,description)
on conflict(programme_id,milestone_key) do update set
  milestone_number=excluded.milestone_number,title=excluded.title,description=excluded.description;

create or replace function public.current_profile_id()
returns uuid language sql stable security definer set search_path=public as $$
  select id from public.profiles where user_id=auth.uid() limit 1
$$;

create or replace function public.current_profile_is_admin()
returns boolean language sql stable security definer set search_path=public as $$
  select coalesce((select role='admin' from public.profiles where user_id=auth.uid() limit 1),false)
$$;

alter table public.profiles enable row level security;
alter table public.programmes enable row level security;
alter table public.milestones enable row level security;
alter table public.participant_programmes enable row level security;
alter table public.milestone_progress enable row level security;
alter table public.assessment_results enable row level security;
alter table public.milestone_access_tokens enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists profiles_read_own_or_admin on public.profiles;
create policy profiles_read_own_or_admin on public.profiles for select to authenticated
using (user_id=auth.uid() or public.current_profile_is_admin());
drop policy if exists programmes_read_authenticated on public.programmes;
create policy programmes_read_authenticated on public.programmes for select to authenticated using (true);
drop policy if exists milestones_read_authenticated on public.milestones;
create policy milestones_read_authenticated on public.milestones for select to authenticated using (true);
drop policy if exists participant_programmes_read_own_or_admin on public.participant_programmes;
create policy participant_programmes_read_own_or_admin on public.participant_programmes for select to authenticated
using (participant_id=public.current_profile_id() or public.current_profile_is_admin());
drop policy if exists milestone_progress_read_own_or_admin on public.milestone_progress;
create policy milestone_progress_read_own_or_admin on public.milestone_progress for select to authenticated
using (participant_id=public.current_profile_id() or public.current_profile_is_admin());
drop policy if exists assessment_results_read_own_or_admin on public.assessment_results;
create policy assessment_results_read_own_or_admin on public.assessment_results for select to authenticated
using (participant_id=public.current_profile_id() or public.current_profile_is_admin());
drop policy if exists milestone_access_tokens_read_own_or_admin on public.milestone_access_tokens;
create policy milestone_access_tokens_read_own_or_admin on public.milestone_access_tokens for select to authenticated
using (participant_id=public.current_profile_id() or public.current_profile_is_admin());
drop policy if exists audit_logs_read_own_or_admin on public.audit_logs;
create policy audit_logs_read_own_or_admin on public.audit_logs for select to authenticated
using (participant_id=public.current_profile_id() or public.current_profile_is_admin());

create or replace function public.complete_milestone_transition(
  p_participant_id uuid,
  p_current_key text,
  p_next_key text,
  p_token_hash text,
  p_credential_reference text,
  p_expires_at timestamptz,
  p_score numeric default null,
  p_assessment_scores jsonb default null,
  p_assessment_reflections jsonb default null
)
returns table(
  current_milestone_id uuid,
  next_milestone_id uuid,
  token_id uuid,
  credential_reference text,
  credential_created boolean
)
language plpgsql security definer set search_path=public as $$
declare
  v_programme_id uuid;
  v_current_id uuid;
  v_next_id uuid;
  v_status text;
  v_token_id uuid;
  v_reference text;
  v_created boolean := false;
begin
  select pp.programme_id into v_programme_id
  from public.participant_programmes pp
  where pp.participant_id=p_participant_id and pp.status='active'
  order by pp.enrolled_at limit 1;
  if v_programme_id is null then raise exception 'Active programme enrollment not found'; end if;

  select m.id into v_current_id from public.milestones m
  where m.programme_id=v_programme_id and m.milestone_key=p_current_key;
  if v_current_id is null then raise exception 'Current milestone not found'; end if;

  select mp.status into v_status from public.milestone_progress mp
  where mp.participant_id=p_participant_id and mp.milestone_id=v_current_id;
  if v_status is null or v_status='locked' then raise exception 'Milestone is not unlocked'; end if;

  update public.milestone_progress
  set status='completed',score=coalesce(p_score,score),started_at=coalesce(started_at,now()),completed_at=coalesce(completed_at,now())
  where participant_id=p_participant_id and milestone_id=v_current_id;

  update public.milestone_access_tokens
  set status='used',used_at=coalesce(used_at,now())
  where participant_id=p_participant_id and milestone_id=v_current_id and status='active' and revoked_at is null;

  if p_assessment_scores is not null then
    insert into public.assessment_results(participant_id,milestone_id,scores,reflections,average_score,submitted_at)
    values(p_participant_id,v_current_id,p_assessment_scores,coalesce(p_assessment_reflections,'{}'::jsonb),p_score,now())
    on conflict(participant_id,milestone_id) do update set
      scores=excluded.scores,reflections=excluded.reflections,average_score=excluded.average_score,submitted_at=excluded.submitted_at;
  end if;

  insert into public.audit_logs(participant_id,event,milestone_id,metadata)
  values(p_participant_id,case when p_current_key='assessment' then 'assessment_completed' else 'milestone_completed' end,v_current_id,jsonb_build_object('milestoneKey',p_current_key));

  if p_next_key is not null then
    select m.id into v_next_id from public.milestones m
    where m.programme_id=v_programme_id and m.milestone_key=p_next_key;
    if v_next_id is null then raise exception 'Next milestone not found'; end if;

    insert into public.milestone_progress(participant_id,milestone_id,status)
    values(p_participant_id,v_next_id,'unlocked')
    on conflict(participant_id,milestone_id) do update set
      status=case
        when public.milestone_progress.status='completed' then 'completed'
        when public.milestone_progress.status='in_progress' then 'in_progress'
        else 'unlocked'
      end;

    update public.milestone_access_tokens set status='expired'
    where participant_id=p_participant_id and milestone_id=v_next_id and status='active' and expires_at<=now();

    select t.id,t.credential_reference into v_token_id,v_reference
    from public.milestone_access_tokens t
    where t.participant_id=p_participant_id and t.milestone_id=v_next_id
      and t.status='active' and t.revoked_at is null and t.expires_at>now()
    order by t.issued_at desc limit 1;

    if v_token_id is null then
      if p_token_hash is null or p_credential_reference is null or p_expires_at is null then
        raise exception 'Credential material is required for the next milestone';
      end if;
      insert into public.milestone_access_tokens(participant_id,milestone_id,token_hash,credential_reference,expires_at,status)
      values(p_participant_id,v_next_id,p_token_hash,p_credential_reference,p_expires_at,'active')
      returning id,public.milestone_access_tokens.credential_reference into v_token_id,v_reference;
      v_created := true;
    end if;

    insert into public.audit_logs(participant_id,event,milestone_id,metadata)
    values(p_participant_id,'milestone_unlocked',v_next_id,jsonb_build_object('milestoneKey',p_next_key,'credentialCreated',v_created));
  end if;

  return query select v_current_id,v_next_id,v_token_id,v_reference,v_created;
end
$$;

revoke all on function public.complete_milestone_transition(uuid,text,text,text,text,timestamptz,numeric,jsonb,jsonb) from public;
revoke all on function public.complete_milestone_transition(uuid,text,text,text,text,timestamptz,numeric,jsonb,jsonb) from anon;
revoke all on function public.complete_milestone_transition(uuid,text,text,text,text,timestamptz,numeric,jsonb,jsonb) from authenticated;
grant execute on function public.complete_milestone_transition(uuid,text,text,text,text,timestamptz,numeric,jsonb,jsonb) to service_role;
