import type { ReactNode } from "react";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { StyleProp, ViewStyle } from "react-native";

export type SelectOptionSlotTextProps = {
  text: string;
};

export type SelectOptionProps = {
  value: string;
  children?: ReactNode;
};

export type ParsedSelectOption = {
  value: string;
  title?: string;
  text?: string;
  description?: string;
};

export type SelectProps<TFieldValues extends FieldValues = FieldValues> = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  modalTitle?: string;
  onChange?: (value: string, option?: ParsedSelectOption) => void;
  control?: Control<any>;
  name?: Path<TFieldValues>;
  rules?: RegisterOptions<TFieldValues>;
  children: ReactNode;
};

export type SelectHeaderProps = {
  children?: ReactNode;
};

export type RenderConfig = {
  options: ParsedSelectOption[];
  onSelect: (option: ParsedSelectOption) => void;
};
