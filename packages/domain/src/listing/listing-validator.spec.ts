import { listListingsQuerySchema } from "./listing-validator.ts";

describe("listListingsQuerySchema", () => {
  it("should default to the first page of listings", () => {
    expect(listListingsQuerySchema.parse({})).toEqual({
      page: 1,
    });
  });

  it("should coerce numeric search params from strings", () => {
    expect(
      listListingsQuerySchema.parse({
        city: "Lyon",
        propertyType: "apartment",
        minPrice: "500",
        maxPrice: "1000",
        minRooms: "2",
        minBedrooms: "1",
        minSurface: "30",
        maxSurface: "200",
        energyClasses: "E,F,G",
        page: "3",
      }),
    ).toEqual({
      city: "Lyon",
      propertyType: "apartment",
      minPrice: 500,
      maxPrice: 1000,
      minRooms: 2,
      minBedrooms: 1,
      minSurface: 30,
      maxSurface: 200,
      energyClasses: ["E", "F", "G"],
      page: 3,
    });
  });

  it("should keep the energy classes already parsed from the URL", () => {
    expect(
      listListingsQuerySchema.parse({ energyClasses: ["A", "B"] }),
    ).toEqual({ energyClasses: ["A", "B"], page: 1 });
  });

  it.each([
    { minPrice: "abc" },
    { maxPrice: "-5" },
    { minRooms: "0" },
    { minBedrooms: "1.5" },
    { minSurface: "" },
    { energyClasses: "Z" },
    { propertyType: "castle" },
    { page: "-2" },
    { page: "abc" },
  ])("should drop or default the invalid search param %o", (search) => {
    expect(listListingsQuerySchema.parse(search)).toEqual({
      page: 1,
    });
  });

  it.each([
    ["  Lyon ", "Lyon"],
    ["   ", undefined],
  ])("should normalize the city %j to %j", (city, expected) => {
    expect(listListingsQuerySchema.parse({ city })).toEqual({
      page: 1,
      city: expected,
    });
  });
});
