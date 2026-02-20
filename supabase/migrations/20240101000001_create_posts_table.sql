-- Create posts table
create table if not exists public.posts (
  id text primary key,  -- slug-based ID
  title text not null,
  date timestamptz not null,
  excerpt text not null default '',
  content text not null default '',  -- raw markdown
  content_html text not null default '',  -- pre-rendered HTML
  author text not null default '',
  tags text[] not null default '{}',
  cover_image text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_posts_date on public.posts (date desc);
create index if not exists idx_posts_published on public.posts (published);
create index if not exists idx_posts_author on public.posts (author);
create index if not exists idx_posts_tags on public.posts using gin (tags);

-- Auto-update trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_posts_updated
  before update on public.posts
  for each row
  execute function public.handle_updated_at();

-- Enable RLS
alter table public.posts enable row level security;
