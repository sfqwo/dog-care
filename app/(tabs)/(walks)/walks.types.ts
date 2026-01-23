import type { Walk } from "@/src/domain/types";

export type WalkListItemProps = {
  walk: Walk;
  onRemove: (id: string) => void;
};
