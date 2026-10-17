-- Customer-owned profiles; public catalog permissions are unchanged.
begin;
create table if not exists public.ak_customer_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 customer_id bigint generated always as identity (start with 10001) unique,
 email text not null,
 full_name text not null check (char_length(full_name) between 2 and 100),
 phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
 favorite_character text not null default '',
 address text not null default '', city text not null default '',
 region text not null default '', postal_code text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.ak_customer_profiles enable row level security;
revoke all on public.ak_customer_profiles from anon, authenticated;
grant select on public.ak_customer_profiles to authenticated;
drop policy if exists ak_profile_read on public.ak_customer_profiles;
create policy ak_profile_read on public.ak_customer_profiles for select to authenticated
 using ((select auth.uid()) = id or public.ak_is_admin());
create or replace function public.ak_save_customer_profile(
 full_name text, phone text, favorite_character text default '',
 address text default '', city text default '', region text default '', postal_code text default ''
) returns public.ak_customer_profiles language plpgsql security definer set search_path = public, pg_temp as $$
declare owner_id uuid := auth.uid(); verified_email text; result public.ak_customer_profiles;
begin
 select u.email into verified_email from auth.users u where u.id=owner_id and u.email_confirmed_at is not null;
 if owner_id is null or verified_email is null then raise exception 'Verify your email before saving a profile.'; end if;
 if char_length(trim(full_name)) not between 2 and 100 or phone !~ '^[6-9][0-9]{9}$'
 or char_length(favorite_character)>100 or char_length(address)>500 or char_length(city)>100
 or char_length(region)>100 or (postal_code<>'' and postal_code !~ '^[1-9][0-9]{5}$') then
 raise exception 'Check your name, mobile number and delivery details.'; end if;
 if full_name is null or phone is null or favorite_character is null or address is null or city is null or region is null or postal_code is null then raise exception 'Missing profile fields.'; end if;
 insert into public.ak_customer_profiles as p (id,email,full_name,phone,favorite_character,address,city,region,postal_code)
 values(owner_id,verified_email,trim(full_name),phone,trim(favorite_character),trim(address),trim(city),trim(region),postal_code)
 on conflict(id) do update set email=excluded.email,full_name=excluded.full_name,phone=excluded.phone,
 favorite_character=excluded.favorite_character,address=excluded.address,city=excluded.city,region=excluded.region,
 postal_code=excluded.postal_code,updated_at=now() returning * into result;
 return result;
end $$;
revoke all on function public.ak_save_customer_profile(text,text,text,text,text,text,text) from public, anon;
grant execute on function public.ak_save_customer_profile(text,text,text,text,text,text,text) to authenticated;
commit;
