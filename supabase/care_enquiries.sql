-- Care enquiries — the homepage "Get a shortlist" form.
--
-- Run once against the Supabase project (Dashboard -> SQL Editor), or via the
-- Supabase CLI. Kept in the repo so the schema is reviewable and reproducible
-- rather than living only in someone's browser history.
--
-- supabase/care_enquiries.sql and supabase/migrations/0003_care_enquiries.sql
-- are BYTE-IDENTICAL copies. The former is the copy-paste target for the SQL
-- editor; the latter is the ordered history. Change one, copy it to the other,
-- in the same commit. Nothing enforces that — it is a convention.
--
-- Consumed by submitCareEnquiry() in app/actions.ts, lib/notify-enquiry.ts and
-- lib/notify-sweep.ts.
--
-- Everything is wrapped in one transaction: a half-applied run would leave the
-- live form with a table but no function to call.
--
-- This migration DELIBERATELY does not touch public.pilot_interest or its three
-- functions. That table belongs to the previous pilot form, is empty, and will
-- be dropped by hand later — when it goes, drop submit_pilot_interest(),
-- claim_pending_notifications() and mark_notification_sent() along with it.

begin;

-- 1. The table ---------------------------------------------------------------

create table if not exists public.care_enquiries (
  id              uuid        primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  full_name       text        not null,
  email           text        not null,
  phone           text,
  country         text        not null,
  parent_location text        not null,
  care_type       text        not null,
  care_level      text,
  timing          text        not null,
  budget_band     text,
  situation       text,
  open_to_call    boolean     not null default false,
  consent         boolean     not null,
  source          text        not null default 'homepage',

  -- Salted SHA-256 of the submitter's IP, for rate limiting only. Never the raw
  -- address: this exists to throttle, not to identify. The salt lives in
  -- IP_HASH_SALT and never reaches the database, so these cannot be reversed
  -- into addresses even by someone holding a dump of this table.
  --
  -- It lives on this table, rather than in a side table, because
  -- submit_care_enquiry() counts and inserts in ONE statement — which is the
  -- only thing stopping two simultaneous requests from both passing a
  -- check-then-insert race.
  ip_hash text,

  -- Per-recipient notification state, mirroring migration 0002. Two timestamps
  -- rather than one `notified_at`, because the two emails fail independently:
  -- they are dispatched with allSettled precisely so a bouncing enquirer
  -- address cannot suppress the founder alert. A single column could not
  -- express "the founders know, the enquirer was never reached", which is the
  -- most likely partial outcome and the one worth retrying narrowly.
  founder_notified_at   timestamptz,
  applicant_notified_at timestamptz,
  -- Bounds the retry loop. A permanently undeliverable address must not be
  -- retried forever, or the sweep spends its whole budget on it every night.
  notify_attempts       int not null default 0,
  -- Last failure reason, so a stuck row can be diagnosed from the table alone
  -- rather than by trawling function logs that have long since rotated away.
  notify_last_error     text
);

-- 2. Fixed-option CHECK constraints -------------------------------------------
-- The option lists appear ONCE, here, and the four constraints are generated
-- from them. Four hand-written `check (...)` clauses is exactly how one copy of
-- the peso sign or the en dash gets mangled and the others do not.
--
-- The md5 assertion ties this file to lib/enquiry-options.ts, which holds the
-- TypeScript copy used by the form markup and the server validator. If the two
-- drift, THIS MIGRATION ABORTS with both hashes — rather than letting a
-- production-only CHECK violation surface weeks later, on one budget band, for
-- one unlucky visitor. Regenerate the hash with `npm run options:md5`.
--
-- parent_location deliberately has NO constraint: it is validated in TypeScript
-- but is the list most likely to gain a town, and a constraint would turn that
-- one-line change into a migration.
--
-- Drop-and-recreate rather than `add constraint if not exists` (which does not
-- exist), so re-running this file reconciles the constraints. Note the table
-- itself is `if not exists` and will NOT reconcile columns on a re-run.

do $$
declare
  care_types constant text[] := array[
    'A residential home', 'Care at home', 'Not sure yet'];

  care_levels constant text[] := array[
    'Mostly independent', 'Needs daily help',
    'Bedridden or high care', 'Dementia or memory care',
    'Not sure'];

  timings constant text[] := array[
    'Urgently', 'Within 3 months', 'Planning ahead'];

  -- U+20B1 PESO SIGN and U+2013 EN DASH. Copy these, do not retype them.
  budgets constant text[] := array[
    'Under ₱20,000', '₱20,000–₱40,000', '₱40,000–₱70,000',
    'Over ₱70,000', 'Not sure'];

  expected_md5 constant text := '91652e2a319eccbb4d209cffdaa62784';
  actual_md5   text;
