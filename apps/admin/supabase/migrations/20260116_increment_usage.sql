create or replace function increment_discount_usage(discount_id uuid)
returns void as $$
begin
  update public.discounts
  set used_count = used_count + 1
  where id = discount_id;
end;
$$ language plpgsql security definer;
