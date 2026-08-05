import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { marked } from "marked";

/* ---------------------------------------------------------------------------
   Renders the legal documents in content/legal/ to HTML.

   The markdown is the source of truth and must never be transcribed into JSX.
   It is legal copy: a dropped clause or a reordered list is a silent, material
   error, and hand-conversion is exactly how that happens. Keeping it as .md
   also means changes to it show up as readable diffs.

   The HTML is injected with dangerouslySetInnerHTML, which is safe *here* for
   one specific reason: the input is two files committed to this repo. It is
   never user input, never fetched, never from the database. If that ever
   changes, this needs a sanitiser or a switch to react-markdown.
--------------------------------------------------------------------------- */

export const LEGAL_SLUGS = ["privacy", "terms"] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

/**
 * Reads and parses one document.
 *
 * Both pages that call this are statically prerendered, so the read happens
 * once at build time and the HTML is baked into the output — there is no
 * filesystem access on a live request. If either page ever becomes dynamic,
 * the .md files would have to be traced into the deployment bundle.
 */
export async function renderLegalDoc(slug: LegalSlug): Promise<string> {
  const source = await readFile(
    path.join(process.cwd(), "content", "legal", `${slug}.md`),
    "utf8",
  );

  // `async: false` is the overload that returns a plain string rather than
  // `string | Promise<string>` — without it the return type needs unwrapping.
  return marked.parse(source, { async: false });
}
