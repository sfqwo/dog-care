export function formatDateTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}
