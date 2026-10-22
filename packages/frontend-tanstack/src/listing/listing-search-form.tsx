import type { ListListingsQuery } from "@remix-v3-demo/domain/listing/listing-validator";
import type { TransactionType } from "@remix-v3-demo/domain/listing/model";

import { listListingsQuerySchema } from "@remix-v3-demo/domain/listing/listing-validator";

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  sale: "Buy",
  rent: "Rent",
};

function hasCriteria(search: ListListingsQuery): boolean {
  return [
    search.city,
    search.minPrice,
    search.maxPrice,
    search.minRooms,
    search.minBedrooms,
    search.minSurface,
  ].some((criterion) => criterion !== undefined);
}

export function ListingSearchForm({
  search,
  onSearch,
}: {
  search: ListListingsQuery;
  onSearch: (search: ListListingsQuery) => void;
}) {
  return (
    <form
      method="get"
      action="/"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(
          listListingsQuerySchema.parse(
            Object.fromEntries(new FormData(event.currentTarget)),
          ),
        );
      }}
      className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
    >
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-gray-700">
          Transaction
        </legend>
        <div className="flex rounded-md border border-gray-300">
          {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
            <label
              key={value}
              className="relative flex min-h-11 flex-1 items-center justify-center px-4 text-gray-700 first:rounded-l-md last:rounded-r-md has-checked:bg-blue-700 has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-blue-700"
            >
              <input
                type="radio"
                name="transactionType"
                value={value}
                defaultChecked={search.transactionType === value}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <SearchField label="City" name="city" defaultValue={search.city} />
      <SearchField
        label="Min price (€)"
        name="minPrice"
        defaultValue={search.minPrice}
        isNumeric
      />
      <SearchField
        label="Max price (€)"
        name="maxPrice"
        defaultValue={search.maxPrice}
        isNumeric
      />
      {hasCriteria(search) && (
        <>
          <SearchField
            label="Min rooms"
            name="minRooms"
            defaultValue={search.minRooms}
            isNumeric
          />
          <SearchField
            label="Min bedrooms"
            name="minBedrooms"
            defaultValue={search.minBedrooms}
            isNumeric
          />
          <SearchField
            label="Min surface (m²)"
            name="minSurface"
            defaultValue={search.minSurface}
            isNumeric
          />
        </>
      )}
      <button
        type="submit"
        className="min-h-11 rounded-md bg-blue-700 px-6 font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Search
      </button>
    </form>
  );
}

function SearchField({
  label,
  name,
  defaultValue,
  isNumeric = false,
}: {
  label: string;
  name: string;
  defaultValue: string | number | undefined;
  isNumeric?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 sm:w-36">
      {label}
      <input
        name={name}
        defaultValue={defaultValue}
        inputMode={isNumeric ? "numeric" : undefined}
        className="min-h-11 rounded-md border border-gray-300 px-3 text-base font-normal text-gray-900"
      />
    </label>
  );
}
