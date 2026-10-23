import type { z } from "zod";

export function validateWith(
  schema: z.ZodType,
): (props: {
  value: unknown;
}) => { fields: Record<string, string> } | undefined {
  return ({ value }) => {
    const result = schema.safeParse(value);
    if (result.success) return undefined;
    return {
      fields: Object.fromEntries(
        result.error.issues
          .toReversed()
          .map((issue) => [issue.path.join("."), issue.message]),
      ),
    };
  };
}
