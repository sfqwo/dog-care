import type { VetRecord } from "@/packages/types/src";

export type UseVetRecordFormOptions = {
  selectedPetId?: string | null;
  onSubmit: (record: VetRecord) => void;
};