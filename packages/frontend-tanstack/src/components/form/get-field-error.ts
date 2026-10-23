export function getFieldError(errors: unknown[]): string | undefined {
  const [error] = errors;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}
