export function sortNewestFirst<T>(items: T[], getTimestamp: (item: T) => number) {
  return [...items].sort((first, second) => getTimestamp(second) - getTimestamp(first));
}

export function getOptionTitle(
  options: { value: string; title: string }[],
  value: string | undefined,
  fallback = value ?? ""
) {
  return options.find((option) => option.value === value)?.title ?? fallback;
}
