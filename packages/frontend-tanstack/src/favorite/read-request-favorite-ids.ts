import { readFavoriteIds } from "@remix-v3-demo/domain/favorite/favorite-cookie";
import { getFavoriteIds } from "@remix-v3-demo/domain/favorite/favorite-store";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export const readRequestFavoriteIds = createIsomorphicFn()
  .server(() => readFavoriteIds(getRequestHeader("Cookie")))
  .client(() => getFavoriteIds());
