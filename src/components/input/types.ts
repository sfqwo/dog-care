import type { TextInputProps } from "react-native";

export type InputProps = TextInputProps & {
  variant?: "default" | "note";
};
