import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { InputProps } from "../Input";

export type CustomInputProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  InputProps,
  "keyboardType"
> & {
  control?: Control<any>;
  name?: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
};

export type DateInputProps<TFieldValues extends FieldValues = FieldValues> =
  CustomInputProps<TFieldValues> & {
    minimumDate?: number;
    maximumDate?: number;
  };
