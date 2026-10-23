import type { SupabaseClient } from "@supabase/supabase-js";

export async function deleteAgent(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from("agent").delete().eq("id", id);
  if (error) throw error;
}
