import {
  readFavoriteIds,
  serializeFavoritesCookie,
} from "./favorite-cookie.ts";

const browser = globalThis as unknown as { document: { cookie: string } };

const listeners = new Set<() => void>();
let snapshot = { cookie: "", ids: [] as number[] };

export function getFavoriteIds(): number[] {
  const { cookie } = browser.document;
  if (cookie !== snapshot.cookie) {
    snapshot = { cookie, ids: readFavoriteIds(cookie) };
  }
  return snapshot.ids;
}

export function toggleFavorite(listingId: number): void {
  const ids = getFavoriteIds();
  browser.document.cookie = serializeFavoritesCookie(
    ids.includes(listingId)
      ? ids.filter((id) => id !== listingId)
      : [listingId, ...ids],
  );
  for (const listener of listeners) listener();
}

export function subscribeToFavorites(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
