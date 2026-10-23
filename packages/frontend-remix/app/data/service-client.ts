import type { SupabaseClient } from "@supabase/supabase-js";

import { createClient } from "@supabase/supabase-js";

import { requireEnv } from "./require-env.ts";

export function createServiceClient(): SupabaseClient {
  return createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
