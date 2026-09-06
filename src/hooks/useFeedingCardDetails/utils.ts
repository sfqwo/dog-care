import { gradients } from "@/src/theme";

const LIGHT = gradients.cardMuted;
const BALANCED = gradients.cardAccent;
const FEAST = gradients.cardAccentStrong;

export function getFeedingGradient(grams: number) {
  if (grams <= 100) return LIGHT;
  if (grams <= 200) return BALANCED;
  return FEAST;
}

export function getFeedingPortionLabel(grams: number) {
  if (grams <= 100) return "Легкий перекус";
  if (grams <= 200) return "Сбалансированная порция";
  return "Праздничный ужин";
}
