import { handleFormPost } from "@/lib/forms/handle";

/** POST target of the "Get help finding care" form on /help. See lib/forms/handle.ts. */
export function POST(request: Request) {
  return handleFormPost("help", request);
}
