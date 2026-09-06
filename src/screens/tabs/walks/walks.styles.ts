import { ColorValue, StyleSheet } from "react-native";
import { colors, gradients } from "@/src/theme";

export const walkStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  recorderHint: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textMuted,
  },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;