begin
  actual_md5 := md5(array_to_string(
    care_types || care_levels || timings || budgets, E'\n'));

  if actual_md5 <> expected_md5 then
    raise exception 'care_enquiries option lists do not match lib/enquiry-options.ts'
      using detail = format('computed md5 %s, expected %s', actual_md5, expected_md5),
            hint   = 'A U+20B1 peso sign or U+2013 en dash in the budget bands was '
                     'probably replaced with an ASCII lookalike. Compare byte for '
                     'byte, or run: npm run options:md5';
  end if;

  execute 'alter table public.care_enquiries
             drop constraint if exists care_enquiries_care_type_check';
  execute format(
    'alter table public.care_enquiries
       add constraint care_enquiries_care_type_check
       check (care_type = any (%L::text[]))', care_types);

  -- `is null or` is redundant — a CHECK evaluating to UNKNOWN passes, so a NULL
  -- would be accepted either way — but stating it stops the next reader from
  -- "fixing" the optional selects into required ones by accident.
  execute 'alter table public.care_enquiries
             drop constraint if exists care_enquiries_care_level_check';
  execute format(
    'alter table public.care_enquiries
       add constraint care_enquiries_care_level_check
       check (care_level is null or care_level = any (%L::text[]))', care_levels);

  execute 'alter table public.care_enquiries
             drop constraint if exists care_enquiries_timing_check';
  execute format(
    'alter table public.care_enquiries
       add constraint care_enquiries_timing_check
       check (timing = any (%L::text[]))', timings);

  execute 'alter table public.care_enquiries
             drop constraint if exists care_enquiries_budget_band_check';
  execute format(
    'alter table public.care_enquiries
       add constraint care_enquiries_budget_band_check
       check (budget_band is null or budget_band = any (%L::text[]))', budgets);
end;
$$;

-- There is deliberately NO check constraint on `consent`. A constraint
-- violation writes "Failing row contains (...)" — the entire row, including the
-- free-text `situation` and the `care_level` — into the error DETAIL, and
-- app/actions.ts logs Supabase errors to Vercel. submit_care_enquiry() raises a
-- clean, value-free 'consent_required' instead. See lib/log-safe.ts, which is
-- the other half of keeping row data out of the logs.

-- 3. Indexes ------------------------------------------------------------------

-- Supports the throttle lookup in submit_care_enquiry(); without it that count
-- degrades to a sequential scan as the table grows.
create index if not exists care_enquiries_ip_hash_created_at_idx
  on public.care_enquiries (ip_hash, created_at desc);

-- Partial: the sweep only ever looks at rows with something outstanding, which
-- is a vanishing fraction of the table. Indexing all rows would cost write
-- throughput on every submission to speed up a query that runs once a day.
create index if not exists care_enquiries_pending_notification_idx
  on public.care_enquiries (created_at)
  where founder_notified_at is null or applicant_notified_at is null;

-- 4. Seal it -----------------------------------------------------------------
-- RLS enabled with ZERO policies means no access for anon or authenticated —
-- not even insert. The secret key (sb_secret_..., held only by the Server
-- Action) bypasses RLS, so the server-side write still works. The publishable
-- key — the one designed to be shipped to browsers — can neither read nor write
-- these rows.
--
-- Deliberately stricter than the usual anon-insert-only pattern, and the case
-- is stronger here than it was for pilot_interest: these rows hold names,
-- emails, phone numbers, a parent's care level and free text about a family's
-- circumstances.
--
-- The revoke is belt-and-braces against Supabase's default grants on public.

alter table public.care_enquiries enable row level security;
revoke all on public.care_enquiries from anon, authenticated;

-- 5. Throttled insert --------------------------------------------------------
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
--
-- `source` is not a parameter: the column default covers the only caller, and a
-- caller-supplied free-text value would be one more unvalidated string on a
-- publicly reachable path. Add p_source (with its own CHECK) if a second form
-- ever needs it.

create or replace function public.submit_care_enquiry(
  p_full_name       text,
  p_email           text,
  p_phone           text,
  p_country         text,
  p_parent_location text,
  p_care_type       text,
  p_care_level      text,
  p_timing          text,
  p_budget_band     text,
  p_situation       text,
  p_open_to_call    boolean,
  p_consent         boolean,
  p_ip_hash         text
) returns uuid
language plpgsql
set search_path = public
as $$
declare
  recent_count int;
  new_id       uuid;
begin
  -- Defence in depth behind validateEnquiry(). Server Actions accept direct
  -- POST requests, so the TypeScript check must not be the only thing standing
  -- between a forged request and a stored row that claims consent was given.
  if p_consent is not true then
    raise exception 'consent_required' using errcode = 'P0001';
  end if;

  select count(*) into recent_count
  from public.care_enquiries
  where ip_hash = p_ip_hash
    and created_at > now() - interval '1 hour';

  -- Generous for a person (a few retries after a validation error), useless
  -- for a flood. app/actions.ts matches on this message, so keep it in sync.
  if recent_count >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  -- nullif: the optional selects and text fields arrive as '' from FormData.
  -- Empty string becomes NULL, meaning "not answered"; a chosen 'Not sure' is a
  -- real stored value. The two are different triage signals to the founders.
  insert into public.care_enquiries (
    full_name, email, phone, country, parent_location, care_type, care_level,
    timing, budget_band, situation, open_to_call, consent, ip_hash
  ) values (
    p_full_name, p_email, nullif(p_phone, ''), p_country, p_parent_location,
    p_care_type, nullif(p_care_level, ''), p_timing, nullif(p_budget_band, ''),
    nullif(p_situation, ''), p_open_to_call, p_consent, p_ip_hash
  )
  returning id into new_id;

  return new_id;
end;
$$;

-- Revoking from anon/authenticated alone is NOT enough, and quietly leaves the
-- function callable by everyone. PostgreSQL grants EXECUTE on every new
-- function to PUBLIC by default, and anon inherits it through that — so the
-- role-specific revokes remove grants that were never the ones letting them in.
-- PUBLIC is the grant that has to go. Verified on pilot_interest: before the
-- equivalent line was corrected there, the publishable key could call the
-- function and insert a row.
--
-- The signature is spelled out because revoke needs it to identify the function.

revoke all on function public.submit_care_enquiry(
  text, text, text, text, text, text, text, text, text, text,
  boolean, boolean, text
) from public, anon, authenticated;

-- service_role is what the secret key authenticates as, so the Server Action
-- needs this back explicitly once PUBLIC has been revoked.
grant execute on function public.submit_care_enquiry(
  text, text, text, text, text, text, text, text, text, text,
  boolean, boolean, text
) to service_role;

-- 6. Claim rows for the retry sweep -------------------------------------------
-- Claiming and incrementing in one statement, with FOR UPDATE SKIP LOCKED, is
-- what makes overlapping sweeps safe: a cron firing while a manual run is still
-- going takes a disjoint set of rows instead of re-sending the same backlog.
--
-- The attempt counter increments on CLAIM, not on failure, so a row whose send
-- crashes the sweep mid-flight has still consumed an attempt and a poison row
-- cannot be retried forever.
--
-- This returns `setof public.care_enquiries`, i.e. every column, including
-- `situation` and `care_level` — the founder alert cannot be rebuilt without
-- them. lib/notify-sweep.ts must therefore never log a row, only counts and ids.

create or replace function public.claim_pending_care_notifications(
  p_limit        int default 25,
  p_max_attempts int default 5
) returns setof public.care_enquiries
language plpgsql
set search_path = public
as $$
begin
  return query
  with claimed as (
    select id
      from public.care_enquiries
     where (founder_notified_at is null or applicant_notified_at is null)
       and notify_attempts < p_max_attempts
       -- Past a week a "confirmation" is worse than silence, and a founder
       -- alert that stale is a report, not a notification.
       and created_at > now() - interval '7 days'
     order by created_at
       for update skip locked
     limit p_limit
  )
  update public.care_enquiries c
     set notify_attempts = c.notify_attempts + 1
    from claimed
   where c.id = claimed.id
  returning c.*;
end;
$$;

revoke all on function public.claim_pending_care_notifications(int, int)
  from public, anon, authenticated;

grant execute on function public.claim_pending_care_notifications(int, int)
  to service_role;

-- 7. Record what was actually delivered ---------------------------------------
-- coalesce keeps the FIRST success timestamp: a later sweep that re-sends only
-- the other half of the pair must not overwrite when the founders were told.

create or replace function public.mark_care_notification_sent(
  p_id        uuid,
  p_founder   boolean,
  p_applicant boolean,
  p_error     text default null
) returns void
language plpgsql
set search_path = public
as $$
begin
  update public.care_enquiries
     set founder_notified_at =
           case when p_founder
                then coalesce(founder_notified_at, now())
                else founder_notified_at end,
         applicant_notified_at =
           case when p_applicant
                then coalesce(applicant_notified_at, now())
                else applicant_notified_at end,
         notify_last_error = p_error
   where id = p_id;
end;
$$;

revoke all on function public.mark_care_notification_sent(
  uuid, boolean, boolean, text
) from public, anon, authenticated;

grant execute on function public.mark_care_notification_sent(
  uuid, boolean, boolean, text
) to service_role;

commit;
