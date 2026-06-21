export function normalizeDecimalInput(value: string) {
  return value.replace(/,/g, ".");
}
