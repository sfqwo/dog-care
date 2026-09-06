import { StyleSheet } from "react-native";
import { colors, radius, shadows } from "@/src/theme";

export const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 20,
    backgroundColor: colors.surfaceRaised,
    gap: 16,
    boxShadow: shadows.card,
    elevation: 6,
  },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  infoValue: {
    color: colors.text,
    fontWeight: "600",
  },
  button: {
    borderRadius: radius.button,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.primaryText,
    fontWeight: "700",
    fontSize: 15,
  },
});
