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

export type ReminderCategory = "walk" | "feeding" | "vet" | "treatment" | "other";

export type ReminderRepeat = "none" | "daily" | "weekly" | "monthly";

export type Reminder = {
  id: string;
  petId: string;
  title: string;
  dueAt: number;
  category: ReminderCategory;
  repeat: ReminderRepeat;
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
