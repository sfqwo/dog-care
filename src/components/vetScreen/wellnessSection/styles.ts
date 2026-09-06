import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const wellnessStyles = StyleSheet.create({
  section: { gap: 16 },
  formColumn: { gap: 12 },
  inlineRow: { flexDirection: "row", gap: 12 },
  inlineField: { flex: 1, minWidth: 0 },
  toggles: { flexDirection: "row", gap: 10 },
  toggle: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.button,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleActive: {
    backgroundColor: colors.dangerSurface,
    borderColor: colors.danger,
  },
  toggleText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  toggleIcon: { color: colors.text },
  toggleIconActive: { color: colors.danger },
});
