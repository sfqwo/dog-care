import { forwardRef } from "react";
import type { TextInput } from "react-native";
import { formatDate, formatEmail, formatPhone, isDateValueValid, isEmailValueValid, isPhoneValueValid } from "@dog-care/core/utils";
import { Input } from "../Input";
import type { CustomInputProps } from "./types";

const EMAIL_ERROR_MESSAGE = "Введите корректный email";
const PHONE_ERROR_MESSAGE = "Введите корректный номер телефона";
const DATE_ERROR_MESSAGE = "Введите дату в формате ДД.ММ.ГГГГ";

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

export const DateInput = forwardRef<TextInput, CustomInputProps>(function DateInput(
  props,
  ref
) {
  return (
    <Input
      ref={ref}
      {...props}
      keyboardType="number-pad"
      formatValue={formatDate}
      validateValue={isDateValueValid}
      validationMessage={DATE_ERROR_MESSAGE}
    />
  );
});
DateInput.displayName = "@dog-care/input/DateInput";
