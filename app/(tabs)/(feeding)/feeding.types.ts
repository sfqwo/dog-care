import type { Feeding } from "@dog-care/types";

export type FeedingListItemProps = {
  feeding: Feeding;
  onRemove: (id: string) => void;
};
