const DEFAULT_LOCALE = "ru-RU";

export function formatDateTime(timestamp: number) {
  return `${formatDateInputFromTimestamp(timestamp)}, ${formatTimeInputFromTimestamp(timestamp)}`;
}

export function parseTime(timeValue: string): Date | null {
  const match = timeValue.match(/^(\d{2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)]
    .filter(Boolean)
    .join(".");
}

export function formatTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);
  return minutes ? `${hours}:${minutes}` : hours;
}

export function formatDateInputFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return [pad2(date.getDate()), pad2(date.getMonth() + 1), date.getFullYear()].join(".");
}

export function formatCurrentDateInput(now = Date.now()) {
  return formatDateInputFromTimestamp(now);
}

export function formatTimeInputFromTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  return [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

export function parseDateTimeInput(dateValue: string, timeValue: string) {
  const dateMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dateValue);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue);
  if (!dateMatch || !timeMatch) return null;

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const parsed = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    return null;
  }

  return parsed.getTime();
}

export function parseDate(dateValue: string): Date | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dateValue);
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

export function parseDateInputTimestamp(value: string, hours = 12) {
  const date = parseDate(value);
  if (!date) return null;
  date.setHours(hours, 0, 0, 0);
  return date.getTime();
}

export function formatLocalDate(timestamp: number, options?: Intl.DateTimeFormatOptions) {
  if (!options) return formatDateInputFromTimestamp(timestamp);
  return new Date(timestamp).toLocaleDateString(DEFAULT_LOCALE, options);
}

export function startOfLocalDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function isSameLocalDay(first: number, second: number) {
  return startOfLocalDay(first) === startOfLocalDay(second);
}

export function isBeforeToday(timestamp: number, now: number) {
  return timestamp < startOfLocalDay(now);
}

export function endOfLocalDay(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

export function createClampedLocalDate(
  year: number,
  monthIndex: number,
  day: number,
  hours = 0,
  minutes = 0
) {
  const date = new Date(year, monthIndex, day, hours, minutes, 0, 0);
  if (date.getMonth() !== monthIndex) {
    return new Date(year, monthIndex + 1, 0, hours, minutes, 0, 0);
  }
  return date;
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}
