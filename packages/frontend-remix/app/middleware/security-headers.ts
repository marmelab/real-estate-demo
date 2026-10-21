import { createContextKey, type Middleware } from "remix/router";

export const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export const Nonce = createContextKey<string>();

function contentSecurityPolicy(nonce: string): string {
  let supabaseUrl = process.env.SUPABASE_URL;
  let connectSrc = supabaseUrl
    ? `'self' ${new URL(supabaseUrl).origin}`
    : "'self'";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    `connect-src ${connectSrc}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}

export function securityHeaders(): Middleware<{
  key: typeof Nonce;
  value: string;
}> {
  return async (context, next) => {
    let nonce = crypto.randomUUID();
    context.set(Nonce, nonce);

    let response = await next();
    let headers = new Headers(response.headers);
    for (let [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }
    if (process.env.NODE_ENV === "production") {
      headers.set("Content-Security-Policy", contentSecurityPolicy(nonce));
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}
