import { useState } from "react";

import { getSubmitErrorMessage } from "../../supabase/insufficient-privilege.ts";

export function useSubmitError(fallback: string): {
  error: string | undefined;
  submit: (action: () => Promise<unknown>) => Promise<void>;
} {
  const [error, setError] = useState<string>();

  return {
    error,
    submit: async (action) => {
      setError(undefined);
      try {
        await action();
      } catch (actionError) {
        setError(getSubmitErrorMessage(actionError, fallback));
      }
    },
  };
}
