import type { ReactNode } from "react";

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
  animationType?: "none" | "slide" | "fade";
};

export type ModalContextValue = {
  onClose: () => void;
};

export type ModalTextProps = {
  children: ReactNode;
};

export type ModalActionsProps = {
  children: ReactNode;
};

export type ModalActionButtonProps = {
  children: ReactNode;
  onPress?: () => void;
  closeOnPress?: boolean;
  disabled?: boolean;
};
