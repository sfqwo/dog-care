export function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
