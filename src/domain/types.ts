export type Walk = {
  id: string;
  startedAt: number;
  durationMin: number;
  note?: string;
};

export type Feeding = {
  id: string;
  at: number;
  grams: number;
  food?: string;
};

export type VetRecord = {
  id: string;
  at: number;
  title: string;
  note?: string;
  clinic?: string;
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
  city?: string;
  pets: Pet[];
};

export type UserProfilePayload = {
  ownerName: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  city?: string;
};
