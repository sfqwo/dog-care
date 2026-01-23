import { useCallback, useMemo } from "react";
import type { InputProps } from "./types";
import { formatDate, formatEmail, formatPhone } from "@dog-care/core/utils";

type FormatterType = NonNullable<InputProps["type"]>;

export function useInputFormatter(
  type?: FormatterType,
  keyboardType?: InputProps["keyboardType"]
) {
  const resolvedType = useMemo(
    () => type ?? inferTypeFromKeyboard(keyboardType),
    [keyboardType, type]
  );

  const resolvedKeyboard = useMemo(
    () => keyboardType ?? inferKeyboardType(resolvedType),
    [keyboardType, resolvedType]
  );

  const formatValue = useCallback(
    (value: string) => {
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
    },
    [resolvedType]
  );

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
