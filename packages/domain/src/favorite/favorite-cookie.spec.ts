import {
  readFavoriteIds,
  serializeFavoritesCookie,
} from "./favorite-cookie.ts";

describe("readFavoriteIds", () => {
  it("should read the ids from a cookie header holding other cookies", () => {
    expect(readFavoriteIds("theme=dark; favorites=3.1.2; sb=x")).toEqual([
      3, 1, 2,
    ]);
  });

  it("should drop values that are not listing ids", () => {
    expect(readFavoriteIds("favorites=4.abc.-1.0.")).toEqual([4]);
  });

  it.each([null, "myfavorites=1"])(
    "should return no ids without the cookie (%s)",
    (cookieHeader) => {
      expect(readFavoriteIds(cookieHeader)).toEqual([]);
    },
  );

  it("should read back the ids it serialized", () => {
    expect(readFavoriteIds(serializeFavoritesCookie([2, 5]))).toEqual([2, 5]);
  });
});
