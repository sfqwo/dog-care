const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailValueValid(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;
  return EMAIL_REGEX.test(trimmed);
}

export function isPhoneValueValid(value: string) {
  return hasMinDigits(value, 11);
}

export function isDateValueValid(value: string) {
  return hasMinDigits(value, 8);
}

function hasMinDigits(value: string, min: number) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return true;
  return digits.length >= min;
}
