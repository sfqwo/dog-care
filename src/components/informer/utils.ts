import type { InformerVariant } from "./types";

export function getInformerIcon(variant: InformerVariant) {
  if (variant === "error") return "alert-circle-outline" as const;
  if (variant === "info") return "information-outline" as const;
  return "check-circle-outline" as const;
}
