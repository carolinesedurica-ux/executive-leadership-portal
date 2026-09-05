create table if not exists public.credential_escrow (
  reference text primary key,
  ciphertext text not null,
  created_at timestamptz not null default now()
);

alter table public.credential_escrow enable row level security;

revoke all on public.credential_escrow from anon, authenticated;
grant select, insert, update, delete on public.credential_escrow to service_role;
