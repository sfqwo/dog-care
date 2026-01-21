import { TextInput, TextInputProps } from "react-native";
import { styles } from "./styles";

type InputProps = TextInputProps & {
  variant?: "default" | "note";
};

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
