import { ColorValue, StyleSheet } from "react-native";
import { colors, gradients, radius } from "@/src/theme";

export const remindersStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  formColumn: {
    gap: 12,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  inlineField: {
    flex: 1,
  },
  sectionHeader: {
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.surfaceRaised,
    gap: 4,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: colors.textSubtle,
    fontSize: 13,
    fontWeight: "600",
  },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;
export const reminderGradient: [string, string, string] = gradients.cardWarm;
export const overdueGradient: [string, string, string] = gradients.danger;
export const completedGradient: [string, string, string] = gradients.cardMuted;
