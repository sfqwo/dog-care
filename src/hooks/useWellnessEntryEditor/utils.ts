import type { WellnessEntry } from "@dog-care/domain";
import {
  formatCurrentDateInput,
  formatTimeInputFromTimestamp,
  normalizeDecimalInput,
} from "@dog-care/core/utils";
import type { WellnessEntryForm } from "./types";

export const createInitialWellnessForm = (): WellnessEntryForm => ({
  date: formatCurrentDateInput(),
  time: formatTimeInputFromTimestamp(Date.now()),
  appetite: "normal",
  activity: "normal",
  stool: "normal",
  vomiting: false,
  itching: false,
  temperature: "",
  note: "",
});

export function buildWellnessEntry(
  id: string,
  petId: string,
  at: number,
  form: WellnessEntryForm
): WellnessEntry {
  const temperature = form.temperature
    ? Number(normalizeDecimalInput(form.temperature))
    : undefined;
  return {
    id,
    petId,
    at,
    appetite: form.appetite,
    activity: form.activity,
    stool: form.stool,
    vomiting: form.vomiting,
    itching: form.itching,
    temperature,
    note: form.note.trim() || undefined,
  };
}

export function isWellnessTemperatureValid(value: string) {
  if (!value.trim()) return true;
  const temperature = Number(normalizeDecimalInput(value));
  return Number.isFinite(temperature) && temperature >= 30 && temperature <= 45;
}
