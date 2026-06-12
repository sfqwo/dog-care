import type { Feeding } from "@dog-care/domain";

export type FeedingListItemProps = {
  feeding: Feeding;
  onRemove: (id: string) => void;
  onEdit: (feeding: Feeding) => void;
};
