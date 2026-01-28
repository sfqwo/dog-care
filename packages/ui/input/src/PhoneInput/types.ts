import type { InputProps } from "../Input";

export type PhoneInputProps = Omit<InputProps, "keyboardType" | "valid">;
