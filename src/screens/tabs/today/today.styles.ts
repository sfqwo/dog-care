import { ColorValue, StyleSheet } from "react-native";
import { gradients } from "@/src/theme";

export const todayStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;
export const planGradient: [string, string, string] = gradients.cardWarm;
export const dueGradient: [string, string, string] = gradients.cardWarm;
export const overdueGradient: [string, string, string] = gradients.danger;
