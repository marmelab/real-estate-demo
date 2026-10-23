import { getCurrentStaff } from "@remix-v3-demo/domain/auth/get-current-staff";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { createSessionClient } from "../../supabase/session-client.ts";

const getCurrentStaffFn = createServerFn({ method: "GET" }).handler(() =>
  getCurrentStaff(createSessionClient()),
);

export function getCurrentStaffQueryOptions() {
  return queryOptions({
    queryKey: ["staff"],
    queryFn: () => getCurrentStaffFn(),
    staleTime: 0,
  });
}
