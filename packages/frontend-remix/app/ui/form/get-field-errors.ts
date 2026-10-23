import type { Issue } from "remix/data-schema";

export type FieldErrors = Record<string, string>;

export function getFieldErrors(issues: readonly Issue[]): FieldErrors {
  return Object.fromEntries(
    issues
      .toReversed()
      .map((issue) => [
        (issue.path ?? [])
          .map((segment) =>
            typeof segment === "object" ? String(segment.key) : String(segment),
          )
          .join("."),
        issue.message,
      ]),
  );
}
