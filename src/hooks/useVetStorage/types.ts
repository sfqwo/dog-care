import type {
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthInfo,
  VetRecord,
} from "@dog-care/types";

export type UseVetStorageResult = {
  records: VetRecord[];
  healthInfo: VetHealthInfo;
  addRecord: (record: VetRecord) => void;
  removeRecord: (id: string) => void;
  setVaccineEntries: (type: VaccineType, entries: VaccineEntry[]) => void;
  setOptionalVaccines: (next: VaccineEntry[]) => void;
  setTreatmentEntries: (type: TreatmentType, next: TreatmentEntry[]) => void;
  setAllergyEntries: (next: AllergyEntry[]) => void;
  setHealthNoteField: (field: HealthNoteField, value: string) => void;
};