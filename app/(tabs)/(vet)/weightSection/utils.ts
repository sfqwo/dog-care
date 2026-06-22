export function formatWeight(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

export function formatWeightDelta(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  if (value === 0) return "0 кг";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatWeight(value)} кг`;
}
