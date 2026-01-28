import { forwardRef, useMemo } from "react";
import type { TextInput } from "react-native";
import { formatEmail, isEmailValueValid } from "@dog-care/core/utils";
import { Input } from "../Input";
import type { EmailInputProps } from "./types";

export const EmailInput = forwardRef<TextInput, EmailInputProps>(function EmailInput(
  { value, onChangeText, autoCapitalize = "none", ...rest },
  ref
) {
  const isValid = useMemo(() => isEmailValueValid(value ?? ""), [value]);

  const handleChangeText = (text: string) => {
    const formatted = formatEmail(text);
    onChangeText?.(formatted);
  };

  return (
    <Input
      ref={ref}
      {...rest}
      value={value}
      autoCapitalize={autoCapitalize}
      keyboardType="email-address"
      onChangeText={handleChangeText}
      valid={isValid}
    />
  );
});

EmailInput.displayName = "@dog-care/input/EmailInput";
