export function isPositiveNumber(value: string | number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}
