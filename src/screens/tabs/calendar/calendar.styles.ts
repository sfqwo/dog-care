import { ColorValue, StyleSheet } from "react-native";
import { colors, gradients, radius } from "@/src/theme";

export const calendarStyles = StyleSheet.create({
  screenGradient: { flex: 1 },
  safeArea: { flex: 1 },
  weekRow: {
    flexDirection: "row",
    gap: 8,
  },
  dayButton: {
    width: '12%',
    minHeight: 62,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonToday: {
    borderColor: colors.primary,
  },
  weekDayText: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  weekDayTextSelected: {
    color: colors.primaryText,
  },
  dayNumberText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  dayNumberTextSelected: {
    color: colors.primaryText,
  },
});

export const pageGradient: [ColorValue, ColorValue] = gradients.page;
export const plannedGradient: [string, string, string] = gradients.cardWarm;
export const doneGradient: [string, string, string] = gradients.cardMuted;
export const notDoneGradient: [string, string, string] = gradients.danger;
