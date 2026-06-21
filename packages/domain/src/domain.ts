export type Walk = {
  id: string;
  startedAt: number;
  durationMin: number;
  petId: string;
  note?: string;
};

export type Feeding = {
  id: string;
  at: number;
  grams: number;
  petId: string;
  food?: string;
};

export type VetRecord = {
  id: string;
  at: number;
  title: string;
  date: string;
  time: string;
  petId: string;
  note?: string;
  clinic?: string;
};

export type WeightEntry = {
  id: string;
  petId: string;
  at: number;
  weight: number;
  note?: string;
};

export type AppetiteStatus = "normal" | "reduced" | "none" | "increased";
export type ActivityStatus = "normal" | "reduced" | "low" | "high";
export type StoolStatus = "normal" | "soft" | "diarrhea" | "constipation";

export type WellnessEntry = {
  id: string;
  petId: string;
  at: number;
  appetite: AppetiteStatus;
  activity: ActivityStatus;
  stool: StoolStatus;
  vomiting: boolean;
  itching: boolean;
  temperature?: number;
  note?: string;
};

export type MedicalDocumentType =
  | "analysis"
  | "prescription"
  | "conclusion"
  | "passport"
  | "other";

export type MedicalDocument = {
  id: string;
  petId: string;
  type: MedicalDocumentType;
  at: number;
  title?: string;
  note?: string;
  visitId?: string;
  imageUris: string[];
  createdAt: number;
};

export type ReminderCategory = "walk" | "feeding" | "vet" | "treatment" | "birthday" | "other";

export type ReminderRepeat = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type Reminder = {
  id: string;
  petId: string;
  title: string;
  dueAt: number;
  category: ReminderCategory;
  repeat: ReminderRepeat;
  repeatUntil?: number;
  yearlyMonth?: number;
  yearlyDay?: number;
  note?: string;
  completedAt?: number;
  notificationId?: string;
};

export type CompletedCareTaskSource = "reminder" | "feeding" | "walk" | "vet";

export type CompletedCareTask = {
  id: string;
  petId: string;
  title: string;
  completedAt: number;
  source: CompletedCareTaskSource;
  category?: ReminderCategory;
  note?: string;
  detail?: string;
  sourceRefId?: string;
};

export type MedicationCourse = {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  startAt: number;
  endAt: number;
  time: string;
  note?: string;
  reminderId: string;
  createdAt: number;
};

export type Pet = {
  id: string;
  name: string;
  breed?: string;
  birthdate?: string;
  species?: string;
  gender?: string;
  weight?: string;
  notes?: string;
};

export type PetProfilePayload = {
  name: string;
  breed?: string;
  birthdate?: string;
  species?: string;
  gender?: string;
  weight?: string;
  notes?: string;
};

export type UserProfile = {
  ownerName: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  pets: Pet[];
};

export type UserProfilePayload = {
  ownerName: string;
  email?: string;
  phone?: string;
  birthdate?: string;
};
