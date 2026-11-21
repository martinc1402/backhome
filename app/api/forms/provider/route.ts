import { handleFormPost } from "@/lib/forms/handle";

/** POST target of the "List your service" form on /for-providers. See lib/forms/handle.ts. */
export function POST(request: Request) {
  return handleFormPost("provider", request);
}
