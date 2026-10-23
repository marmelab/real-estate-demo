import type { SupabaseClient } from "@supabase/supabase-js";

import type { Agent } from "./model.ts";

import { AGENT_COLUMNS, agentRowSchema, toAgent } from "./to-agent.ts";

export async function getAgentById(
  client: SupabaseClient,
  id: string,
): Promise<Agent | null> {
  const { data, error } = await client
    .from("agent")
    .select(AGENT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toAgent(client, agentRowSchema.parse(data)) : null;
}
