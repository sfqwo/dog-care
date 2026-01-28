import type { BaseInputProps } from "../BaseInput";

export type InputProps = BaseInputProps & {
  valid?: boolean;
  onValidityChange?: (isValid: boolean) => void;
};
