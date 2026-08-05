-- Pilot interest submissions.
--
-- Run once against the Supabase project (Dashboard -> SQL Editor), or via the
-- Supabase CLI. Kept in the repo so the schema is reviewable and reproducible
-- rather than living only in someone's browser history.
--
-- Consumed by submitPilotInterest() in app/actions.ts.

-- 1. The table ---------------------------------------------------------------

create table if not exists public.pilot_interest (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text        not null,
  email            text        not null,
  phone            text,
  country          text        not null,
  cebu_location    text        not null,
  who_you_help     text        not null,
  recent_situation text,
  first_service    text        not null,
  research_call    boolean     not null default false,
  consent          boolean     not null,
  -- Salted SHA-256 of the submitter's IP, for rate limiting only. Never the
  -- raw address: this exists to throttle, not to identify. The salt lives in
  -- IP_HASH_SALT and never reaches the database, so these cannot be reversed
  -- into addresses even by someone holding a dump of this table.
  ip_hash          text
);

-- Supports the throttle lookup in submit_pilot_interest(); without it that
-- count degrades to a sequential scan as the table grows.
create index if not exists pilot_interest_ip_hash_created_at_idx
  on public.pilot_interest (ip_hash, created_at desc);

-- 2. Seal it -----------------------------------------------------------------
-- RLS enabled with ZERO policies means no access for anon or authenticated.
-- The secret key (sb_secret_..., held only by the Server Action) bypasses RLS,
-- so writes still work. The publishable key — the one designed to be shipped
-- to browsers — can neither read nor write these rows.
--
-- Deliberately stricter than the usual anon-insert-only pattern: these rows
-- hold names, emails, phone numbers and free text about family circumstances.
--
-- The revoke is belt-and-braces against Supabase's default grants on public.

alter table public.pilot_interest enable row level security;
revoke all on public.pilot_interest from anon, authenticated;

-- 3. Throttled insert --------------------------------------------------------
-- Check and insert in ONE statement. Doing the count from the application and
-- then inserting would let two simultaneous requests both pass the check.
--
-- security INVOKER (the default), deliberately NOT security definer. A definer
-- function runs with the owner's privileges, which would hand any caller a way
-- to write to a table they cannot otherwise touch — and since the caller passes
-- p_ip_hash, they could randomise it and defeat the throttle completely.
-- As an invoker function it has exactly the privileges of whoever calls it:
-- service_role (the Server Action) can insert, anon cannot. See the grants
-- below, which are the other half of this.

create or replace function public.submit_pilot_interest(
  p_full_name        text,
  p_email            text,
  p_phone            text,
  p_country          text,
  p_cebu_location    text,
  p_who_you_help     text,
  p_recent_situation text,
  p_first_service    text,
  p_research_call    boolean,
  p_consent          boolean,
  p_ip_hash          text
) returns void
language plpgsql
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.pilot_interest
  where ip_hash = p_ip_hash
    and created_at > now() - interval '1 hour';

  -- Generous for a person (a few retries after a validation error), useless
  -- for a flood. app/actions.ts matches on this message, so keep it in sync.
  if recent_count >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.pilot_interest (
    full_name, email, phone, country, cebu_location, who_you_help,
    recent_situation, first_service, research_call, consent, ip_hash
  ) values (
    p_full_name, p_email, nullif(p_phone, ''), p_country, p_cebu_location,
    p_who_you_help, nullif(p_recent_situation, ''), p_first_service,
    p_research_call, p_consent, p_ip_hash
  );
end;
$$;

-- Revoking from anon/authenticated alone is NOT enough, and quietly leaves the
-- function callable by everyone. PostgreSQL grants EXECUTE on every new
-- function to PUBLIC by default, and anon inherits it through that — so the
-- role-specific revokes remove grants that were never the ones letting them in.
-- PUBLIC is the grant that has to go. Verified: before this line was corrected,
-- the publishable key could call this function and insert a row.
--
-- The signature is spelled out because revoke needs it to identify the function.

revoke all on function public.submit_pilot_interest(
  text, text, text, text, text, text, text, text, boolean, boolean, text
) from public, anon, authenticated;

-- service_role is what the secret key authenticates as, so the Server Action
-- needs this back explicitly once PUBLIC has been revoked.
grant execute on function public.submit_pilot_interest(
  text, text, text, text, text, text, text, text, boolean, boolean, text
) to service_role;
