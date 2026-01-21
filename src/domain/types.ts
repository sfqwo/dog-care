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
