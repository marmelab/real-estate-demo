import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
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

const preconnectSupabase = createMiddleware().server(({ next }) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl) {
    setResponseHeader(
      "Link",
      `<${new URL(supabaseUrl).origin}>; rel=preconnect`,
    );
  }
  return next();
});

const csrf = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  requestMiddleware: [csrf, contentSecurityPolicy, preconnectSupabase],
}));

declare module "@tanstack/react-start" {
  interface Register {
    config: Awaited<ReturnType<typeof startInstance.getOptions>>;
  }
}
