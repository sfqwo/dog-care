export const colors = {
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceMuted: "rgba(69,60,65,0.05)",
  surfaceRaised: "rgba(255,255,255,0.95)",
  border: "rgba(69,60,65,0.14)",
  borderStrong: "rgba(69,60,65,0.24)",
  text: "#1D0F0F",
  textMuted: "#453C41",
  textSubtle: "#7B7C81",
  primary: "#1D0F0F",
  primaryPressed: "#453C41",
  primaryText: "#ffffff",
  secondary: "rgba(69,60,65,0.08)",
  secondaryPressed: "rgba(69,60,65,0.14)",
  secondaryText: "#1D0F0F",
  accent: "#7B586B",
  accentPressed: "#654759",
  accentSurface: "rgba(123,88,107,0.12)",
  overlay: "rgba(29,15,15,0.36)",
  danger: "#991b1b",
  dangerSurface: "#fee2e2",
  success: "#166534",
  warningSurface: "#D4DBE2",
} as const;

export const radius = {
  input: 8,
  button: 8,
  control: 10,
  card: 16,
  sheet: 20,
  pill: 999,
} as const;

export const shadows = {
  card: "0px 10px 18px rgba(29, 15, 15, 0.12)",
  cardStrong: "0px 14px 26px rgba(29, 15, 15, 0.18)",
  overlay: "0px 12px 24px rgba(29, 15, 15, 0.2)",
} as const;

export const gradients = {
  page: ["#f8fafc", "#f1f5f9"] as [string, string],
  card: ["#ffffff", "#D4DBE2", "#aeb8c3"] as [string, string, string],
  cardWarm: ["#ffffff", "#eadfe6", "#bf9caf"] as [string, string, string],
  cardMuted: ["#f4f6f8", "#D4DBE2", "#9da8b4"] as [string, string, string],
  cardAccent: ["#fffdfd", "#e7d9e1", "#c3a0b3"] as [string, string, string],
  cardAccentStrong: ["#f8f3f6", "#d0b3c3", "#9d738b"] as [string, string, string],
  danger: ["#fff7f7", "#fee2e2", "#fecaca"] as [string, string, string],
} as const;
