import "server-only";

import { site } from "@/content/site";
import { requireEnv } from "@/lib/env";
import { getListingBySlug } from "@/lib/directory";
import { describeError } from "@/lib/log-safe";
import { isEmailConfigured, resendClient } from "@/lib/resend";
import {
  FIELDS,
  optionLabel,
  type FormKind,
  type FormValues,
} from "@/lib/forms/schema";

/* ---------------------------------------------------------------------------
   Emails a submission to BackHome through Resend.

   THIS IS THE ONLY COPY. Nothing is stored anywhere else, so a failed send
   must reach the visitor as an error, never as success. sendSubmission()
   returns false on any failure and the route turns that into an error
   message naming hello@backhome.ph.

   Plain text only: no HTML means nothing a visitor types can be rendered as
   markup in our inbox. Never log a field value; only outcomes and Resend ids.
--------------------------------------------------------------------------- */

const SUBJECTS: Record<FormKind, (v: FormValues) => string> = {
  help: (v) => `Help finding care: ${v.name}`,
  provider: (v) => `Listing request: ${v.businessName}`,
};

function buildText(kind: FormKind, values: FormValues, context: string[]): string {
  const lines: string[] = [];
  const heading =
    kind === "help"
      ? "A family asked for help finding care on backhome.ph."
      : "A provider asked to be listed on backhome.ph.";
  lines.push(heading, "");

  for (const [name, rule] of Object.entries(FIELDS[kind])) {
    const raw = values[name];
    const value = raw ? optionLabel(kind, name, raw) : "(not given)";
    if (rule.kind === "multiline") {
      lines.push(`${rule.label}:`, value, "");
    } else {
      lines.push(`${rule.label}: ${value}`);
    }
  }

  if (context.length > 0) lines.push("", ...context);
  lines.push("", "Reply to this email to answer them directly.");
  return lines.join("\n");
}

export async function sendSubmission(
  kind: FormKind,
  values: FormValues,
  { providerSlug }: { providerSlug?: string } = {},
): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error(`[BackHome] ${kind} form: email is not configured (RESEND_API_KEY / RESEND_FROM).`);
    return false;
  }

  const context: string[] = [];
  const listing = providerSlug ? getListingBySlug(providerSlug) : undefined;
  if (listing) {
    context.push(`Sent from the listing: ${listing.name} (${site.url}/cebu/${listing.category}/${listing.slug})`);
  }

  try {
    const { data, error } = await resendClient().emails.send({
      from: requireEnv("RESEND_FROM"),
      to: process.env.FOUNDER_EMAIL || site.contactEmail,
      replyTo: values.email,
      subject: SUBJECTS[kind](values),
      text: buildText(kind, values, context),
    });

    if (error) {
      // Resend's error carries a name and message about the request, not the
      // payload, so it is safe to log through describeError.
      console.error(`[BackHome] ${kind} form: Resend rejected the send: ${describeError(error)}`);
      return false;
    }

    console.info(`[BackHome] ${kind} form: sent (${data?.id ?? "no id"}).`);
    return true;
  } catch (error) {
    console.error(`[BackHome] ${kind} form: send failed: ${describeError(error)}`);
    return false;
  }
}
