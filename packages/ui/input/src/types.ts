import type { TextInputProps } from "react-native";

export type BaseInputProps = TextInputProps & {
  hidden?: boolean;
};

export type InputProps = BaseInputProps & {
  type?: "text" | "phone" | "email" | "date";
};
