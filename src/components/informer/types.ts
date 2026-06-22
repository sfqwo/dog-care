import type { ReactNode } from "react";

export type InformerVariant = "success" | "info" | "error";

export type InformerProviderProps = {
  children: ReactNode;
};

export type InformerContextValue = {
  showInformer: (message: string, variant?: InformerVariant) => void;
  showSuccess: (message: string) => void;
};
