-- Create admin_users table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'editor' check (role in ('super_admin', 'admin', 'editor')),
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- Index on user_id for fast lookups
create index if not exists idx_admin_users_user_id on public.admin_users (user_id);

-- Enable RLS
alter table public.admin_users enable row level security;
