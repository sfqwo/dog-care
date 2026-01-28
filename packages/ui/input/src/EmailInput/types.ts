import type { InputProps } from "../Input";

export type EmailInputProps = Omit<InputProps, "keyboardType" | "valid">;
