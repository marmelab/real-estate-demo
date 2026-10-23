import type { SupabaseClient } from "@supabase/supabase-js";

import { z } from "zod";

import type { Agent } from "./model.ts";

import { agentSchema } from "./model.ts";

export const AGENT_COLUMNS =
  "id, firstName:first_name, lastName:last_name, role, photoPath:photo_path, createdAt:created_at";

export const agentRowSchema = agentSchema
  .omit({ photoUrl: true })
  .extend({ photoPath: z.string().nullable() });

export function toAgent(
  client: SupabaseClient,
  { photoPath, ...agent }: z.infer<typeof agentRowSchema>,
): Agent {
  return {
    ...agent,
    photoUrl: photoPath
      ? client.storage.from("agent-photo").getPublicUrl(photoPath).data
          .publicUrl
      : null,
  };
}
