import { ColorValue, StyleSheet } from "react-native";

export const todayStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
});

export const pageGradient: [ColorValue, ColorValue] = ["#eff6ff", "#f0fdf4"];
export const planGradient: [string, string, string] = ["#bfdbfe", "#bbf7d0", "#fef3c7"];
export const dueGradient: [string, string, string] = ["#fde68a", "#fed7aa", "#bfdbfe"];
export const overdueGradient: [string, string, string] = ["#fecdd3", "#fed7aa", "#fef3c7"];
