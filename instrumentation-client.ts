import { initBotId } from "botid/client/core";

// Vercel BotID: attaches the challenge headers that checkBotId() verifies in
// lib/forms/handle.ts. Every path checked on the server must be listed here,
// or checkBotId() fails for real visitors too.
initBotId({
  protect: [
    { path: "/api/forms/help", method: "POST" },
    { path: "/api/forms/provider", method: "POST" },
  ],
});
