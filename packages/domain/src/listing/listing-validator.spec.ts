import { listListingsQuerySchema } from "./listing-validator.ts";

describe("listListingsQuerySchema", () => {
  it("should default to the first page of listings for sale", () => {
    expect(listListingsQuerySchema.parse({})).toEqual({
      transactionType: "sale",
      page: 1,
    });
  });

  it("should coerce numeric search params from strings", () => {
    expect(
      listListingsQuerySchema.parse({
        transactionType: "rent",
        city: "Lyon",
        minPrice: "500",
        maxPrice: "1000",
        minRooms: "2",
        minBedrooms: "1",
        minSurface: "30",
        page: "3",
      }),
    ).toEqual({
      transactionType: "rent",
      city: "Lyon",
      minPrice: 500,
      maxPrice: 1000,
      minRooms: 2,
      minBedrooms: 1,
      minSurface: 30,
      page: 3,
    });
  });

  it.each([
    { transactionType: "foo" },
    { minPrice: "abc" },
    { maxPrice: "-5" },
    { minRooms: "0" },
    { minBedrooms: "1.5" },
    { minSurface: "" },
    { page: "-2" },
    { page: "abc" },
  ])("should drop or default the invalid search param %o", (search) => {
    expect(listListingsQuerySchema.parse(search)).toEqual({
      transactionType: "sale",
      page: 1,
    });
  });

  it.each([
    ["  Lyon ", "Lyon"],
    ["   ", undefined],
  ])("should normalize the city %j to %j", (city, expected) => {
    expect(listListingsQuerySchema.parse({ city })).toEqual({
      transactionType: "sale",
      page: 1,
      city: expected,
    });
  });
});
