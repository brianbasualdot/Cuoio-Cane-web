-- Create discounts table
create table if not exists public.discounts (
  id uuid not null default gen_random_uuid(),
  code text not null,
  description text,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric not null check (value >= 0),
  applies_to text not null check (applies_to in ('order', 'product')),
  product_ids uuid[], -- Nullable, array of product IDs if applies_to = 'product'
  min_purchase_amount numeric not null default 0 check (min_purchase_amount >= 0),
  usage_limit integer, -- NULL means unlimited
  used_count integer not null default 0,
  active boolean not null default true,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  constraint discounts_pkey primary key (id),
  constraint discounts_code_key unique (code)
);

-- Enable RLS
alter table public.discounts enable row level security;

-- Policies for Admin (Full Access)
create policy "Admins can view all discounts"
on public.discounts
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can insert discounts"
on public.discounts
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can update discounts"
on public.discounts
for update
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admins can delete discounts"
on public.discounts
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- Policies for Staff (Read Only)
create policy "Staff can view discounts"
on public.discounts
for select
to authenticated
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'staff'
  )
);
