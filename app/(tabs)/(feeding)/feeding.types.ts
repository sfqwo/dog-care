import type { Feeding } from "@/src/domain/types";

export type FeedingListItemProps = {
  feeding: Feeding;
  onRemove: (id: string) => void;
};
