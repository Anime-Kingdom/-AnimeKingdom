-- Only new pending submissions are accepted from the website.
alter table public."AK orders" enable row level security;
grant usage on schema public to anon;
grant insert on public."AK orders" to anon;
create policy "Website may submit pending forms" on public."AK orders"
for insert to anon with check (
  status = 'pending'
  and form_type in ('checkout','custom_figure','contact','profile','newsletter')
  and octet_length(form_data::text) <= 3000000
  and length(coalesce(customer_name,'')) between 1 and 300
  and length(coalesce(email,'')) between 3 and 320
  and length(coalesce(phone,'')) <= 30
  and screenshot_path is null
  and (form_type <> 'checkout' or (
    payment_method in ('cod','upi')
    and jsonb_typeof(form_data->'items') = 'array'
    and jsonb_array_length(form_data->'items') > 0
    and jsonb_typeof(form_data->'address') = 'object'
    and (payment_method = 'cod' or (
      utr_number ~ '^[0-9]{12}$'
      and coalesce(form_data->>'paymentScreenshot','') ~ '^data:image/(png|jpeg|webp);base64,'
    ))
  ))
);
-- No SELECT, UPDATE or DELETE policy is added for website visitors.
select relrowsecurity from pg_class where oid = 'public."AK orders"'::regclass;
select policyname, roles, cmd from pg_policies where schemaname = 'public' and tablename = 'AK orders';
