import type { Walk } from "@dog-care/domain";

export type WalkListItemProps = {
  walk: Walk;
  onRemove: (id: string) => void;
  onEdit: (walk: Walk) => void;
};
