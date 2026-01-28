import { forwardRef, useMemo } from "react";
import type { TextInput } from "react-native";
import { formatPhone, isPhoneValueValid } from "@dog-care/core/utils";
import { Input } from "../Input";
import type { PhoneInputProps } from "./types";

export const PhoneInput = forwardRef<TextInput, PhoneInputProps>(function PhoneInput(
  { value, onChangeText, ...rest },
  ref
) {
  const isValid = useMemo(() => isPhoneValueValid(value ?? ""), [value]);

  const handleChangeText = (text: string) => {
    const formatted = formatPhone(text);
    onChangeText?.(formatted);
  };

  return (
    <Input
      ref={ref}
      {...rest}
      value={value}
      keyboardType="phone-pad"
      onChangeText={handleChangeText}
      valid={isValid}
    />
  );
});

PhoneInput.displayName = "@dog-care/input/PhoneInput";
