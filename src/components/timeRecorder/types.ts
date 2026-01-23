import type { ReactNode } from "react";

export type TimeRecorderProps = {
  children: ReactNode;
};

export type TimeRecorderTitleProps = {
  children: ReactNode;
};

export type TimeRecorderRowProps = {
  children: ReactNode;
};

export type TimeRecorderButtonProps = {
  label: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};
