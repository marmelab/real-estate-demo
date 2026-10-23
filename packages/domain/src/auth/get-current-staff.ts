import type { SupabaseClient } from "@supabase/supabase-js";

import type { Staff } from "./model.ts";

import { getAgentById } from "../agent/get-agent-by-id.ts";
import { agentRoleSchema } from "../agent/model.ts";
import { staffSchema } from "./model.ts";

export async function getCurrentStaff(
  client: SupabaseClient,
): Promise<Staff | null> {
  const { data, error } = await client.auth.getClaims();
  if (error) throw error;
  if (
    !data ||
    !agentRoleSchema.safeParse(data.claims.app_metadata?.role).success
  )
    return null;

  const agent = await getAgentById(client, data.claims.sub);
  return agent ? staffSchema.parse(agent) : null;
}
