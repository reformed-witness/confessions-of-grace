-- Helper function: check if current user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Helper function: check if current user has a specific role or higher
create or replace function public.has_admin_role(required_role text)
returns boolean as $$
declare
  user_role text;
begin
  select role into user_role from public.admin_users
  where user_id = auth.uid();

  if user_role is null then
    return false;
  end if;

  -- Role hierarchy: super_admin > admin > editor
  if required_role = 'editor' then
    return user_role in ('editor', 'admin', 'super_admin');
  elsif required_role = 'admin' then
    return user_role in ('admin', 'super_admin');
  elsif required_role = 'super_admin' then
    return user_role = 'super_admin';
  end if;

  return false;
end;
$$ language plpgsql security definer;

-- ============================================
-- POSTS policies (drop first in case of partial previous run)
-- ============================================
drop policy if exists "Public can read published posts" on public.posts;
drop policy if exists "Editors can insert posts" on public.posts;
drop policy if exists "Editors can update posts" on public.posts;
drop policy if exists "Admins can delete posts" on public.posts;

create policy "Public can read published posts"
  on public.posts for select
  using (published = true or public.is_admin());

create policy "Editors can insert posts"
  on public.posts for insert
  with check (public.has_admin_role('editor'));

create policy "Editors can update posts"
  on public.posts for update
  using (public.has_admin_role('editor'));

create policy "Admins can delete posts"
  on public.posts for delete
  using (public.has_admin_role('admin'));

-- ============================================
-- COMMENTS policies
-- ============================================
drop policy if exists "Public can read comments" on public.comments;
drop policy if exists "Public can insert comments" on public.comments;
drop policy if exists "Editors can delete comments" on public.comments;
drop policy if exists "Editors can update comments" on public.comments;

create policy "Public can read comments"
  on public.comments for select
  using (true);

create policy "Public can insert comments"
  on public.comments for insert
  with check (true);

create policy "Editors can delete comments"
  on public.comments for delete
  using (public.has_admin_role('editor'));

create policy "Editors can update comments"
  on public.comments for update
  using (public.has_admin_role('editor'));

-- ============================================
-- SUBSCRIPTIONS policies
-- ============================================
drop policy if exists "Public can insert subscriptions" on public.subscriptions;
drop policy if exists "Public can read subscriptions" on public.subscriptions;
drop policy if exists "Admins can delete subscriptions" on public.subscriptions;

create policy "Public can insert subscriptions"
  on public.subscriptions for insert
  with check (true);

create policy "Public can read subscriptions"
  on public.subscriptions for select
  using (true);

create policy "Admins can delete subscriptions"
  on public.subscriptions for delete
  using (public.has_admin_role('admin'));

-- ============================================
-- AUTHORS policies
-- ============================================
drop policy if exists "Public can read authors" on public.authors;
drop policy if exists "Admins can insert authors" on public.authors;
drop policy if exists "Admins can update authors" on public.authors;
drop policy if exists "Super admins can delete authors" on public.authors;

create policy "Public can read authors"
  on public.authors for select
  using (true);

create policy "Admins can insert authors"
  on public.authors for insert
  with check (public.has_admin_role('admin'));

create policy "Admins can update authors"
  on public.authors for update
  using (public.has_admin_role('admin'));

create policy "Super admins can delete authors"
  on public.authors for delete
  using (public.has_admin_role('super_admin'));

-- ============================================
-- ADMIN_USERS policies
-- ============================================
drop policy if exists "Admins can read admin users" on public.admin_users;
drop policy if exists "Super admins can insert admin users" on public.admin_users;
drop policy if exists "Super admins can update admin users" on public.admin_users;
drop policy if exists "Super admins can delete admin users" on public.admin_users;

create policy "Admins can read admin users"
  on public.admin_users for select
  using (public.is_admin());

create policy "Super admins can insert admin users"
  on public.admin_users for insert
  with check (public.has_admin_role('super_admin'));

create policy "Super admins can update admin users"
  on public.admin_users for update
  using (public.has_admin_role('super_admin'));

create policy "Super admins can delete admin users"
  on public.admin_users for delete
  using (public.has_admin_role('super_admin'));
