import type {
  AllergyEntry,
  CompletedCareTask,
  Feeding,
  HealthNoteField,
  MedicationCourse,
  MedicalDocument,
  Reminder,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthByPet,
  VetHealthInfo,
  VetRecord,
  Walk,
  WellnessEntry,
  WeightEntry,
} from "@dog-care/domain";

export type FeedingsByPet = Record<string, Feeding[]>;
export type WalksByPet = Record<string, Walk[]>;
export type VetRecordsByPet = Record<string, VetRecord[]>;
export type WeightEntriesByPet = Record<string, WeightEntry[]>;
export type MedicationCoursesByPet = Record<string, MedicationCourse[]>;
export type WellnessEntriesByPet = Record<string, WellnessEntry[]>;
export type MedicalDocumentsByPet = Record<string, MedicalDocument[]>;
export type RemindersByPet = Record<string, Reminder[]>;
export type { VetHealthByPet };
export type CompletedTasksByPet = Record<string, CompletedCareTask[]>;

export type CareRecordsContextValue = {
  isCareRecordsLoaded: boolean;
  feedingsByPet: FeedingsByPet;
  walksByPet: WalksByPet;
  vetRecordsByPet: VetRecordsByPet;
  weightEntriesByPet: WeightEntriesByPet;
  medicationCoursesByPet: MedicationCoursesByPet;
  wellnessEntriesByPet: WellnessEntriesByPet;
  medicalDocumentsByPet: MedicalDocumentsByPet;
  remindersByPet: RemindersByPet;
  vetHealthByPet: VetHealthByPet;
  completedTasksByPet: CompletedTasksByPet;
  getFeedings: (petId?: string | null) => Feeding[];
  getWalks: (petId?: string | null) => Walk[];
  getVetRecords: (petId?: string | null) => VetRecord[];
  getWeightEntries: (petId?: string | null) => WeightEntry[];
  getMedicationCourses: (petId?: string | null) => MedicationCourse[];
  getWellnessEntries: (petId?: string | null) => WellnessEntry[];
  getMedicalDocuments: (petId?: string | null) => MedicalDocument[];
  getReminders: (petId?: string | null) => Reminder[];
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
  addWeightEntry: (petId: string, entry: WeightEntry) => void;
  updateWeightEntry: (petId: string, entry: WeightEntry) => void;
  removeWeightEntry: (petId: string, id: string) => void;
  addMedicationCourse: (petId: string, course: MedicationCourse) => void;
  updateMedicationCourse: (petId: string, course: MedicationCourse) => void;
  removeMedicationCourse: (petId: string, id: string) => void;
  addWellnessEntry: (petId: string, entry: WellnessEntry) => void;
  updateWellnessEntry: (petId: string, entry: WellnessEntry) => void;
  removeWellnessEntry: (petId: string, id: string) => void;
  addMedicalDocument: (petId: string, document: MedicalDocument) => void;
  updateMedicalDocument: (petId: string, document: MedicalDocument) => void;
  removeMedicalDocument: (petId: string, id: string) => void;
  addReminder: (petId: string, reminder: Reminder) => void;
  removeReminder: (petId: string, id: string) => Promise<void>;
  completeReminder: (
    petId: string,
    id: string,
    options?: { onCompletedTask?: (petId: string, task: CompletedCareTask) => void }
  ) => Promise<void>;
  reloadReminders: () => Promise<void>;
  reloadCompletedTasks: () => Promise<void>;
  addCompletedTask: (petId: string, task: CompletedCareTask) => void;
  removeCompletedTask: (petId: string, id: string) => void;
  setVaccineEntries: (petId: string, type: VaccineType, entries: VaccineEntry[]) => void;
  setOptionalVaccines: (petId: string, next: VaccineEntry[]) => void;
  setTreatmentEntries: (petId: string, type: TreatmentType, next: TreatmentEntry[]) => void;
  setAllergyEntries: (petId: string, next: AllergyEntry[]) => void;
  setHealthNoteField: (petId: string, field: HealthNoteField, value: string) => void;
};
