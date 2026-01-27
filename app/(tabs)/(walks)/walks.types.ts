import type { Walk } from "@dog-care/types";

export type WalkListItemProps = {
  walk: Walk;
  onRemove: (id: string) => void;
};
