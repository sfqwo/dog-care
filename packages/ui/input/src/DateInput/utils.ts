import type { FieldValues } from "react-hook-form";
import {
  formatDateInput,
  formatDateInputFromTimestamp,
  isDateValueValid,
  parseDate,
} from "@dog-care/core/utils";
import type { DateInputProps } from "./types";

export const DATE_ERROR_MESSAGE = "Введите дату в формате ДД.ММ.ГГГГ";

export function attachDateValidation(
  rules: DateInputProps["rules"],
  minimumDate?: number,
  maximumDate?: number
) {
  const validateDate = (value: string) =>
    isDateValueValid(formatDateInput(value ?? ""), minimumDate, maximumDate) ||
    DATE_ERROR_MESSAGE;

  if (!rules) return { validate: validateDate };
  if (!rules.validate) return { ...rules, validate: validateDate };
  if (typeof rules.validate === "function") {
    const existingValidate = rules.validate;
    return {
      ...rules,
      validate: (value: string, formValues: FieldValues) => {
        const baseResult = validateDate(value);
        if (baseResult !== true) return baseResult;
        return existingValidate(value, formValues);
      },
    };
  }
  return { ...rules, validate: { ...rules.validate, dateRule: validateDate } };
}

export function formatDatePickerValue(value: Date) {
  return formatDateInputFromTimestamp(value.getTime());
}

export function resolveDatePickerValue(
  value: string,
  minimumDate?: number,
  maximumDate?: number
) {
  const parsed = parseDate(value);
  const timestamp = parsed?.getTime() ?? Date.now();

  if (minimumDate && timestamp < minimumDate) return new Date(minimumDate);
  if (maximumDate && timestamp > maximumDate) return new Date(maximumDate);
  return new Date(timestamp);
}

export function toDateBoundary(timestamp?: number) {
  return timestamp ? new Date(timestamp) : undefined;
}
