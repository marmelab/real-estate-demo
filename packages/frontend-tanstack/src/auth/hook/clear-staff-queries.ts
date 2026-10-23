import type { QueryClient } from "@tanstack/react-query";

export function clearStaffQueries(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: ["staff"] });
  queryClient.removeQueries({ queryKey: ["admin"] });
}
