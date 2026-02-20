-- Create tables that were originally created via Supabase dashboard.
-- Using IF NOT EXISTS so this is safe to run on existing databases.

-- Comments table
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  comment text not null,
  post_id text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

-- Subscriptions table
create table if not exists public.subscriptions (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Authors table
create table if not exists public.authors (
  name text primary key,
  bio text not null default '',
  x_link text,
  fb_link text,
  insta_link text,
  pfp_link text
);

alter table public.authors enable row level security;
