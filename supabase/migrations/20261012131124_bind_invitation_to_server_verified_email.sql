drop function public.redeem_programme_invitation(uuid,text,text); create function public.redeem_programme_invitation(candidate_id uuid, selected_programme text, supplied_hash text, candidate_email text) returns boolean language plpgsql security invoker set search_path=public,pg_temp as $$
declare invitation_id uuid; verified_email text;
begin
verified_email:=lower(trim(candidate_email));
if verified_email is null then return false; end if;
update public.programme_invitations set used_at=now() where code_hash=supplied_hash and email=verified_email and programme=selected_programme and used_at is null and expires_at>now() returning id into invitation_id;
if invitation_id is null then return false; end if;
insert into public.programme_access(user_id,programme,status) values(candidate_id,selected_programme,'active') on conflict(user_id,programme) do update set status='active',granted_at=now();
return true; end; $$;
revoke all on function public.redeem_programme_invitation(uuid,text,text,text) from public,anon,authenticated; grant execute on function public.redeem_programme_invitation(uuid,text,text,text) to service_role;
