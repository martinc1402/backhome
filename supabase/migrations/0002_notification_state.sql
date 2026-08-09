-- Notification state and the retry sweep.
--
-- Run once against the Supabase project (Dashboard -> SQL Editor), or via the
-- Supabase CLI. Everything here is wrapped in one transaction: 0001's
-- submit_pilot_interest() has to be dropped and recreated (see part 3), and a
-- half-applied migration would leave the live form with no function to call.
--
-- Consumed by lib/notify-interest.ts and lib/notify-sweep.ts.

begin;

-- 1. Per-recipient notification state -----------------------------------------
-- Two timestamps rather than one `notified_at`, because the two emails fail
-- independently — they are dispatched with allSettled precisely so a bouncing
-- applicant address cannot suppress the founder alert. A single column could
-- not express "the founders know, the applicant was never reached", which is
-- the most likely partial outcome and the one worth retrying narrowly.

alter table public.pilot_interest
  add column if not exists founder_notified_at   timestamptz,
  add column if not exists applicant_notified_at timestamptz,
  -- Bounds the retry loop. A permanently undeliverable address must not be
  -- retried forever, or the sweep spends its whole budget on it every night.
  add column if not exists notify_attempts       int not null default 0,
  -- Last failure reason, so a stuck row can be diagnosed from the table alone
  -- rather than by trawling function logs that have long since rotated away.
  add column if not exists notify_last_error     text;

-- Partial index: the sweep only ever looks at rows with something outstanding,
-- which is a vanishing fraction of the table. Indexing all rows would cost
-- write throughput on every submission to speed up a query that runs daily.
create index if not exists pilot_interest_pending_notification_idx
  on public.pilot_interest (created_at)
  where founder_notified_at is null or applicant_notified_at is null;

-- 2. Backfill ------------------------------------------------------------------
-- Rows that predate this migration were notified by the previous best-effort
-- path, or were never going to be. Either way they must not appear in the
-- sweep's backlog on first run and generate a burst of duplicate email about
-- submissions from weeks ago. Mark them settled.

update public.pilot_interest
   set founder_notified_at   = coalesce(founder_notified_at, created_at),
       applicant_notified_at = coalesce(applicant_notified_at, created_at)
 where founder_notified_at is null
    or applicant_notified_at is null;

-- 3. submit_pilot_interest() now returns the inserted id -----------------------
-- The Server Action could not previously record what it had sent, because the
-- function returned void and so the action never learned which row it had just
-- created. Returning the id also makes the Resend idempotency keys stable
-- across a retried action rather than merely across a retried API call.
--
-- CREATE OR REPLACE cannot change a function's return type, hence the drop.
-- Inside this transaction the window where it does not exist is invisible to
-- concurrent callers.

drop function if exists public.submit_pilot_interest(
  text, text, text, text, text, text, text, text, boolean, boolean, text
);

create function public.submit_pilot_interest(
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
) returns uuid
language plpgsql
set search_path = public
as $$
declare
  recent_count int;
  new_id       uuid;
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
  )
  returning id into new_id;

  return new_id;
end;
$$;

-- As in 0001: PUBLIC is the grant that actually lets anon in, so it is the one
-- that has to go. The role-specific revokes alone quietly leave it callable.
revoke all on function public.submit_pilot_interest(
  text, text, text, text, text, text, text, text, boolean, boolean, text
) from public, anon, authenticated;

grant execute on function public.submit_pilot_interest(
  text, text, text, text, text, text, text, text, boolean, boolean, text
) to service_role;

-- 4. Claim rows for the sweep --------------------------------------------------
-- Claiming and incrementing in one statement, with FOR UPDATE SKIP LOCKED, is
-- what makes overlapping sweeps safe. Two concurrent runs — a cron firing while
-- a manual run is still going — take disjoint sets of rows instead of both
-- picking up the same backlog and sending everything twice.
--
-- The attempt counter is incremented on CLAIM, not on failure. That is
-- deliberate: a row whose send crashes the sweep mid-flight has still consumed
-- an attempt, so a poison row cannot be retried indefinitely.

create or replace function public.claim_pending_notifications(
  p_limit       int default 25,
  p_max_attempts int default 5
) returns setof public.pilot_interest
language plpgsql
set search_path = public
as $$
begin
  return query
  with claimed as (
    select id
      from public.pilot_interest
     where (founder_notified_at is null or applicant_notified_at is null)
       and notify_attempts < p_max_attempts
       -- Past a week a "confirmation" is worse than silence, and a founder
       -- alert that stale is a report, not a notification.
       and created_at > now() - interval '7 days'
     order by created_at
       for update skip locked
     limit p_limit
  )
  update public.pilot_interest p
     set notify_attempts = p.notify_attempts + 1
    from claimed
   where p.id = claimed.id
  returning p.*;
end;
$$;

revoke all on function public.claim_pending_notifications(int, int)
  from public, anon, authenticated;

grant execute on function public.claim_pending_notifications(int, int)
  to service_role;

-- 5. Record what was actually delivered ----------------------------------------
-- coalesce keeps the FIRST success timestamp: a later sweep that re-sends the
-- other half of the pair must not overwrite when the founders were told.

create or replace function public.mark_notification_sent(
  p_id        uuid,
  p_founder   boolean,
  p_applicant boolean,
  p_error     text default null
) returns void
language plpgsql
set search_path = public
as $$
begin
  update public.pilot_interest
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

revoke all on function public.mark_notification_sent(uuid, boolean, boolean, text)
  from public, anon, authenticated;

grant execute on function public.mark_notification_sent(uuid, boolean, boolean, text)
  to service_role;

commit;
