create table if not exists public.weekly_test_results (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  answers jsonb not null,
  mcq_score numeric not null check (mcq_score between 0 and 50),
  written_score numeric not null check (written_score between 0 and 50),
  score numeric not null check (score between 0 and 100),
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(participant_id,milestone_id)
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.profiles(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id) on delete cascade,
  attempt_number integer not null check (attempt_number between 1 and 3),
  scores jsonb not null,
  reflections jsonb not null default '{}'::jsonb,
  final_assessment_percent numeric not null check (final_assessment_percent between 0 and 100),
  weekly_weighted_score numeric not null check (weekly_weighted_score between 0 and 30),
  overall_score numeric not null check (overall_score between 0 and 100),
  passed boolean not null default false,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(participant_id,milestone_id,attempt_number)
);

create index if not exists weekly_test_results_participant_idx
  on public.weekly_test_results(participant_id);
create index if not exists assessment_attempts_participant_idx
  on public.assessment_attempts(participant_id,submitted_at desc);

alter table public.weekly_test_results enable row level security;
alter table public.assessment_attempts enable row level security;

revoke all on public.weekly_test_results from anon, authenticated;
revoke all on public.assessment_attempts from anon, authenticated;
grant select,insert,update,delete on public.weekly_test_results to service_role;
grant select,insert,update,delete on public.assessment_attempts to service_role;

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
  values(p_participant_id,case when p_current_key='assessment' then 'assessment_completed' else 'milestone_completed' end,v_current_id,jsonb_build_object('milestoneKey',p_current_key,'score',p_score));

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

    if p_token_hash is not null and p_credential_reference is not null and p_expires_at is not null then
      update public.milestone_access_tokens set status='expired'
      where participant_id=p_participant_id and milestone_id=v_next_id and status='active' and expires_at<=now();

      select t.id,t.credential_reference into v_token_id,v_reference
      from public.milestone_access_tokens t
      where t.participant_id=p_participant_id and t.milestone_id=v_next_id
        and t.status='active' and t.revoked_at is null and t.expires_at>now()
      order by t.issued_at desc limit 1;

      if v_token_id is null then
        insert into public.milestone_access_tokens(participant_id,milestone_id,token_hash,credential_reference,expires_at,status)
        values(p_participant_id,v_next_id,p_token_hash,p_credential_reference,p_expires_at,'active')
        returning id,public.milestone_access_tokens.credential_reference into v_token_id,v_reference;
        v_created := true;
      end if;
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

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
