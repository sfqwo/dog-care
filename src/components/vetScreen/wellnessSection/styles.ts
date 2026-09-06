import { StyleSheet } from "react-native";

export const wellnessStyles = StyleSheet.create({
  section: { gap: 16 },
  formColumn: { gap: 12 },
  inlineRow: { flexDirection: "row", gap: 12 },
  inlineField: { flex: 1, minWidth: 0 },
  toggles: { flexDirection: "row", gap: 10 },
  toggle: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(15,23,42,0.07)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleActive: {
    backgroundColor: "rgba(254,226,226,0.9)",
    borderColor: "rgba(220,38,38,0.35)",
  },
  toggleText: { color: "#0f172a", fontSize: 13, fontWeight: "700" },
  toggleIcon: { color: "#0f172a" },
  toggleIconActive: { color: "#b91c1c" },
});
