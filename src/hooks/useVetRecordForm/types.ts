import type { VetRecord } from "@dog-care/domain";

export type UseVetRecordFormOptions = {
  selectedPetId?: string | null;
  onSubmit: (record: VetRecord) => void;
};
