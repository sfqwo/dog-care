import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const styles = StyleSheet.create({
  inputCard: {
    borderRadius: radius.card,
    padding: 20,
    backgroundColor: colors.surfaceRaised,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  addButton: {
    borderRadius: radius.button,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: colors.primary,
    minWidth: 120,
  },
  addButtonText: { color: colors.primaryText, fontWeight: "700", fontSize: 15 },
  hintText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
