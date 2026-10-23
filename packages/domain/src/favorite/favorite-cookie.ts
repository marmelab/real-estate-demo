export const FAVORITES_COOKIE = "favorites";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
const ID_SEPARATOR = ".";

export function readFavoriteIds(
  cookieHeader: string | null | undefined,
): number[] {
  const value = cookieHeader?.match(
    new RegExp(`(?:^|;\\s*)${FAVORITES_COOKIE}=([^;]*)`),
  )?.[1];
  return (value ?? "")
    .split(ID_SEPARATOR)
    .map(Number)
    .filter((id) => Number.isSafeInteger(id) && id > 0);
}

export function serializeFavoritesCookie(ids: number[]): string {
  return `${FAVORITES_COOKIE}=${ids.join(ID_SEPARATOR)}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax`;
}
