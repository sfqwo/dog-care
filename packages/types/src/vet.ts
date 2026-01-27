import type { VetRecord } from "./domain";

export type VaccineType = "core" | "rabies" | "lepto";

export type AllergyEntry = {
  trigger?: string;
  reaction?: string;
  notes?: string;
};

export type VaccineEntry = {
  date?: string;
  vaccineName?: string;
  manufacturer?: string;
  batchNumber?: string;
  validUntil?: string;
  clinic?: string;
  reactionNotes?: string;
};

export type VaccineEntries = VaccineEntry[];

export type TreatmentEntry = {
  date?: string;
  product?: string;
  dose?: string;
  notes?: string;
};

export type TreatmentType = "deworming" | "ectoparasites";

export type VetHealthInfo = {
  vaccines?: Partial<Record<VaccineType, VaccineEntries>>;
  optionalVaccines?: VaccineEntry[];
  deworming?: TreatmentEntry[];
  ectoparasites?: TreatmentEntry[];
  allergyEntries?: AllergyEntry[];
  contraindicationNotes?: string;
  healthNotes?: string;
};

export type VetRecordsByPet = Record<string, VetRecord[]>;
export type VetHealthByPet = Record<string, VetHealthInfo>;

export type HealthNoteField = "contraindicationNotes" | "healthNotes";
