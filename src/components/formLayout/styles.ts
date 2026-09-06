import { StyleSheet } from "react-native";
import { colors, radius } from "@/src/theme";

export const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  card: {
    borderRadius: radius.card,
    padding: 18,
    backgroundColor: colors.surfaceRaised,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: radius.control,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },
  toggleIcon: {
    color: colors.text,
  },
  cardBody: {
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
