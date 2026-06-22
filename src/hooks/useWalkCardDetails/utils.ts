const SHORT = ["#fdf2f8", "#fce7f3", "#ffe4e6"] as const;
const MEDIUM = ["#ecfccb", "#d9f99d", "#bef264"] as const;
const LONG = ["#ede9fe", "#ddd6fe", "#c4b5fd"] as const;

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
