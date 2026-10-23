import type { SupabaseClient } from "@supabase/supabase-js";

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createContextKey, type Middleware } from "remix/router";

import { requireEnv } from "../data/require-env.ts";

export const Supabase = createContextKey<SupabaseClient>();

export function supabaseSession(): Middleware<{
  key: typeof Supabase;
  value: SupabaseClient;
  property: "supabase";
}> {
  return async (context, next) => {
    let headers = new Headers({ "Cache-Control": "private, no-store" });
    let client = createServerClient(
      requireEnv("SUPABASE_URL"),
      requireEnv("SUPABASE_PUBLISHABLE_KEY"),
      {
        cookies: {
          getAll: () =>
            parseCookieHeader(context.headers.get("Cookie") ?? "").map(
              ({ name, value }) => ({ name, value: value ?? "" }),
            ),
          setAll: (cookies, cacheHeaders) => {
            for (let { name, value, options } of cookies) {
              headers.append(
                "Set-Cookie",
                serializeCookieHeader(name, value, options),
              );
            }
            for (let [name, value] of Object.entries(cacheHeaders)) {
              headers.set(name, value);
            }
          },
        },
      },
    ) as unknown as SupabaseClient;
    context.set(Supabase, client, { property: "supabase" });

    let response = await next();
    let responseHeaders = new Headers(response.headers);
    for (let [name, value] of headers) {
      if (name === "set-cookie") responseHeaders.append(name, value);
      else responseHeaders.set(name, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  };
}
