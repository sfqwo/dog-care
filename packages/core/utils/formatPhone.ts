export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  const country = digits[0] ?? "";
  const local = digits.slice(1);
  let result = country ? `+${country}` : "";

  if (!local) {
    return result;
  }

  if (local.length < 4) {
    return `${result} ${local}`.trim();
  }

  const area = local.slice(0, 3);
  result += ` (${area})`;

  const line = local.slice(3);
  if (!line) return result;

  if (line.length <= 3) {
    return `${result} ${line}`.trim();
  }

  const part1 = line.slice(0, 3);
  const part2 = line.slice(3, 5);
  const part3 = line.slice(5, 7);

  result += ` ${part1}`;
  if (part2) result += `-${part2}`;
  if (part3) result += `-${part3}`;

  return result.trim();
}
