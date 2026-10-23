import {
  INSUFFICIENT_PRIVILEGE_MESSAGE,
  isInsufficientPrivilege,
} from "@remix-v3-demo/domain/auth/insufficient-privilege";

export function rethrowInsufficientPrivilege(error: unknown): never {
  if (isInsufficientPrivilege(error)) {
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
