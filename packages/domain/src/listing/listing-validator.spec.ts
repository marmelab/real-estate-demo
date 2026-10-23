import {
  listAdminListingsQuerySchema,
  listingInputSchema,
  listListingsQuerySchema,
} from "./listing-validator.ts";

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

const apartmentForm = {
  title: " Appartement haussmannien ",
  description: "Parquet, moulures et cheminées.",
  propertyType: "apartment",
  price: "890000",
  surfaceArea: "120",
  landArea: "",
  rooms: "5",
  bedrooms: "3",
  energyClass: "C",
  address: "12 avenue Hoche",
  postalCode: "75008",
  city: "Paris",
  latitude: "48.8768",
  longitude: "2.2986",
  published: true,
  agentId: "11111111-1111-4111-8111-111111111111",
};

describe("listingInputSchema", () => {
  it("should parse a valid apartment from form values", () => {
    expect(listingInputSchema.parse(apartmentForm)).toEqual({
      title: "Appartement haussmannien",
      description: "Parquet, moulures et cheminées.",
      propertyType: "apartment",
      price: 890000,
      surfaceArea: 120,
      landArea: null,
      rooms: 5,
      bedrooms: 3,
      energyClass: "C",
      address: "12 avenue Hoche",
      postalCode: "75008",
      city: "Paris",
      latitude: 48.8768,
      longitude: 2.2986,
      published: true,
      agentId: "11111111-1111-4111-8111-111111111111",
    });
  });

  it("should read a blank surface area as unknown", () => {
    expect(
      listingInputSchema.parse({ ...apartmentForm, surfaceArea: "" }),
    ).toMatchObject({
      surfaceArea: null,
    });
  });

  it("should save a new listing as a draft by default", () => {
    const { published: _published, ...draft } = apartmentForm;

    expect(listingInputSchema.parse(draft)).toMatchObject({ published: false });
  });

  it.each([
    { title: "  " },
    { price: "0" },
    { postalCode: "7500" },
    { city: "Marseille" },
    { latitude: "91" },
    { latitude: "" },
  ])("should reject the listing with %o", (invalid) => {
    expect(
      listingInputSchema.safeParse({ ...apartmentForm, ...invalid }).success,
    ).toBe(false);
  });
});

describe("listAdminListingsQuerySchema", () => {
  it("should default to the newest listings first", () => {
    expect(listAdminListingsQuerySchema.parse({})).toEqual({
      sort: "createdAt",
      order: "desc",
      page: 1,
    });
  });

  it.each([
    { status: "archived" },
    { sort: "surface" },
    { order: "up" },
    { page: "0" },
    { city: "Marseille" },
  ])("should drop or default the invalid search param %o", (search) => {
    expect(listAdminListingsQuerySchema.parse(search)).toEqual({
      sort: "createdAt",
      order: "desc",
      page: 1,
    });
  });

  it.each([
    ["  villa ", "villa"],
    ["   ", undefined],
  ])("should normalize the title search %j to %j", (q, expected) => {
    expect(listAdminListingsQuerySchema.parse({ q })).toEqual({
      q: expected,
      sort: "createdAt",
      order: "desc",
      page: 1,
    });
  });
});
