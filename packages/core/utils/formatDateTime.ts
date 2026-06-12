export function formatDateTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

export function parseTime(timeValue: string): Date | null {
  const match = timeValue.match(/^(\d{2}):(\d{2})$/);

  if (!match) return null;

  const [, hoursStr, minutesStr] = match;

  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date;
}

export function isSameLocalDay(first: number, second: number) {
  const firstDate = new Date(first);
  const secondDate = new Date(second);
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function isBeforeToday(timestamp: number, now: number) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return timestamp < today.getTime();
}
