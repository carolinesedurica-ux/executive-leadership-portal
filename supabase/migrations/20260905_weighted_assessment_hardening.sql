create index if not exists weekly_test_results_milestone_idx
  on public.weekly_test_results(milestone_id);
create index if not exists assessment_attempts_milestone_idx
  on public.assessment_attempts(milestone_id);

drop policy if exists weekly_test_results_read_own_or_admin on public.weekly_test_results;
create policy weekly_test_results_read_own_or_admin
on public.weekly_test_results for select to authenticated
using (
  participant_id = private.current_profile_id()
  or private.current_profile_is_admin()
);

drop policy if exists assessment_attempts_read_own_or_admin on public.assessment_attempts;
create policy assessment_attempts_read_own_or_admin
on public.assessment_attempts for select to authenticated
using (
  participant_id = private.current_profile_id()
  or private.current_profile_is_admin()
);
