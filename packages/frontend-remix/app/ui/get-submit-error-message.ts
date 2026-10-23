import {
  INSUFFICIENT_PRIVILEGE_MESSAGE,
  isInsufficientPrivilege,
} from "@remix-v3-demo/domain/auth/insufficient-privilege";

export function getSubmitErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (isInsufficientPrivilege(error)) return INSUFFICIENT_PRIVILEGE_MESSAGE;
  console.error(error);
  return fallback;
}
