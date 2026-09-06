import { ColorValue, StyleSheet } from "react-native";

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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(15,23,42,0.08)",
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  dayButtonSelected: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  dayButtonToday: {
    borderColor: "#2563eb",
  },
  weekDayText: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  weekDayTextSelected: {
    color: "#dbeafe",
  },
  dayNumberText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "900",
  },
  dayNumberTextSelected: {
    color: "#ffffff",
  },
});

export const pageGradient: [ColorValue, ColorValue] = ["#eef2ff", "#ecfdf5"];
export const plannedGradient: [string, string, string] = ["#bfdbfe", "#ddd6fe", "#fef3c7"];
export const doneGradient: [string, string, string] = ["#bbf7d0", "#a7f3d0", "#e0f2fe"];
export const notDoneGradient: [string, string, string] = ["#fecdd3", "#fed7aa", "#fef3c7"];
