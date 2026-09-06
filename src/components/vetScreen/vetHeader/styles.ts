import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const vetHeaderStyles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBlockEnd: 12,
  },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: radius.card,
    padding: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
