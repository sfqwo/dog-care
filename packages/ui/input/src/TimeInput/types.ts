import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { InputProps } from "../Input";

export type TimeInputProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<InputProps, "keyboardType" | "formatValue" | "validateValue" | "validationMessage"> & {
    control?: Control<any>;
    name?: Path<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
  };

export type NativeTimePickerProps = {
  value: Date;
  onClose: () => void;
  onSelect: (value: Date) => void;
};
