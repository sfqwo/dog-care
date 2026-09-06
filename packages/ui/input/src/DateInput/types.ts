import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { InputProps } from "../Input";

export type DateInputProps<TFieldValues extends FieldValues = FieldValues> =
  Omit<InputProps, "keyboardType" | "formatValue" | "validateValue" | "validationMessage"> & {
    control?: Control<any>;
    name?: Path<TFieldValues>;
    rules?: RegisterOptions<TFieldValues>;
    minimumDate?: number;
    maximumDate?: number;
  };

export type NativeDatePickerProps = {
  value: Date;
  minimumDate?: number;
  maximumDate?: number;
  onClose: () => void;
  onSelect: (value: Date) => void;
};
