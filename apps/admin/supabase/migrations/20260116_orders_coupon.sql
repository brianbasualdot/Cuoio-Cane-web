-- Add coupon_code to orders table
alter table public.orders 
add column if not exists coupon_code text;

-- Ensure discount_amount exists (it should, but just in case)
alter table public.orders 
add column if not exists discount_amount numeric not null default 0;
