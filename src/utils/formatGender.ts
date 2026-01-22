export function formatGender(value?: string) {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("м")) return "Мальчик";
  if (normalized.startsWith("д") || normalized.startsWith("ж")) return "Девочка";
  return value;
}
