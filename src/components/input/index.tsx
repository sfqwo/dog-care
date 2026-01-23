import { TextInput } from "react-native";
import { styles } from "./styles";
import type { InputProps } from "./types";

export function Input({ style, multiline, variant, ...rest }: InputProps) {
  const resolvedVariant = variant ?? (multiline ? "note" : "default");
  return (
    <TextInput
      style={[styles.base, resolvedVariant === "note" && styles.note, style]}
      multiline={multiline}
      {...rest}
    />
  );
}
