import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  addButton: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#e28ca1ff",
    minWidth: 120,
  },
  addButtonText: { color: "white", fontWeight: "700", fontSize: 15 }
});
