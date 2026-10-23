import {
  getFavoriteIds,
  subscribeToFavorites,
  toggleFavorite,
} from "./favorite-store.ts";

describe("favorite store", () => {
  beforeEach(() => {
    vi.stubGlobal("document", { cookie: "" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should add a listing first, then remove it", () => {
    toggleFavorite(1);
    toggleFavorite(2);
    expect(getFavoriteIds()).toEqual([2, 1]);

    toggleFavorite(1);
    expect(getFavoriteIds()).toEqual([2]);
  });

  it("should return the same array while the cookie is unchanged", () => {
    toggleFavorite(1);
    expect(getFavoriteIds()).toBe(getFavoriteIds());
  });

  it("should notify subscribers until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToFavorites(listener);

    toggleFavorite(1);
    unsubscribe();
    toggleFavorite(1);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
