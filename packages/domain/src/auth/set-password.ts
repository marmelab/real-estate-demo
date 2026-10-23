import type { SupabaseClient } from "@supabase/supabase-js";

export async function setPassword(
  client: SupabaseClient,
  password: string,
): Promise<void> {
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}
