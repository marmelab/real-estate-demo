import type { SupabaseClient } from "@supabase/supabase-js";

import type { AgentInput } from "./agent-validator.ts";

export async function updateAgent(
  client: SupabaseClient,
  id: string,
  { firstName, lastName, role }: AgentInput,
): Promise<void> {
  const { error } = await client
    .from("agent")
    .update({
      first_name: firstName,
      last_name: lastName,
      ...(role && { role }),
    })
    .eq("id", id);
  if (error) throw error;
}
