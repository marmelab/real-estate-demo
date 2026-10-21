import { createMiddleware, createStart } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

import { buildContentSecurityPolicy } from "./security/content-security-policy.ts";

const contentSecurityPolicy = createMiddleware().server(({ next }) => {
  const nonce = crypto.randomUUID();
  if (import.meta.env.PROD) {
    setResponseHeader(
      "Content-Security-Policy",
      buildContentSecurityPolicy(nonce, process.env.SUPABASE_URL),
    );
  }
  return next({ context: { nonce } });
});

export const startInstance = createStart(() => ({
  requestMiddleware: [contentSecurityPolicy],
}));

declare module "@tanstack/react-start" {
  interface Register {
    config: Awaited<ReturnType<typeof startInstance.getOptions>>;
  }
}
