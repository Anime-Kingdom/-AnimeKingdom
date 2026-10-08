-- Install once in Supabase SQL Editor. Applies only to NEW checkout orders.
-- Stock and order insertion commit together or both roll back.
begin;
create or replace function public.ak_reduce_stock_for_order()
returns trigger language plpgsql security definer set search_path='' as $$
declare item jsonb; line record; updated_id text;
begin
 if new.form_type is distinct from 'checkout' then return new; end if;
 if jsonb_typeof(new.form_data->'items') is distinct from 'array' then
   raise exception 'Order must contain items';
 end if;
 if jsonb_array_length(new.form_data->'items')=0 or jsonb_array_length(new.form_data->'items')>100 then
   raise exception 'Order must contain between 1 and 100 items';
 end if;
 for item in select value from jsonb_array_elements(new.form_data->'items') loop
   if jsonb_typeof(item->'id') is distinct from 'string'
      or coalesce(item->>'id','') !~ '^[-a-zA-Z0-9_]+$'
      or jsonb_typeof(item->'qty') is distinct from 'number' then
     raise exception 'Invalid order item';
   end if;
   if (item->>'qty')::numeric<1 or (item->>'qty')::numeric>2147483647
      or (item->>'qty')::numeric<>trunc((item->>'qty')::numeric) then
     raise exception 'Invalid order quantity';
   end if;
 end loop;
 -- Aggregate repeated product IDs (including variants), lock in a stable order.
 for line in
   select value->>'id' as id, sum((value->>'qty')::numeric) as qty
   from jsonb_array_elements(new.form_data->'items') group by value->>'id' order by value->>'id'
 loop
   update public.ak_products
   set data=jsonb_set(data,'{stock}',to_jsonb((data->>'stock')::numeric-line.qty))
   where id=line.id and (data->>'stock')::numeric>=line.qty
   returning id into updated_id;
   if not found then
     raise exception 'Insufficient stock or unavailable product: %',line.id;
   end if;
 end loop;
 return new;
end;
$$;
revoke all on function public.ak_reduce_stock_for_order() from public, anon, authenticated;
drop trigger if exists ak_order_reduce_stock on public."AK orders";
create trigger ak_order_reduce_stock after insert on public."AK orders"
for each row execute function public.ak_reduce_stock_for_order();
commit;
-- Confirm installation; existing orders are NOT deducted again.
select tgname as installed_trigger from pg_trigger
where tgrelid='public."AK orders"'::regclass and tgname='ak_order_reduce_stock';