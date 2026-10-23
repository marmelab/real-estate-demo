const HAUTE_CORSE_FIRST_POSTAL_CODE = "20200";

export function getDepartmentCode(postalCode: string): string {
  if (postalCode.startsWith("97")) return postalCode.slice(0, 3);
  if (postalCode.startsWith("20")) {
    return postalCode < HAUTE_CORSE_FIRST_POSTAL_CODE ? "2A" : "2B";
  }
  return postalCode.slice(0, 2);
}
