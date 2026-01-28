import type { InputProps } from "../Input";

export type DateInputProps = Omit<InputProps, "keyboardType" | "valid">;
