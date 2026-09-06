import { StyleSheet } from "react-native";
import { colors, radius, shadows } from "@/src/theme";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 24,
    backgroundColor: colors.surfaceRaised,
    boxShadow: shadows.card,
    elevation: 7,
    gap: 10,
  },
  title: { fontSize: 24, fontWeight: "800", color: colors.text },
  subtitle: { color: colors.textMuted, fontSize: 14 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.secondary,
    marginTop: 6,
  },
  badgeText: { color: colors.text, fontWeight: "700", fontSize: 11, letterSpacing: 0.6 },
});
