import { gradients } from "@/src/theme";

const SHORT = gradients.cardMuted;
const MEDIUM = gradients.cardAccent;
const LONG = gradients.cardAccentStrong;

export function getWalkGradient(minutes: number) {
  if (minutes <= 20) return SHORT;
  if (minutes <= 40) return MEDIUM;
  return LONG;
}

export function getWalkDurationLabel(minutes: number) {
  if (minutes <= 20) return "Быстрая прогулка";
  if (minutes <= 40) return "Баланс движения";
  return "Большое приключение";
}
