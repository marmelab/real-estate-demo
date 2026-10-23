import type { SupabaseClient } from "@supabase/supabase-js";

import type { SignIn } from "./auth-validator.ts";

export async function signIn(
  client: SupabaseClient,
  credentials: SignIn,
): Promise<void> {
  const { error } = await client.auth.signInWithPassword(credentials);
  if (error) throw error;
}
