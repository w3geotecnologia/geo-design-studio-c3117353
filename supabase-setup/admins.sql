-- Tabela de administradores (lista de e-mails autorizados a acessar o dashboard)
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.admins to authenticated;
grant all on public.admins to service_role;

alter table public.admins enable row level security;

-- Função SECURITY DEFINER para verificar se o usuário atual é admin (evita recursão na RLS)
create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where a.user_id = _user_id
       or a.email = (select email from auth.users where id = _user_id)
  )
$$;

drop policy if exists "admins can view admins" on public.admins;
create policy "admins can view admins" on public.admins
  for select to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "admins can insert admins" on public.admins;
create policy "admins can insert admins" on public.admins
  for insert to authenticated
  with check (public.is_admin(auth.uid()));

drop policy if exists "admins can update admins" on public.admins;
create policy "admins can update admins" on public.admins
  for update to authenticated
  using (public.is_admin(auth.uid()));

drop policy if exists "admins can delete admins" on public.admins;
create policy "admins can delete admins" on public.admins
  for delete to authenticated
  using (public.is_admin(auth.uid()));

-- Seed do admin inicial
insert into public.admins (email)
values ('ivandelima@gmail.com')
on conflict (email) do nothing;
