-- Create order_events table
create table if not exists public.order_events (
  id uuid not null default gen_random_uuid(),
  order_id uuid not null, -- Assuming valid foreign key to orders table exists, otherwise remove FK constraint or ensure orders table exists
  action text not null,
  actor_user_id uuid not null references auth.users(id),
  actor_role text not null,
  actor_alias text, -- Nullable, required for staff in app logic
  created_at timestamp with time zone not null default now(),
  constraint order_events_pkey primary key (id)
);

-- Enable RLS
alter table public.order_events enable row level security;

-- Policies for Admin
-- Assumes a 'profiles' table exists with 'role' column as established in middleware discussions.
-- Adjust the claim check 'app_metadata' or 'public.profiles' specific logic as per existing auth setup.
-- Here using a subquery to profiles for safety, assuming public.profiles exists.

create policy "Admins can view all events"
on public.order_events
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can insert events"
on public.order_events
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update events"
on public.order_events
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete events"
on public.order_events
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Policies for Staff
-- Staff can ONLY insert (log) events. They cannot see the log.
create policy "Staff can insert events"
on public.order_events
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'staff'
  )
);
