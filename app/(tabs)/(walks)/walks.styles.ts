import { ColorValue, StyleSheet } from "react-native";

export const walkStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  recorderHint: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
  },
});

export const pageGradient: [ColorValue, ColorValue] = ["#fdf2f8", "#f5f3ff"];
