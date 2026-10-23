import {
  getFavoriteIds,
  subscribeToFavorites,
} from "@remix-v3-demo/domain/favorite/favorite-store";
import { createContext, use, useSyncExternalStore } from "react";

export const ServerFavoriteIdsContext = createContext<number[]>([]);

export function useFavoriteIds(): number[] {
  const serverIds = use(ServerFavoriteIdsContext);
  return useSyncExternalStore(
    subscribeToFavorites,
    getFavoriteIds,
    () => serverIds,
  );
}
