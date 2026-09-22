/**
 * Recomputes OPTIONS_MD5 for lib/enquiry-options.ts.
 *
 * The same hash is asserted by the `do` block in supabase/care_enquiries.sql,
 * which declares its own copy of the option literals. The two copies cannot be
 * shared — one is TypeScript shipped to the browser, the other is SQL pasted
 * into the Supabase editor — so this hash is what ties them together.
 *
 * Run after ANY change to the four constrained lists, then paste the result
 * into BOTH lib/enquiry-options.ts (OPTIONS_MD5) and the SQL (expected_md5):
 *
 *   npm run options:md5
 *
 * Reads the .ts file as text rather than importing it, so the hash is taken
 * from the bytes actually on disk — which is the whole point, given the
 * U+20B1 / U+2013 characters in the budget bands.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const SOURCE = new URL("../lib/enquiry-options.ts", import.meta.url);

/** The four lists carrying a SQL CHECK constraint, in constraint order. */
const CONSTRAINED = [
  "CARE_TYPE_OPTIONS",
  "CARE_LEVEL_OPTIONS",
  "TIMING_OPTIONS",
  "BUDGET_BAND_OPTIONS",
];

const source = readFileSync(SOURCE, "utf8");

function extract(name) {
  const match = source.match(
    new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const;`),
  );
  if (!match) throw new Error(`${name} not found in ${SOURCE.pathname}`);

  // Only double-quoted literals; the file is Prettier-formatted, one per line.
  const values = [...match[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) =>
    m[1].replace(/\\(.)/g, "$1"),
  );
  if (values.length === 0) throw new Error(`${name} parsed to zero options`);
  return values;
}

const flat = CONSTRAINED.flatMap(extract);
const digest = createHash("md5").update(flat.join("\n"), "utf8").digest("hex");

for (const value of flat) {
  const points = [...value]
    .map((c) => c.codePointAt(0))
    .filter((c) => c > 0x7f)
    .map((c) => `U+${c.toString(16).toUpperCase().padStart(4, "0")}`);
  console.log(`  ${value}${points.length ? `   [${points.join(" ")}]` : ""}`);
}

console.log(`\n${flat.length} options across ${CONSTRAINED.length} lists`);
console.log(`OPTIONS_MD5 = ${digest}`);
