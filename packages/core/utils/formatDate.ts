export function formatDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const rawDay = digits.slice(0, 2);
  const rawMonth = digits.slice(2, 4);
  const rawYear = digits.slice(4, 8);

  const currentYear = new Date().getFullYear();

  let monthDisplay = rawMonth;
  let monthNum: number | undefined;
  if (rawMonth.length === 2) {
    monthNum = clampNumber(parseInt(rawMonth, 10), 1, 12);
    monthDisplay = pad2(monthNum);
  }

  let yearDisplay = rawYear;
  let yearNum: number | undefined;
  if (rawYear.length === 4) {
    const clampedYear = clampNumber(parseInt(rawYear, 10), 1900, currentYear);
    yearNum = clampedYear;
    yearDisplay = clampedYear.toString();
  }

  let dayDisplay = rawDay;
  if (rawDay.length === 2) {
    const maxDay = monthNum ? daysInMonth(monthNum, yearNum ?? currentYear) : 31;
    const dayNum = clampNumber(parseInt(rawDay, 10), 1, maxDay);
    dayDisplay = pad2(dayNum);
  }

  const segments = [];
  if (dayDisplay) segments.push(dayDisplay);
  if (monthDisplay) segments.push(monthDisplay);
  if (yearDisplay) segments.push(yearDisplay);
  return segments.join(".");
}

function clampNumber(value: number, min: number, max: number) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}
