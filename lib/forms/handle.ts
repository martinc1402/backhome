import "server-only";

import { checkBotId } from "botid/server";

import { site } from "@/content/site";
import { describeError } from "@/lib/log-safe";
import { clientIp, isRateLimited } from "@/lib/forms/rate-limit";
import {
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_AT_FIELD,
  normalise,
  validate,
  type FormKind,
  type FormResponse,
} from "@/lib/forms/schema";
import { sendSubmission } from "@/lib/forms/send";

/* ---------------------------------------------------------------------------
   The shared POST handler behind /api/forms/help and /api/forms/provider.

   Order of checks, cheapest first:
     1. honeypot and fill time   -> pretend success, so bots learn nothing
     2. BotID                    -> refuse, with the email address
     3. validation               -> field errors
     4. rate limit               -> refuse, with the email address
     5. send through Resend      -> success only if the email actually went
--------------------------------------------------------------------------- */

const EMAIL = site.contactEmail;

const MESSAGES = {
  sendFailed: `Sorry, something went wrong and your message was not sent. Nothing has been saved, so please try again in a moment, or email us at ${EMAIL}.`,
  bot: `Sorry, we couldn't confirm this was sent by a person, so it was not sent. Please email us at ${EMAIL} instead.`,
  rateLimited: `You've sent several messages in the last hour, so this one was not sent. If something didn't come through, please email us at ${EMAIL}.`,
  invalid: "Please check the highlighted fields.",
  badRequest: `Sorry, we couldn't read that form. Please try again, or email us at ${EMAIL}.`,
} as const;

function json(body: FormResponse, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function handleFormPost(kind: FormKind, request: Request): Promise<Response> {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
    if (!raw || typeof raw !== "object") throw new Error("not an object");
  } catch {
    return json({ ok: false, message: MESSAGES.badRequest }, 400);
  }

  // 1. Honeypot and fill time. Silent "success": a bot that sees an error
  // learns which field to leave alone.
  const startedAt = Number(raw[STARTED_AT_FIELD]);
  if (
    (typeof raw[HONEYPOT_FIELD] === "string" && raw[HONEYPOT_FIELD] !== "") ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < MIN_FILL_MS
  ) {
    console.info(`[BackHome] ${kind} form: dropped by honeypot or fill-time check.`);
    return json({ ok: true }, 200);
  }

  // 2. BotID. Off Vercel (next dev, or next start locally) there is no OIDC
  // token to verify with, so it runs in development mode and always passes.
  try {
    const verification = await checkBotId({
      developmentOptions: { isDevelopment: !process.env.VERCEL },
    });
    if (verification.isBot) {
      console.info(`[BackHome] ${kind} form: refused by BotID.`);
      return json({ ok: false, message: MESSAGES.bot }, 403);
    }
  } catch (error) {
    // If BotID itself is unavailable, let the submission through rather than
    // turn away a real family; the honeypot and rate limit still apply.
    console.error(`[BackHome] ${kind} form: BotID check failed: ${describeError(error)}`);
  }

  // 3. Validation. The browser checks too, but anything can POST here.
  // Before the rate limit, so correcting a typo doesn't use up an allowance.
  const values = normalise(
    kind,
    Object.fromEntries(
      Object.entries(raw).map(([k, v]) => [k, typeof v === "string" ? v : ""]),
    ),
  );
  const fieldErrors = validate(kind, values);
  if (Object.keys(fieldErrors).length > 0) {
    return json({ ok: false, message: MESSAGES.invalid, fieldErrors }, 422);
  }

  // 4. Rate limit, counting only submissions that would actually be sent.
  if (isRateLimited(kind, clientIp(request))) {
    console.info(`[BackHome] ${kind} form: rate limited.`);
    return json({ ok: false, message: MESSAGES.rateLimited }, 429);
  }

  // 5. Send. This email is the only copy, so success means it actually went.
  const providerSlug = typeof raw.provider === "string" ? raw.provider.slice(0, 120) : undefined;
  const sent = await sendSubmission(kind, values, { providerSlug });
  return sent
    ? json({ ok: true }, 200)
    : json({ ok: false, message: MESSAGES.sendFailed }, 502);
}
