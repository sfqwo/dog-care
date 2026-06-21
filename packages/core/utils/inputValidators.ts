import { parseDate } from "./dateTime";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailValueValid(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return EMAIL_REGEX.test(trimmed);
}

export function isPhoneValueValid(value: string) {
  return hasMinDigits(value, 11);
}

export function isDateValueValid(value: string, minimumDate?: number, maximumDate?: number) {
  if (!value.replace(/\D/g, "")) return true;
  const date = parseDate(value);
  if (!date) return false;
  const timestamp = date.getTime();
  return (
    (!minimumDate || timestamp >= minimumDate) &&
    (!maximumDate || timestamp <= maximumDate)
  );
}

function hasMinDigits(value: string, min: number) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return true;
  return digits.length >= min;
}
