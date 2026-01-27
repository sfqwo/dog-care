import type { VetRecord } from "@dog-care/types";

export type VetRecordsSectionProps = {
  isActive: boolean;
  hasPets: boolean;
  records: VetRecord[];
  selectedPetId?: string | null;
  onAddRecord: (record: VetRecord) => void;
  onRemoveRecord: (id: string) => void;
};

export type VetRecordCardProps = {
  record: VetRecord;
  onRemove: (id: string) => void;
};