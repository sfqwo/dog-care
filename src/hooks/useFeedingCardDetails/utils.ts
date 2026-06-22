const LIGHT = ["#faf5ff", "#f5d0fe", "#f0abfc"] as const;
const BALANCED = ["#ecfccb", "#d9f99d", "#bef264"] as const;
const FEAST = ["#fef3c7", "#fde68a", "#fcd34d"] as const;

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
