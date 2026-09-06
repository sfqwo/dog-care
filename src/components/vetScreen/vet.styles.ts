import { ColorValue, StyleSheet } from "react-native";
import { gradients } from "@/src/theme";

export const vetStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  sectionTabsBlock: { gap: 16 },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;
