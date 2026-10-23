import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { ListAgentsQuery } from "./agent-validator.ts";
import type { Agent } from "./model.ts";

import { AGENT_COLUMNS, agentRowSchema, toAgent } from "./to-agent.ts";

export const AGENT_PAGE_SIZE = 20;

export async function listAgents(
  client: SupabaseClient,
  query: ListAgentsQuery,
): Promise<{ agents: Agent[]; total: number }> {
  const from = (query.page - 1) * AGENT_PAGE_SIZE;
  const { data, count, error } = await client
    .from("agent")
    .select(AGENT_COLUMNS, { count: "exact" })
    .order("last_name")
    .order("first_name")
    .range(from, from + AGENT_PAGE_SIZE - 1);
  if (error) throw error;

  return {
    agents: z
      .array(agentRowSchema)
      .parse(data)
      .map((agent) => toAgent(client, agent)),
    total: count ?? 0,
  };
}
