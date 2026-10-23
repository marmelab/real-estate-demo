import { z } from "zod";

export const INSUFFICIENT_PRIVILEGE_MESSAGE = "Action réservée aux managers";

export function isInsufficientPrivilege(error: unknown): boolean {
  return z.object({ code: z.literal("42501") }).safeParse(error).success;
}
