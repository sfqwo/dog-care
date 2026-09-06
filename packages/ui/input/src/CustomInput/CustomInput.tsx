import { forwardRef } from "react";
import type { TextInput } from "react-native";
import {
  formatEmail,
  formatPhone,
  isEmailValueValid,
  isPhoneValueValid,
} from "@dog-care/core/utils";
import { Input } from "../Input";
import type { CustomInputProps } from "./types";

const EMAIL_ERROR_MESSAGE = "Введите корректный email";
const PHONE_ERROR_MESSAGE = "Введите корректный номер телефона";

export const EmailInput = forwardRef<TextInput, CustomInputProps>(function EmailInput(
  { autoCapitalize = "none", ...rest },
  ref
) {
  return (
    <Input
      ref={ref}
      {...rest}
      autoCapitalize={autoCapitalize}
      keyboardType="email-address"
      formatValue={formatEmail}
      validateValue={isEmailValueValid}
      validationMessage={EMAIL_ERROR_MESSAGE}
    />
  );
});
EmailInput.displayName = "@dog-care/input/EmailInput";

export const PhoneInput = forwardRef<TextInput, CustomInputProps>(function PhoneInput(
  props,
  ref
) {
  return (
    <Input
      ref={ref}
      {...props}
      keyboardType="phone-pad"
      formatValue={formatPhone}
      validateValue={isPhoneValueValid}
      validationMessage={PHONE_ERROR_MESSAGE}
    />
  );
});
PhoneInput.displayName = "@dog-care/input/PhoneInput";
