/**
 * Checks the live care_enquiries schema against lib/enquiry-options.ts.
 *
 * This is the guard that replaced the md5 parity assertion the SQL used to
 * carry. That hash existed because the constrained values held a peso sign and
 * an en dash, where an ASCII lookalike typed into the SQL would have rejected
 * valid submissions invisibly. The values are now ASCII slugs, so instead of
 * hashing the two copies we simply submit every option and see what the
 * database does with it — a stronger check, and one that also covers the
 * columns, the functions, the grants path, the NULL handling and the throttle.
 *
 *   npm run verify:schema
 *
 * It writes rows and deletes them again, and it calls the RPC directly rather
 * than going through the Server Action, so NO EMAIL IS SENT. It refuses to run
 * if the table is not empty, so it can never delete a real enquiry.
 *
 * Reads SUPABASE_URL and SUPABASE_SECRET_KEY from .env.local.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

import {
  BUDGET_BAND_OPTIONS,
  CARE_LEVEL_OPTIONS,
  CARE_TYPE_OPTIONS,
  PARENT_LOCATION_OPTIONS,
  TIMING_OPTIONS,
} from "../lib/enquiry-options.ts";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL_ = env.SUPABASE_URL;
const KEY = env.SUPABASE_SECRET_KEY;
const db = createClient(URL_, KEY, { auth: { persistSession: false } });

let failures = 0;
const check = (label, pass, extra = "") => {
  if (!pass) failures++;
  console.log(`  [${pass ? "PASS" : "**FAIL**"}] ${label}${extra ? " — " + extra : ""}`);
};

// Refuse to touch a table that holds real enquiries.
const pre = await db.from("care_enquiries").select("id", { count: "exact", head: true });
if (pre.error) {
  console.error("Cannot read care_enquiries:", pre.error.message);
  process.exit(1);
}
if (pre.count !== 0) {
  console.error(
    `care_enquiries holds ${pre.count} row(s). This script inserts and deletes ` +
      `test rows, so it only runs against an empty table. Aborting.`,
  );
  process.exit(1);
}

const base = {
  p_full_name: "Schema Check", p_email: "schema-check@example.com",
  p_phone: "", p_country: "Australia", p_parent_location: "mandaue",
  p_care_type: "residential_home", p_care_level: "", p_timing: "urgently",
  p_budget_band: "", p_situation: "", p_open_to_call: false, p_consent: true,
  p_ip_hash: null,
};
const created = [];
const submit = async (overrides) => {
  const r = await db.rpc("submit_care_enquiry", { ...base, ...overrides });
  if (r.data) created.push(r.data);
  return r;
};

console.log("\nA. TABLE SHAPE");
const spec = await (
  await fetch(`${URL_}/rest/v1/`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } })
).json();
const props = spec.definitions?.care_enquiries?.properties ?? {};
const expected = [
  "id","created_at","full_name","email","phone","country","parent_location",
  "care_type","care_level","timing","budget_band","situation","open_to_call",
  "consent","source","ip_hash","founder_notified_at","applicant_notified_at",
  "notify_attempts","notify_last_error",
];
check("care_enquiries exists", Object.keys(props).length > 0);
for (const c of expected) check(`column ${c}`, c in props);
const unexpected = Object.keys(props).filter((c) => !expected.includes(c));
check("no unexpected columns", unexpected.length === 0, unexpected.join(", "));

console.log("\nB. FUNCTIONS EXIST + CONSENT GUARD");
let r = await submit({ p_consent: false, p_ip_hash: "t-consent" });
check("submit_care_enquiry rejects consent=false",
  !!r.error && (r.error.message || "").includes("consent_required"),
  r.error?.message ?? `INSERTED ${r.data}`);
r = await db.rpc("claim_pending_care_notifications", { p_limit: 0 });
check("claim_pending_care_notifications callable", !r.error, r.error?.message ?? "");
r = await db.rpc("mark_care_notification_sent", {
  p_id: "00000000-0000-0000-0000-000000000000",
  p_founder: false, p_applicant: false, p_error: null,
});
check("mark_care_notification_sent callable", !r.error, r.error?.message ?? "");

console.log("\nC. CONSTRAINTS REJECT UNKNOWN SLUGS");
for (const [field, key] of [
  ["care_type", "p_care_type"], ["care_level", "p_care_level"],
  ["timing", "p_timing"], ["budget_band", "p_budget_band"],
]) {
  const r = await submit({ [key]: "not_a_real_slug", p_ip_hash: `t-bad-${field}` });
  check(`${field} rejects an unknown slug`, r.error?.code === "23514",
    r.error?.code ?? `INSERTED ${r.data}`);
}
// A label where a slug belongs is the drift this replaces the md5 guard for.
r = await submit({ p_care_level: "Dementia or memory care", p_ip_hash: "t-label" });
check("care_level rejects a display label", r.error?.code === "23514",
  r.error?.code ?? `INSERTED ${r.data}`);

console.log("\nD. EVERY OPTION IN lib/enquiry-options.ts IS ACCEPTED");
const lists = [
  ["parent_location", "p_parent_location", PARENT_LOCATION_OPTIONS],
  ["care_type", "p_care_type", CARE_TYPE_OPTIONS],
  ["care_level", "p_care_level", CARE_LEVEL_OPTIONS],
  ["timing", "p_timing", TIMING_OPTIONS],
  ["budget_band", "p_budget_band", BUDGET_BAND_OPTIONS],
];
for (const [field, key, options] of lists) {
  for (const o of options) {
    const r = await submit({ [key]: o.value, p_ip_hash: `t-${field}-${o.value}` });
    check(`${field} = "${o.value}"  (${o.label})`, !!r.data && !r.error,
      r.error?.message ?? "");
  }
}

console.log("\nE. OPTIONAL FIELDS AND DEFAULTS");
const row = (await db.from("care_enquiries").select("*").eq("id", created[0]).single()).data;
check("skipped care_level -> NULL", row?.care_level === null, String(row?.care_level));
check("skipped budget_band -> NULL", row?.budget_band === null, String(row?.budget_band));
check("skipped phone -> NULL", row?.phone === null, String(row?.phone));
check("skipped situation -> NULL", row?.situation === null, String(row?.situation));
check("source defaults to 'homepage'", row?.source === "homepage", String(row?.source));
check("notify_attempts defaults to 0", row?.notify_attempts === 0, String(row?.notify_attempts));

const ns = await submit({ p_care_level: "not_sure", p_ip_hash: "t-notsure" });
const nsRow = (await db.from("care_enquiries").select("care_level").eq("id", ns.data).single()).data;
check('chosen "not_sure" -> stored, not NULL', nsRow?.care_level === "not_sure", String(nsRow?.care_level));

console.log("\nF. RATE LIMIT (5 per hashed IP per hour)");
const HASH = "t-throttle-" + Date.now();
let limited = null;
for (let i = 1; i <= 6; i++) {
  const r = await submit({ p_ip_hash: HASH });
  if (r.error) limited = { attempt: i, msg: r.error.message };
}
check("6th submission from one IP is throttled",
  limited?.attempt === 6 && limited.msg.includes("rate_limited"), JSON.stringify(limited));

console.log("\nG. CLEANUP");
const del = await db.from("care_enquiries").delete().in("id", created).select("id");
check(`deleted all ${created.length} test rows`, del.data?.length === created.length,
  `deleted ${del.data?.length ?? 0}`);
const left = await db.from("care_enquiries").select("id", { count: "exact", head: true });
check("care_enquiries is empty again", left.count === 0, `count=${left.count}`);

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}`);
process.exit(failures === 0 ? 0 : 1);
