import type { SupabaseClient } from "@supabase/supabase-js";

export async function verifyInvite(
  client: SupabaseClient,
  tokenHash: string,
): Promise<void> {
  const { error } = await client.auth.verifyOtp({
    token_hash: tokenHash,
    type: "invite",
  });
  if (error) throw error;
}
