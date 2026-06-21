import { StyleSheet } from "react-native";

export const medicationStyles = StyleSheet.create({
  section: { gap: 16 },
  formColumn: { gap: 12 },
  inlineRow: { flexDirection: "row", gap: 12 },
  inlineField: { flex: 1, minWidth: 0 },
  history: {
    gap: 12,
    borderRadius: 20,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  historyTitle: { color: "#0f172a", fontSize: 17, fontWeight: "700" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15,23,42,0.15)",
  },
  historyText: { flex: 1, color: "#0f172a", fontWeight: "600" },
  historyDate: { color: "rgba(15,23,42,0.62)", fontSize: 12 },
});
