export function readText(formData: FormData, name: string): string {
  let value = formData.get(name);
  return typeof value === "string" ? value : "";
}
