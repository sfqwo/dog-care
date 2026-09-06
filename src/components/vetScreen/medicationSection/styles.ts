import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const medicationStyles = StyleSheet.create({
  section: { gap: 16 },
  formColumn: { gap: 12 },
  inlineRow: { flexDirection: "row", gap: 12 },
  inlineField: { flex: 1, minWidth: 0 },
  history: {
    gap: 12,
    borderRadius: radius.card,
    padding: 18,
    backgroundColor: colors.surfaceRaised,
  },
  historyTitle: { color: colors.text, fontSize: 17, fontWeight: "700" },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  historyText: { flex: 1, color: colors.text, fontWeight: "600" },
  historyDate: { color: colors.textSubtle, fontSize: 12 },
});
