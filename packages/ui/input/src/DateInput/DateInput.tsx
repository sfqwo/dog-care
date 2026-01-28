import { forwardRef, useMemo } from "react";
import type { TextInput } from "react-native";
import { formatDate, isDateValueValid } from "@dog-care/core/utils";
import { Input } from "../Input";
import type { DateInputProps } from "./types";

export const DateInput = forwardRef<TextInput, DateInputProps>(function DateInput(
  { value, onChangeText, ...rest },
  ref
) {
  const isValid = useMemo(() => isDateValueValid(value ?? ""), [value]);

  const handleChangeText = (text: string) => {
    const formatted = formatDate(text);
    onChangeText?.(formatted);
  };

  return (
    <Input
      ref={ref}
      {...rest}
      value={value}
      keyboardType="number-pad"
      onChangeText={handleChangeText}
      valid={isValid}
    />
  );
});

DateInput.displayName = "@dog-care/input/DateInput";
