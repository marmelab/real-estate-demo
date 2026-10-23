import type { z } from "zod";

import { agentSchema } from "../agent/model.ts";

export const staffSchema = agentSchema.pick({
  id: true,
  role: true,
  firstName: true,
  lastName: true,
  photoUrl: true,
});
export type Staff = z.infer<typeof staffSchema>;
