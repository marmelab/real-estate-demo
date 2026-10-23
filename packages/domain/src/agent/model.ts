import { z } from "zod";

export const agentRoleSchema = z.enum(["manager", "agent"]);
export type AgentRole = z.infer<typeof agentRoleSchema>;

export const agentSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  role: agentRoleSchema,
  photoUrl: z.string().nullable(),
  createdAt: z.string(),
});
export type Agent = z.infer<typeof agentSchema>;
