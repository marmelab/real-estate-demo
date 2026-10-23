import type { Staff } from "@remix-v3-demo/domain/auth/model";
import type { QueryClient } from "@tanstack/react-query";

import { getCurrentStaffQueryOptions } from "./hook/get-current-staff.ts";

export function getStaffOrNull(
  queryClient: QueryClient,
): Promise<Staff | null> {
  return queryClient
    .fetchQuery(getCurrentStaffQueryOptions())
    .catch(() => null);
}
