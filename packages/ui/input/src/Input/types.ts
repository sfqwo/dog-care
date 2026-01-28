import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { BaseInputProps } from "../BaseInput";

export type InputProps<TFieldValues extends FieldValues = FieldValues> = BaseInputProps & {
  control?: Control<any>;
  name?: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  formatValue?: (text: string) => string;
  validateValue?: (value: string) => boolean;
  validationMessage?: string;
};
