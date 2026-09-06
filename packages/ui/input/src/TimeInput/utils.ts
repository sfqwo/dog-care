import type { FieldValues } from "react-hook-form";
import { formatTimeInputFromTimestamp, isTimeValueValid, parseTime } from "@dog-care/core/utils";
import type { TimeInputProps } from "./types";

export const TIME_ERROR_MESSAGE = "Введите время в формате ЧЧ:ММ";

export function attachTimeValidation(rules: TimeInputProps["rules"]) {
  const validateTime = (value: string) =>
    isTimeValueValid(value ?? "") || TIME_ERROR_MESSAGE;

  if (!rules) return { validate: validateTime };
  if (!rules.validate) return { ...rules, validate: validateTime };
  if (typeof rules.validate === "function") {
    const existingValidate = rules.validate;
    return {
      ...rules,
      validate: (value: string, formValues: FieldValues) => {
        const baseResult = validateTime(value);
        if (baseResult !== true) return baseResult;
        return existingValidate(value, formValues);
      },
    };
  }
  return { ...rules, validate: { ...rules.validate, timeRule: validateTime } };
}

export function formatTimePickerValue(value: Date) {
  return formatTimeInputFromTimestamp(value.getTime());
}

export function resolveTimePickerValue(value: string) {
  const parsed = parseTime(value);
  if (parsed) return parsed;

  const date = new Date();
  date.setHours(12, 0, 0, 0);
  return date;
}
