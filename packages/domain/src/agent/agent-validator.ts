import { z } from "zod";

import { agentRoleSchema } from "./model.ts";

const nameSchema = z.string().trim().min(1).max(100);

export const agentInputSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  role: agentRoleSchema.optional(),
});
export type AgentInput = z.infer<typeof agentInputSchema>;

export const inviteAgentSchema = z.object({
  email: z.email(),
  firstName: nameSchema,
  lastName: nameSchema,
  role: agentRoleSchema.default("agent"),
});
export type InviteAgent = z.infer<typeof inviteAgentSchema>;

export const listAgentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).catch(1),
});
export type ListAgentsQuery = z.infer<typeof listAgentsQuerySchema>;
