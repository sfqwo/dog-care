import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 144,
    minWidth: 144,
    borderRadius: radius.card,
    padding: 14,
    backgroundColor: colors.surfaceRaised,
  },
  statLabel: {
    color: colors.textSubtle,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0,
    flexShrink: 1,
  },
  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
});
