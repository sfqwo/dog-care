import type { InputProps } from "./types";

type FormatterType = NonNullable<InputProps["type"]>;

export function useInputFormatter(type?: FormatterType, keyboardType?: InputProps["keyboardType"]) {
  const resolvedType = type ?? inferTypeFromKeyboard(keyboardType);
  const resolvedKeyboard = keyboardType ?? inferKeyboardType(resolvedType);

  const formatValue = (value: string) => {
    switch (resolvedType) {
      case "phone":
        return formatPhone(value);
      case "email":
        return formatEmail(value);
      case "date":
        return formatDate(value);
      default:
        return value;
    }
  };

  return { resolvedType, resolvedKeyboard, formatValue };
}

function inferKeyboardType(inputType: FormatterType) {
  if (inputType === "phone") return "phone-pad";
  if (inputType === "email") return "email-address";
  if (inputType === "date") return "number-pad";
  return undefined;
}

function inferTypeFromKeyboard(keyboardType: InputProps["keyboardType"]): FormatterType {
  if (keyboardType === "phone-pad") return "phone";
  if (keyboardType === "email-address") return "email";
  return "text";
}

function formatPhone(value: string) {
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

function formatEmail(value: string) {
  const sanitized = value.replace(/[^\w@.+-]/g, "").toLowerCase();
  const atIndex = sanitized.indexOf("@");
  if (atIndex === -1) {
    return sanitized;
  }

  const local = sanitized.slice(0, atIndex);
  const domainRaw = sanitized.slice(atIndex + 1).replace(/@+/g, "");

  if (!local && !domainRaw) {
    return "";
  }

  if (!domainRaw) {
    return `${local}@`;
  }

  if (!local) {
    return domainRaw;
  }

  return `${local}@${domainRaw}`;
}

function formatDate(value: string) {
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
