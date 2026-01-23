import type { ReactNode } from "react";

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

export type SelectProps = {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  modalTitle?: string;
  onChange?: (value: string, option?: ParsedSelectOption) => void;
  children: ReactNode;
};

export type SelectHeaderProps = {
  children?: ReactNode;
};

export type RenderConfig = {
  options: ParsedSelectOption[];
  onSelect: (option: ParsedSelectOption) => void;
};
