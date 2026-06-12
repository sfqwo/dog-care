import type {
  AllergyEntry,
  CompletedCareTask,
  Feeding,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthByPet,
  VetHealthInfo,
  VetRecord,
  Walk,
} from "@dog-care/types";

export type FeedingsByPet = Record<string, Feeding[]>;
export type WalksByPet = Record<string, Walk[]>;
export type VetRecordsByPet = Record<string, VetRecord[]>;
export type { VetHealthByPet };
export type CompletedTasksByPet = Record<string, CompletedCareTask[]>;

export type CareRecordsContextValue = {
  feedingsByPet: FeedingsByPet;
  walksByPet: WalksByPet;
  vetRecordsByPet: VetRecordsByPet;
  vetHealthByPet: VetHealthByPet;
  completedTasksByPet: CompletedTasksByPet;
  getFeedings: (petId?: string | null) => Feeding[];
  getWalks: (petId?: string | null) => Walk[];
  getVetRecords: (petId?: string | null) => VetRecord[];
  getVetHealth: (petId?: string | null) => VetHealthInfo;
  getCompletedTasks: (petId?: string | null) => CompletedCareTask[];
  addFeeding: (petId: string, feeding: Feeding) => void;
  updateFeeding: (petId: string, feeding: Feeding) => void;
  removeFeeding: (petId: string, id: string) => void;
  addWalk: (petId: string, walk: Walk) => void;
  updateWalk: (petId: string, walk: Walk) => void;
  removeWalk: (petId: string, id: string) => void;
  addVetRecord: (petId: string, record: VetRecord) => void;
  removeVetRecord: (petId: string, id: string) => void;
  addCompletedTask: (petId: string, task: CompletedCareTask) => void;
  removeCompletedTask: (petId: string, id: string) => void;
  setVaccineEntries: (petId: string, type: VaccineType, entries: VaccineEntry[]) => void;
  setOptionalVaccines: (petId: string, next: VaccineEntry[]) => void;
  setTreatmentEntries: (petId: string, type: TreatmentType, next: TreatmentEntry[]) => void;
  setAllergyEntries: (petId: string, next: AllergyEntry[]) => void;
  setHealthNoteField: (petId: string, field: HealthNoteField, value: string) => void;
};
