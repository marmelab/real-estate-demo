import type { ReactNode } from "react";

import { useEffect, useState } from "react";

import { useSetSession } from "./hook/set-session.ts";

export function InviteFromHash({
  verified,
  invalid,
}: {
  verified: ReactNode;
  invalid: ReactNode;
}) {
  const { mutate, status } = useSetSession();
  const [hasTokens, setHasTokens] = useState<boolean>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) {
      setHasTokens(false);
      return;
    }
    setHasTokens(true);
    mutate(
      { accessToken, refreshToken },
      {
        onSuccess: () =>
          window.history.replaceState(
            window.history.state,
            "",
            window.location.pathname,
          ),
      },
    );
  }, [mutate]);

  if (hasTokens === false || status === "error") return invalid;
  if (status === "success") return verified;
  return <p className="text-gray-300">Vérification de l'invitation…</p>;
}
