export function buildContentSecurityPolicy(
  nonce: string,
  supabaseUrl: string | undefined,
): string {
  const connectSrc = supabaseUrl
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
