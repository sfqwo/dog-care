import type { VetRecord } from "@/src/domain/types";

export type VetListItemProps = {
  record: VetRecord;
  onRemove: (id: string) => void;
};
