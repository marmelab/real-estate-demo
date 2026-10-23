import type { AgentRole } from "./model.ts";

export const AGENT_ROLE_LABELS: Record<AgentRole, string> = {
  agent: "Agent",
  manager: "Manager",
};

export const AGENT_ROLE_OPTIONS = Object.entries(AGENT_ROLE_LABELS);
