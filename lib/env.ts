import "server-only";

/**
 * Reads a required server-side environment variable, or throws.
 *
 * Every caller reads LAZILY, at request time, never at module scope. Reading at
 * import time would turn a missing variable into a failed build rather than a
 * failed request, which is the wrong failure: the site is a static marketing
 * page apart from one form, and it should still build and deploy even if the
 * form's credentials are not configured yet.
 *
 * The throw is caught in app/actions.ts and surfaced to the visitor as "your
 * details were not saved", which is the honest outcome — far better than the
 * form quietly reporting success into a void.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. The pilot interest form ` +
        `cannot record submissions without it. Set it in .env.local for local ` +
        `development, and with \`vercel env add\` for deployments.`,
    );
  }

  return value;
}
