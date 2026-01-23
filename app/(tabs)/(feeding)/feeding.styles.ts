import { ColorValue, StyleSheet } from "react-native";

export const feedingStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  recorderHint: {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(15,23,42,0.7)",
  },
});

export const pageGradient: [ColorValue, ColorValue] = ["#fff5f7", "#fefce8"];
