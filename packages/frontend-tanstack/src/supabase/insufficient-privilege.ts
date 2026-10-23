import { z } from "zod";

export const INSUFFICIENT_PRIVILEGE_MESSAGE = "Action réservée aux managers";

export function rethrowInsufficientPrivilege(error: unknown): never {
  if (z.object({ code: z.literal("42501") }).safeParse(error).success) {
    throw new Error(INSUFFICIENT_PRIVILEGE_MESSAGE);
  }
  throw error;
}

export function getSubmitErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error &&
    error.message === INSUFFICIENT_PRIVILEGE_MESSAGE
    ? INSUFFICIENT_PRIVILEGE_MESSAGE
    : fallback;
}
