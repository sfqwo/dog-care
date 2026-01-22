export function formatWeight(value: string) {
  if (!value) return "";
  return /(кг|kg)/i.test(value) ? value : `${value} кг`;
}