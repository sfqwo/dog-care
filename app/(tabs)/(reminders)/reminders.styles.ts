import { ColorValue, StyleSheet } from "react-native";

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
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.92)",
    gap: 4,
  },
  sectionTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "rgba(15,23,42,0.62)",
    fontSize: 13,
    fontWeight: "600",
  },
});

export const pageGradient: [ColorValue, ColorValue] = ["#eefdf8", "#fff7ed"];
export const reminderGradient: [string, string, string] = ["#d9f99d", "#bfdbfe", "#fef3c7"];
export const overdueGradient: [string, string, string] = ["#fecdd3", "#fed7aa", "#fef3c7"];
export const completedGradient: [string, string, string] = ["#e5e7eb", "#f3f4f6", "#ffffff"];
