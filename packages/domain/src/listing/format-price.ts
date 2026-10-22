import type { TransactionType } from "./model.ts";

const priceFormat = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatPrice(
  price: number,
  transactionType: TransactionType,
): string {
  const formatted = priceFormat.format(price);
  return transactionType === "rent" ? `${formatted}/month` : formatted;
}
