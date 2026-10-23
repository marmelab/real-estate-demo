import type { QueryClient } from "@tanstack/react-query";

export async function invalidateListingQueries(
  queryClient: QueryClient,
  id?: number,
): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["admin"] }),
    queryClient.invalidateQueries({ queryKey: ["listings"] }),
    id === undefined
      ? queryClient.invalidateQueries({ queryKey: ["listing"] })
      : queryClient.invalidateQueries({ queryKey: ["listing", id] }),
  ]);
}
