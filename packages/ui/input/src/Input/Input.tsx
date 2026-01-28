import { forwardRef, useMemo } from "react";
import type {
  BlurEvent,
  TextInput,
} from "react-native";
import { FieldValues, useController } from "react-hook-form";
import { BaseInput } from "../BaseInput";
import type { InputProps } from "./types";
import { styles as inputStyles } from "./styles";

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    control,
    name,
    rules,
    formatValue,
    validateValue,
    validationMessage,
    value: valueProp,
    onChangeText,
    style,
    onBlur,
    ...rest
  },
  ref
) {
  const resolvedRules =
    control && name && validateValue
      ? attachValidation(rules, validateValue, validationMessage)
      : rules;

  const controller =
    control && name ? useController({ control, name, rules: resolvedRules }) : undefined;

  const value = controller ? controller.field.value : valueProp;
  const computedValidity = useMemo(
    () => (validateValue ? validateValue(value ?? "") : true),
    [validateValue, value]
  );
  const controllerInvalid = controller?.fieldState.invalid ?? false;
  const isInvalid = controllerInvalid || computedValidity === false;

  const handleChangeText = (text: string) => {
    const formatted = formatValue ? formatValue(text) : text;
    controller?.field.onChange(formatted);
    onChangeText?.(formatted);
  };

  const handleBlur = (event: BlurEvent) => {
    controller?.field.onBlur();
    onBlur?.(event);
  };

  const combinedStyle = [
    style,
    isInvalid ? inputStyles.invalid : null,
  ];

  return (
    <BaseInput
      ref={ref}
      {...rest}
      value={value}
      style={combinedStyle}
      onChangeText={handleChangeText}
      onBlur={handleBlur}
    />
  );
});
Input.displayName = "@dog-care/input/Input";

function attachValidation(
  rules: InputProps["rules"],
  validateValue: NonNullable<InputProps["validateValue"]>,
  validationMessage?: string
) {
  if (!validateValue) return rules;
  const baseValidate = (value: string) =>
    validateValue(value ?? "") || validationMessage || "Поле заполнено некорректно";

  if (!rules) {
    return { validate: baseValidate };
  }

  if (!rules.validate) {
    return { ...rules, validate: baseValidate };
  }

  if (typeof rules.validate === "function") {
    const existingValidate = rules.validate;
    return {
      ...rules,
      validate: (value: string, formValues: FieldValues) => {
        const baseResult = baseValidate(value);
        if (baseResult !== true) {
          return baseResult;
        }
        return existingValidate(value, formValues);
      },
    };
  }

  return {
    ...rules,
    validate: {
      ...rules.validate,
      formatRule: baseValidate,
    },
  };
}
